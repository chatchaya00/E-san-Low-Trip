import React from 'react';
import { Calendar, Compass, Edit3, ShieldCheck, Stamp } from 'lucide-react';
import { AppView, NationalPark, StampRecord } from '../types/park';
import { TYPOGRAPHY } from '../styles/typography';
import { ParkStampSvg } from './ParkStampSvg';

interface CollectionViewProps {
  parks: NationalPark[];
  stamps: Record<string, StampRecord>;
  onNavigate: (view: AppView) => void;
  onOpenPark: (parkId: string) => void;
  onOpenCheckIn: (parkId: string) => void;
}

export const CollectionView: React.FC<CollectionViewProps> = ({
  parks,
  stamps,
  onNavigate,
  onOpenPark,
  onOpenCheckIn,
}) => {
  const collectedItems = Object.values(stamps)
    .sort((a, b) => b.visitDate.localeCompare(a.visitDate))
    .map((stamp) => ({
      stamp,
      park: parks.find((p) => p.id === stamp.parkId),
    }))
    .filter((item): item is { stamp: StampRecord; park: NationalPark } => Boolean(item.park));

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E4DFD5] pb-6">
        <div>
          <p className={`text-xs text-[#57534E] uppercase ${TYPOGRAPHY.enHeading}`}>
            My Stamp Collection & Travel Memories
          </p>
          <h1 className={`mt-2 text-3xl sm:text-4xl text-[#1C1917] ${TYPOGRAPHY.mainHeading}`}>
            คอลเลกชันตราประทับและบันทึกความทรงจำ
          </h1>
          <p className={`mt-2 text-sm text-[#57534E] ${TYPOGRAPHY.body}`}>
            รวบรวมตราประทับทุกดวงที่คุณยืนยันการเดินทางสำเร็จ พร้อมภาพถ่ายและบันทึกเรื่องราวจากอุทยาน
          </p>
        </div>

        <div className="text-sm text-[#183126]">
          <span className={TYPOGRAPHY.body}>สะสมแล้ว </span>
          <span className={TYPOGRAPHY.achievement}>
            {collectedItems.length} / {parks.length}
          </span>
          <span className={TYPOGRAPHY.body}> ดวง</span>
        </div>
      </div>

      {collectedItems.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#D6CEBE] bg-[#FBF9F5] p-12 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[#EBE6DF] text-[#183126] flex items-center justify-center mx-auto">
            <Stamp className="w-7 h-7" />
          </div>
          <div>
            <h2 className={`text-xl text-[#1C1917] ${TYPOGRAPHY.sectionHeading}`}>
              คอลเลกชันตราประทับของคุณยังว่างอยู่
            </h2>
            <p className={`text-sm text-[#57534E] mt-1.5 max-w-md mx-auto ${TYPOGRAPHY.body}`}>
              เมื่อคุณเดินทางไปถึงอุทยานแห่งชาติและยืนยันด้วย QR Code หรือรหัสเจ้าหน้าที่ ตราประทับและภาพถ่ายจะมาแสดงในหน้านี้โดยอัตโนมัติ
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('explore')}
            className={`px-5 py-3 min-h-[44px] rounded-xl bg-[#183126] text-white text-sm hover:bg-[#11241B] transition-colors inline-flex items-center gap-2 cursor-pointer ${TYPOGRAPHY.button}`}
          >
            <Compass className="w-4 h-4" />
            <span>สำรวจรายชื่อ 26 อุทยาน</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {collectedItems.map(({ park, stamp }) => (
            <article
              key={park.id}
              className="rounded-2xl border border-[#E4DFD5] bg-[#FBF9F5] overflow-hidden flex flex-col justify-between"
            >
              <div>
                {stamp.photoDataUrl && (
                  <div className="aspect-[16/9] overflow-hidden border-b border-[#E4DFD5] bg-[#EBE6DF]">
                    <img
                      src={stamp.photoDataUrl}
                      alt={`ภาพความทรงจำ ณ ${park.name}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="p-6 flex flex-col sm:flex-row items-start gap-5">
                  <div className="shrink-0 self-center sm:self-start">
                    <ParkStampSvg
                      park={park}
                      stamp={stamp}
                      size="md"
                      rotate={park.number % 2 === 0 ? -5 : 4}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-mono text-[#57534E] tabular-nums">
                      {park.code} · จ.{park.provinces.join(', ')}
                    </p>
                    <button
                      type="button"
                      onClick={() => onOpenPark(park.id)}
                      className="text-left cursor-pointer"
                    >
                      <h2 className={`mt-1 text-xl text-[#1C1917] hover:text-[#183126] transition-colors ${TYPOGRAPHY.mainHeading}`}>
                        {park.name}
                      </h2>
                    </button>

                    <div className={`mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#57534E] ${TYPOGRAPHY.body}`}>
                      <span className="inline-flex items-center gap-1.5 font-mono tabular-nums">
                        <Calendar className="w-3.5 h-3.5" />
                        {stamp.visitDate}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#183126]" />
                        {stamp.verificationMethod === 'qr-scan'
                          ? 'QR Code ประจำอุทยาน'
                          : 'รหัสเจ้าหน้าที่'}
                      </span>
                    </div>

                    <p className={`mt-3 text-sm text-[#1C1917] ${TYPOGRAPHY.body}`}>
                      {stamp.note || 'บันทึกการเดินทางเรียบร้อยแล้ว'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-6 py-3.5 border-t border-[#E4DFD5] bg-[#F7F4EE]/70 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => onOpenPark(park.id)}
                  className={`text-xs text-[#183126] hover:underline cursor-pointer ${TYPOGRAPHY.button}`}
                >
                  เปิดหน้าข้อมูลอุทยาน
                </button>
                <button
                  type="button"
                  onClick={() => onOpenCheckIn(park.id)}
                  className={`inline-flex items-center gap-1.5 text-xs text-[#57534E] hover:text-[#1C1917] cursor-pointer ${TYPOGRAPHY.button}`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  แก้ไขบันทึก/รูปภาพ
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
