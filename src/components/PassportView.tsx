import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Lock, Stamp } from 'lucide-react';
import { NationalPark, StampRecord } from '../types/park';
import { TYPOGRAPHY } from '../styles/typography';
import { ParkStampSvg } from './ParkStampSvg';

interface PassportViewProps {
  parks: NationalPark[];
  stamps: Record<string, StampRecord>;
  travelerName: string;
  onOpenPark: (parkId: string) => void;
  onOpenCheckIn: (parkId: string) => void;
}

const SLOTS_PER_SPREAD = 4; // 2 left page + 2 right page -> 7 spreads for 26 parks

export const PassportView: React.FC<PassportViewProps> = ({
  parks,
  stamps,
  travelerName,
  onOpenPark,
  onOpenCheckIn,
}) => {
  const totalSpreads = Math.ceil(parks.length / SLOTS_PER_SPREAD);
  const [spreadIndex, setSpreadIndex] = useState(0);

  const currentParks = parks.slice(
    spreadIndex * SLOTS_PER_SPREAD,
    (spreadIndex + 1) * SLOTS_PER_SPREAD
  );
  const leftPageParks = currentParks.slice(0, 2);
  const rightPageParks = currentParks.slice(2, 4);

  const conqueredCount = Object.keys(stamps).length;

  const renderSlot = (park: NationalPark) => {
    const stamp = stamps[park.id];
    const isStamped = Boolean(stamp);

    return (
      <div
        key={park.id}
        className="rounded-xl border border-[#E4DFD5] bg-[#FBF9F5] p-4 flex flex-col justify-between gap-3"
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[11px] font-mono text-[#57534E] tabular-nums">
              NO.{String(park.number).padStart(2, '0')} · {park.primaryProvince}
            </p>
            <button
              type="button"
              onClick={() => onOpenPark(park.id)}
              className="text-left cursor-pointer"
            >
              <h3 className={`text-sm text-[#1C1917] hover:text-[#183126] transition-colors line-clamp-1 mt-0.5 ${TYPOGRAPHY.mainHeading}`}>
                {park.name}
              </h3>
            </button>
          </div>
          {!isStamped && <Lock className="w-3.5 h-3.5 text-[#A8A29E] shrink-0 mt-1" />}
        </div>

        <div className="py-2 flex items-center justify-center">
          <button
            type="button"
            onClick={() =>
              isStamped ? onOpenPark(park.id) : onOpenCheckIn(park.id)
            }
            className="cursor-pointer focus-visible:outline-2 focus-visible:outline-[#183126] rounded-full"
            title={isStamped ? 'ดูรายละเอียดตราประทับ' : 'คลิกเพื่อประทับตราพิชิต'}
          >
            <ParkStampSvg
              park={park}
              stamp={stamp}
              size="md"
              rotate={park.number % 2 === 0 ? -5 : 4}
            />
          </button>
        </div>

        <div className="pt-2 border-t border-[#E4DFD5]/80 flex items-center justify-between gap-2 text-xs">
          {isStamped ? (
            <>
              <span className="font-mono text-[#9A3412] tabular-nums">
                {stamp.visitDate}
              </span>
              <button
                type="button"
                onClick={() => onOpenPark(park.id)}
                className="font-medium text-[#183126] hover:underline cursor-pointer"
              >
                ดูบันทึก
              </button>
            </>
          ) : (
            <>
              <span className="text-[#78716C]">รอการเดินทาง</span>
              <button
                type="button"
                onClick={() => onOpenCheckIn(park.id)}
                className="inline-flex items-center gap-1 font-medium text-[#183126] hover:underline cursor-pointer"
              >
                <Stamp className="w-3.5 h-3.5" />
                ประทับตรา
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E4DFD5] pb-6">
        <div>
          <p className={`text-xs text-[#57534E] uppercase ${TYPOGRAPHY.enHeading}`}>
            Official Digital Travel Passport · Volume I
          </p>
          <h1 className={`mt-2 text-3xl sm:text-4xl text-[#1C1917] ${TYPOGRAPHY.mainHeading}`}>
            สมุดสะสมตราประทับ 26 อุทยานแห่งชาติ
          </h1>
          <p className={`mt-1.5 text-sm text-[#57534E] ${TYPOGRAPHY.body}`}>
            ผู้ถือหนังสือเดินทาง: <span className={`${TYPOGRAPHY.sectionHeading} text-[#1C1917]`}>{travelerName}</span> · สะสมแล้ว{' '}
            <span className={`text-[#183126] ${TYPOGRAPHY.achievement}`}>
              {conqueredCount} / {parks.length}
            </span>{' '}
            ตราประทับ
          </p>
        </div>

        {/* Page Flip Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            disabled={spreadIndex === 0}
            onClick={() => setSpreadIndex((i) => Math.max(0, i - 1))}
            className={`min-h-[42px] px-3.5 py-2 rounded-lg border border-[#D6CEBE] bg-[#FBF9F5] text-xs text-[#1C1917] hover:bg-[#EBE6DF] disabled:opacity-40 transition-colors inline-flex items-center gap-1.5 cursor-pointer ${TYPOGRAPHY.button}`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>หน้าก่อนหน้า</span>
          </button>
          <span className="px-3 font-mono text-xs text-[#57534E] tabular-nums">
            หน้า {spreadIndex + 1} / {totalSpreads}
          </span>
          <button
            type="button"
            disabled={spreadIndex === totalSpreads - 1}
            onClick={() => setSpreadIndex((i) => Math.min(totalSpreads - 1, i + 1))}
            className={`min-h-[42px] px-3.5 py-2 rounded-lg border border-[#D6CEBE] bg-[#FBF9F5] text-xs text-[#1C1917] hover:bg-[#EBE6DF] disabled:opacity-40 transition-colors inline-flex items-center gap-1.5 cursor-pointer ${TYPOGRAPHY.button}`}
          >
            <span>หน้าถัดไป</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Two-Page Archival Passport Spread */}
      <motion.div
        key={spreadIndex}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="rounded-3xl border-2 border-[#D6CEBE] bg-[#EFECE4] p-3 sm:p-5 shadow-md"
      >
        <div className="rounded-2xl border border-[#D6CEBE] passport-paper overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Left Passport Page */}
          <div className="lg:col-span-6 p-5 sm:p-7 space-y-5">
            <div className={`flex items-center justify-between text-[11px] text-[#78716C] border-b border-[#E4DFD5] pb-2 ${TYPOGRAPHY.enHeading}`}>
              <span>E-SAN LOW TRIP · PASSPORT</span>
              <span className="tabular-nums">PAGE {String(spreadIndex * 2 + 1).padStart(2, '0')}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {leftPageParks.map(renderSlot)}
            </div>
          </div>

          {/* Center Stitched Spine */}
          <div className="hidden lg:flex lg:col-span-0 w-0 relative">
            <div className="absolute inset-y-0 -left-3 w-6 passport-spine pointer-events-none" />
          </div>

          {/* Right Passport Page */}
          <div className="lg:col-span-6 p-5 sm:p-7 space-y-5 border-t lg:border-t-0 lg:border-l border-[#D6CEBE]">
            <div className={`flex items-center justify-between text-[11px] text-[#78716C] border-b border-[#E4DFD5] pb-2 ${TYPOGRAPHY.enHeading}`}>
              <span>DEPARTMENT OF NATIONAL PARKS · ISAN</span>
              <span className="tabular-nums">PAGE {String(spreadIndex * 2 + 2).padStart(2, '0')}</span>
            </div>
            {rightPageParks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {rightPageParks.map(renderSlot)}
              </div>
            ) : (
              <div className="h-full min-h-[260px] rounded-xl border border-dashed border-[#D6CEBE] flex flex-col items-center justify-center p-6 text-center">
                <p className={`text-lg text-[#183126] ${TYPOGRAPHY.mainHeading}`}>
                  บันทึกครบทั้ง 26 อุทยาน
                </p>
                <p className={`text-xs text-[#57534E] mt-2 max-w-xs ${TYPOGRAPHY.body}`}>
                  ขอแสดงความยินดีกับการเดินทางทั่วผืนป่าอีสาน — ขอบคุณที่ร่วมอนุรักษ์ธรรมชาติไทย
                </p>
                <p className={`mt-4 text-xs text-[#78716C] ${TYPOGRAPHY.achievement}`}>
                  {conqueredCount} / {parks.length} STAMPED
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Quick Spread Jumper */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {Array.from({ length: totalSpreads }).map((_, idx) => {
          const startNum = idx * SLOTS_PER_SPREAD + 1;
          const endNum = Math.min(parks.length, (idx + 1) * SLOTS_PER_SPREAD);
          return (
            <button
              key={idx}
              type="button"
              onClick={() => setSpreadIndex(idx)}
              className={`px-3.5 py-2 min-h-[38px] rounded-lg font-mono text-xs transition-colors tabular-nums cursor-pointer ${
                spreadIndex === idx
                  ? 'bg-[#183126] text-white'
                  : 'border border-[#E4DFD5] bg-[#FBF9F5] text-[#57534E] hover:border-[#183126]/40'
              }`}
            >
              #{startNum}–{endNum}
            </button>
          );
        })}
      </div>
    </div>
  );
};
