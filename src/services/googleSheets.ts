import { NationalPark, SheetsSyncConfig, StampRecord } from '../types/park';

const SHEETS_API_BASE = 'https://sheets.googleapis.com/v4/spreadsheets';

export function extractSpreadsheetId(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  const urlMatch = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (urlMatch?.[1]) return urlMatch[1];
  if (/^[a-zA-Z0-9-_]{20,}$/.test(trimmed)) return trimmed;
  return null;
}

export async function getSpreadsheetMetadata(
  accessToken: string,
  spreadsheetId: string
): Promise<{ title: string; sheetTitles: string[]; spreadsheetUrl: string }> {
  const res = await fetch(
    `${SHEETS_API_BASE}/${encodeURIComponent(spreadsheetId)}?fields=properties.title,spreadsheetUrl,sheets.properties.title`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `ไม่สามารถอ่านข้อมูล Google Sheet ได้ (${res.status})`);
  }
  const data = await res.json();
  const sheetTitles: string[] = (data.sheets || [])
    .map((s: { properties?: { title?: string } }) => s.properties?.title)
    .filter(Boolean);

  return {
    title: data.properties?.title || 'E-san low Trip Passport',
    sheetTitles,
    spreadsheetUrl: data.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${spreadsheetId}`,
  };
}

export async function createPassportSpreadsheet(
  accessToken: string,
  travelerName: string
): Promise<SheetsSyncConfig> {
  const title = `E-san low Trip — สมุดพาสปอร์ต (${travelerName || 'นักเดินทาง'})`;
  const res = await fetch(SHEETS_API_BASE, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: {
        title,
        locale: 'th_TH',
      },
      sheets: [
        {
          properties: {
            title: 'StampLog',
            gridProperties: { frozenRowCount: 1 },
          },
        },
        {
          properties: {
            title: 'Summary',
            gridProperties: { frozenRowCount: 1 },
          },
        },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `สร้าง Google Sheet ไม่สำเร็จ (${res.status})`);
  }

  const data = await res.json();
  const tabName = data.sheets?.[0]?.properties?.title || 'StampLog';

  return {
    spreadsheetId: data.spreadsheetId,
    spreadsheetTitle: data.properties?.title || title,
    spreadsheetUrl: data.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${data.spreadsheetId}`,
    sheetTabName: tabName,
    lastSyncedAt: null,
  };
}

