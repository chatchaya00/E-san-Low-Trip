import React from 'react';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  ExternalLink,
  MapPin,
  Mountain,
  Stamp,
  Trash2,
} from 'lucide-react';
import { NationalPark, StampRecord } from '../types/park';
import { TYPOGRAPHY } from '../styles/typography';
import { ParkImage } from './ParkImage';
import { ParkStampSvg } from './ParkStampSvg';
import { IsanMapSvg } from './IsanMapSvg';

interface ParkDetailViewProps {
  park: NationalPark;
  allParks: NationalPark[];
  stamps: Record<string, StampRecord>;
  onBack: () => void;
  onSelectPark: (parkId: string) => void;
  onOpenCheckIn: (parkId: string) => void;
  onRequestRemoveStamp: (parkId: string) => void;
}

export const ParkDetailView: React.FC<ParkDetailViewProps> = ({
  park,
  allParks,
  stamps,
  onBack,
  onSelectPark,
  onOpenCheckIn,
  onRequestRemoveStamp,
}) => {
  const stamp = stamps[park.id];
  const isStamped = Boolean(stamp);

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${park.coordinates.lat},${park.coordinates.lng}`;

  return (
    <div className="space-y-8">
      {/* Top Back Strip */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 min-h-[40px] px-3 py-1.5 rounded-lg text-sm font-medium text-[#57534E] hover:text-[#1C1917] hover:bg-[#EBE6DF] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>กลับไปหน้ารายชื่ออุทยาน</span>
        </button>

        <div className="text-xs font-mono text-[#57534E] tabular-nums">
          {park.code} · {park.subRegion}
        </div>
      </div>

      {/* Main Editorial Header & Cover */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-7 rounded-2xl overflow-hidden border border-[#E4DFD5] bg-[#EBE6DF] min-h-[280px] lg:min-h-[400px]">
          <ParkImage
            src={park.coverImage}
            alt={park.name}
            className="w-full h-full object-cover"
            fallbackTitle={park.name}
          />
        </div>

        <div className="lg:col-span-5 rounded-2xl border border-[#E4DFD5] bg-[#FBF9F5] p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <p className={`text-xs text-[#57534E] ${TYPOGRAPHY.body}`}>
              จังหวัด{park.provinces.join(' · ')}
            </p>
            <h1 className={`mt-2 text-2xl sm:text-3xl text-[#1C1917] ${TYPOGRAPHY.mainHeading}`}>
              {park.name}
            </h1>
            <p className={`text-xs text-[#57534E] mt-1.5 uppercase ${TYPOGRAPHY.enHeading}`}>
              {park.englishName}
            </p>

            <div className="mt-6 pt-5 border-t border-[#E4DFD5] flex items-center justify-between gap-4">
              <div>
                <p className={`text-xs text-[#57534E] ${TYPOGRAPHY.body}`}>สถานะในพาสปอร์ต</p>
                <p
                  className={`mt-1 text-sm inline-flex items-center gap-1.5 ${TYPOGRAPHY.sectionHeading} ${
                    isStamped ? 'text-[#9A3412]' : 'text-[#57534E]'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {isStamped
                    ? `พิชิตแล้ว (${stamp.visitDate})`
                    : 'ยังไม่ได้รับตราประทับ'}
                </p>
              </div>

              <ParkStampSvg park={park} stamp={stamp} size="sm" rotate={-5} />
            </div>

            <dl className={`mt-5 pt-5 border-t border-[#E4DFD5] space-y-2.5 text-xs ${TYPOGRAPHY.body}`}>
              <div className="flex justify-between gap-4">
                <dt className="text-[#57534E] inline-flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> ฤดูท่องเที่ยวแนะนำ
                </dt>
                <dd className="text-[#1C1917] text-right">{park.bestSeason}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[#57534E] inline-flex items-center gap-1.5">
                  <Mountain className="w-3.5 h-3.5" /> ระดับความสูง
                </dt>
                <dd className="text-[#1C1917] text-right tabular-nums">{park.elevation}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[#57534E] inline-flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" /> พื้นที่โดยประมาณ
                </dt>
                <dd className="text-[#1C1917] text-right tabular-nums">
                  {park.areaSqKm.toLocaleString()} ตร.กม.
                </dd>
              </div>
            </dl>
          </div>

          <div className="mt-6 pt-5 border-t border-[#E4DFD5] flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onOpenCheckIn(park.id)}
              className={`flex-1 px-5 py-3 min-h-[44px] rounded-xl bg-[#183126] text-white text-sm hover:bg-[#11241B] transition-colors inline-flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer ${TYPOGRAPHY.button}`}
            >
              <Stamp className="w-4 h-4" />
              <span>{isStamped ? 'แก้ไขบันทึกการพิชิต' : 'บันทึกการพิชิตอุทยาน'}</span>
            </button>

            {isStamped && (
              <button
                type="button"
                onClick={() => onRequestRemoveStamp(park.id)}
                className="px-3.5 py-3 min-h-[44px] rounded-xl border border-[#D6CEBE] bg-white text-[#9A3412] hover:bg-[#9A3412]/10 transition-colors inline-flex items-center justify-center cursor-pointer"
                aria-label="ลบตราประทับนี้"
                title="ลบตราประทับนี้"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* History, Highlights, and Travel Memory */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          <section className="rounded-2xl border border-[#E4DFD5] bg-[#FBF9F5] p-6 sm:p-8">
            <h2 className={`text-xl text-[#1C1917] ${TYPOGRAPHY.sectionHeading}`}>
              ประวัติและข้อมูลเบื้องต้น
            </h2>
            <p className={`mt-3 text-base text-[#57534E] ${TYPOGRAPHY.body}`}>
              {park.history}
            </p>
          </section>

          <section className="rounded-2xl border border-[#E4DFD5] bg-[#FBF9F5] p-6 sm:p-8">
            <h2 className={`text-xl text-[#1C1917] ${TYPOGRAPHY.sectionHeading}`}>
              จุดเด่นและสถานที่ท่องเที่ยวห้ามพลาด
            </h2>
            <ul className={`mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 ${TYPOGRAPHY.body}`}>
              {park.highlights.map((item, idx) => (
                <li
                  key={idx}
                  className="rounded-xl border border-[#E4DFD5] bg-[#F7F4EE] px-4 py-3 text-sm text-[#1C1917] flex items-start gap-2.5"
                >
                  <span className="font-mono text-xs text-[#183126] mt-0.5 tabular-nums">
                    0{idx + 1}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {stamp && (
            <section className="rounded-2xl border border-[#E4DFD5] bg-[#FBF9F5] p-6 sm:p-8">
              <div className="flex items-center justify-between gap-2">
                <h2 className={`text-xl text-[#1C1917] ${TYPOGRAPHY.sectionHeading}`}>
                  บันทึกการเดินทางของคุณ
                </h2>
                <span className="text-xs font-mono text-[#9A3412] tabular-nums">
                  {stamp.verificationMethod === 'qr-scan'
                    ? 'ยืนยันผ่าน QR Code'
                    : 'ยืนยันโดยเจ้าหน้าที่'}{' '}
                  · {stamp.verificationCode}
                </span>
              </div>

              {stamp.photoDataUrl && (
                <div className="mt-4 rounded-xl overflow-hidden border border-[#E4DFD5]">
                  <img
                    src={stamp.photoDataUrl}
                    alt={`ภาพความทรงจำที่ ${park.name}`}
                    className="w-full max-h-80 object-cover"
                  />
                </div>
              )}

              <p className={`mt-4 text-sm text-[#1C1917] ${TYPOGRAPHY.body}`}>
                {stamp.note || 'ไม่ได้ระบุข้อความบันทึกความทรงจำเพิ่มเติม'}
              </p>
            </section>
          )}
        </div>

        {/* Location & Interactive Map */}
        <div className="lg:col-span-5 space-y-6">
          <section className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <h2 className={`text-xl text-[#1C1917] ${TYPOGRAPHY.sectionHeading}`}>
                ที่ตั้งและพิกัดแผนที่
              </h2>
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-1.5 text-xs text-[#183126] hover:underline whitespace-nowrap ${TYPOGRAPHY.button}`}
              >
                <span>เปิดใน Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            <IsanMapSvg
              parks={allParks}
              stamps={stamps}
              activeParkId={park.id}
              onSelectPark={onSelectPark}
            />
          </section>

          <section className="rounded-2xl border border-[#E4DFD5] bg-[#FBF9F5] p-6 flex items-center gap-5">
            <ParkStampSvg park={park} stamp={stamp} size="md" rotate={-4} />
            <div>
              <p className={`text-xs text-[#57534E] ${TYPOGRAPHY.body}`}>
                ตราประทับประจำอุทยาน
              </p>
              <h3 className={`text-base text-[#1C1917] mt-1 ${TYPOGRAPHY.enHeading}`}>
                {park.stampTitle}
              </h3>
              <p className={`text-xs text-[#57534E] mt-1 ${TYPOGRAPHY.body}`}>
                {park.stampTagline}
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