export async function syncStampsToSheet(
  accessToken: string,
  config: SheetsSyncConfig,
  parks: NationalPark[],
  stamps: Record<string, StampRecord>,
  travelerName: string
): Promise<SheetsSyncConfig> {
  const meta = await getSpreadsheetMetadata(accessToken, config.spreadsheetId);
  const targetTab = meta.sheetTitles.includes(config.sheetTabName)
    ? config.sheetTabName
    : meta.sheetTitles[0];

  if (!targetTab) {
    throw new Error('ไม่พบแผ่นงาน (Sheet Tab) ภายในสเปรดชีตนี้');
  }

  const header = [
    'Park ID',
    'ลำดับ',
    'ชื่ออุทยานแห่งชาติ',
    'จังหวัด',
    'ภูมิภาคย่อย',
    'สถานะ',
    'วันที่พิชิต',
    'วิธียืนยัน',
    'รหัสยืนยัน',
    'บันทึกความทรงจำ',
    'เวลาที่ประทับตรา',
  ];

  const rows = parks.map((park) => {
    const stamp = stamps[park.id];
    return [
      park.id,
      String(park.number),
      park.name,
      park.provinces.join(', '),
      park.subRegion,
      stamp ? 'พิชิตแล้ว' : 'ยังไม่พิชิต',
      stamp?.visitDate || '',
      stamp ? (stamp.verificationMethod === 'qr-scan' ? 'QR Code ประจำอุทยาน' : 'รหัสเจ้าหน้าที่') : '',
      stamp?.verificationCode || '',
      stamp?.note || '',
      stamp?.stampedAt || '',
    ];
  });

  const values = [header, ...rows];
  const encodedRange = encodeURIComponent(`'${targetTab}'!A1:K${values.length}`);

  const clearRes = await fetch(
    `${SHEETS_API_BASE}/${encodeURIComponent(config.spreadsheetId)}/values/${encodeURIComponent(`'${targetTab}'!A1:K100`)}:clear`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  if (!clearRes.ok) {
    const err = await clearRes.json().catch(() => ({}));
    throw new Error(err?.error?.message || `ไม่สามารถเคลียร์ข้อมูลเดิมใน Sheet ได้ (${clearRes.status})`);
  }

  const updateRes = await fetch(
    `${SHEETS_API_BASE}/${encodeURIComponent(config.spreadsheetId)}/values/${encodedRange}?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        range: `'${targetTab}'!A1:K${values.length}`,
        majorDimension: 'ROWS',
        values,
      }),
    }
  );

  if (!updateRes.ok) {
    const err = await updateRes.json().catch(() => ({}));
    throw new Error(err?.error?.message || `บันทึกข้อมูลลง Google Sheets ไม่สำเร็จ (${updateRes.status})`);
  }

  // If Summary tab exists, update summary overview too
  if (meta.sheetTitles.includes('Summary')) {
    const conqueredCount = Object.keys(stamps).length;
    const summaryValues = [
      ['E-san low Trip — สรุปความคืบหน้าสมุดพาสปอร์ต', ''],
      ['นักเดินทาง', travelerName],
      ['จำนวนอุทยานที่พิชิตแล้ว', `${conqueredCount} / ${parks.length}`],
      ['อัปเดตล่าสุด', new Date().toLocaleString('th-TH')],
    ];
    await fetch(
      `${SHEETS_API_BASE}/${encodeURIComponent(config.spreadsheetId)}/values/${encodeURIComponent("'Summary'!A1:B4")}?valueInputOption=USER_ENTERED`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          range: "'Summary'!A1:B4",
          majorDimension: 'ROWS',
          values: summaryValues,
        }),
      }
    ).catch(() => null);
  }

  return {
    ...config,
    spreadsheetTitle: meta.title,
    spreadsheetUrl: meta.spreadsheetUrl,
    sheetTabName: targetTab,
    lastSyncedAt: new Date().toISOString(),
  };
}

export async function loadStampsFromSheet(
  accessToken: string,
  spreadsheetId: string,
  existingStamps: Record<string, StampRecord>,
  validParkIds: Set<string>
): Promise<{
  importedCount: number;
  mergedStamps: Record<string, StampRecord>;
  config: SheetsSyncConfig;
}> {
  const meta = await getSpreadsheetMetadata(accessToken, spreadsheetId);
  const targetTab = meta.sheetTitles.includes('StampLog') ? 'StampLog' : meta.sheetTitles[0];
  if (!targetTab) {
    throw new Error('ไม่พบแผ่นงานในสเปรดชีตที่ระบุ');
  }

  const res = await fetch(
    `${SHEETS_API_BASE}/${encodeURIComponent(spreadsheetId)}/values/${encodeURIComponent(`'${targetTab}'!A2:K100`)}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `อ่านข้อมูลจาก Google Sheet ไม่สำเร็จ (${res.status})`);
  }

  const data = await res.json();
  const rows: string[][] = data.values || [];
  const merged = { ...existingStamps };
  let importedCount = 0;

  for (const row of rows) {
    const [parkId, , , , , status, visitDate, methodLabel, verificationCode, note, stampedAt] = row;
    if (!parkId || !validParkIds.has(parkId)) continue;
    if (status !== 'พิชิตแล้ว' && !visitDate) continue;

    merged[parkId] = {
      parkId,
      visitDate: visitDate || new Date().toISOString().slice(0, 10),
      stampedAt: stampedAt || new Date().toISOString(),
      verificationMethod: methodLabel?.includes('QR') ? 'qr-scan' : 'ranger-pin',
      verificationCode: verificationCode || 'SHEETS-SYNC',
      note: note || '',
      photoDataUrl: existingStamps[parkId]?.photoDataUrl,
    };
    importedCount += 1;
  }

  return {
    importedCount,
    mergedStamps: merged,
    config: {
      spreadsheetId,
      spreadsheetTitle: meta.title,
      spreadsheetUrl: meta.spreadsheetUrl,
      sheetTabName: targetTab,
      lastSyncedAt: new Date().toISOString(),
    },
  };
}
