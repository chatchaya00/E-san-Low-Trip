import React, { useState } from 'react';
import { CheckCircle2, CircleDashed, Compass, Flag } from 'lucide-react';
import { REGIONAL_MISSIONS } from '../data/isanParks';
import { NationalPark, StampRecord } from '../types/park';
import { TYPOGRAPHY } from '../styles/typography';
import { ParkStampSvg } from './ParkStampSvg';

interface MissionsViewProps {
  parks: NationalPark[];
  stamps: Record<string, StampRecord>;
  onOpenPark: (parkId: string) => void;
  onOpenCheckIn: (parkId: string) => void;
}

export const MissionsView: React.FC<MissionsViewProps> = ({
  parks,
  stamps,
  onOpenPark,
  onOpenCheckIn,
}) => {
  const [tab, setTab] = useState<'pending' | 'completed'>('pending');

  const pendingParks = parks.filter((p) => !stamps[p.id]);
  const completedParks = parks.filter((p) => Boolean(stamps[p.id]));

  const activeList = tab === 'pending' ? pendingParks : completedParks;

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E4DFD5] pb-6">
        <div>
          <p className={`text-xs text-[#57534E] uppercase ${TYPOGRAPHY.enHeading}`}>
            Regional Milestones & Checklists
          </p>
          <h1 className={`mt-2 text-3xl sm:text-4xl text-[#1C1917] ${TYPOGRAPHY.mainHeading}`}>
            ภารกิจพิชิต 26 อุทยานแห่งชาติ
          </h1>
          <p className={`mt-2 text-sm text-[#57534E] ${TYPOGRAPHY.body}`}>
            ติดตามภารกิจรายภูมิภาคและรายการอุทยานที่พิชิตแล้วเทียบกับอุทยานที่รอการออกเดินทาง
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 rounded-xl bg-[#EBE6DF] self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setTab('pending')}
            className={`px-4 py-2 min-h-[40px] rounded-lg text-xs transition-colors whitespace-nowrap cursor-pointer ${TYPOGRAPHY.button} ${
              tab === 'pending'
                ? 'bg-[#FBF9F5] text-[#183126] shadow-sm'
                : 'text-[#57534E] hover:text-[#1C1917]'
            }`}
          >
            ยังไม่พิชิต (<span className={TYPOGRAPHY.achievement}>{pendingParks.length}</span>)
          </button>
          <button
            type="button"
            onClick={() => setTab('completed')}
            className={`px-4 py-2 min-h-[40px] rounded-lg text-xs transition-colors whitespace-nowrap cursor-pointer ${TYPOGRAPHY.button} ${
              tab === 'completed'
                ? 'bg-[#FBF9F5] text-[#183126] shadow-sm'
                : 'text-[#57534E] hover:text-[#1C1917]'
            }`}
          >
            พิชิตแล้ว (<span className={TYPOGRAPHY.achievement}>{completedParks.length}</span>)
          </button>
        </div>
      </div>

      {/* Regional Milestone Cards */}
      <section aria-label="ภารกิจประจำเส้นทางภูมิภาค">
        <h2 className={`text-xl text-[#1C1917] mb-4 ${TYPOGRAPHY.sectionHeading}`}>
          เส้นทางภารกิจ 4 ภูมิภาคอีสาน
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {REGIONAL_MISSIONS.map((tier) => {
            const doneCount = tier.parkIds.filter((id) => Boolean(stamps[id])).length;
            const total = tier.parkIds.length;
            const pct = Math.round((doneCount / total) * 100);
            const isTierDone = doneCount === total;

            return (
              <div
                key={tier.id}
                className="rounded-2xl border border-[#E4DFD5] bg-[#FBF9F5] p-5 space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className={`text-base text-[#1C1917] ${TYPOGRAPHY.sectionHeading}`}>
                      {tier.title}
                    </h3>
                    <p className={`text-xs text-[#57534E] mt-1 ${TYPOGRAPHY.body}`}>{tier.subtitle}</p>
                  </div>
                  <span
                    className={`text-sm shrink-0 ${TYPOGRAPHY.achievement} ${
                      isTierDone ? 'text-[#9A3412]' : 'text-[#183126]'
                    }`}
                  >
                    {doneCount}/{total}
                  </span>
                </div>

                <div className="h-2 w-full rounded-full bg-[#EBE6DF] overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isTierDone ? 'bg-[#9A3412]' : 'bg-[#183126]'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <p className={`text-xs text-[#57534E] ${TYPOGRAPHY.body}`}>
                  {isTierDone
                    ? 'พิชิตครบทุกอุทยานในเส้นทางนี้แล้ว'
                    : `เหลืออีก ${total - doneCount} อุทยานเพื่อสำเร็จภารกิจเส้นทางนี้`}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Mission Checklist */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className={`text-xl text-[#1C1917] ${TYPOGRAPHY.sectionHeading}`}>
            {tab === 'pending' ? 'รายการอุทยานที่รอการพิชิต' : 'รายการอุทยานที่พิชิตสำเร็จแล้ว'}
          </h2>
          <span className="text-xs font-mono text-[#57534E] tabular-nums">
            {activeList.length} แห่ง
          </span>
        </div>

        {activeList.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#D6CEBE] bg-[#FBF9F5] p-10 text-center">
            {tab === 'pending' ? (
              <>
                <Flag className="w-8 h-8 text-[#9A3412] mx-auto mb-2" />
                <p className={`text-base text-[#1C1917] ${TYPOGRAPHY.mainHeading}`}>
                  ยอดเยี่ยม! คุณพิชิตครบทุกภารกิจแล้ว
                </p>
                <p className={`text-sm text-[#57534E] mt-1 ${TYPOGRAPHY.body}`}>
                  ไม่เหลืออุทยานที่ค้างอยู่ในภารกิจอีกต่อไป
                </p>
              </>
            ) : (
              <>
                <Compass className="w-8 h-8 text-[#57534E] mx-auto mb-2" />
                <p className={`text-base text-[#1C1917] ${TYPOGRAPHY.mainHeading}`}>
                  ยังไม่มีภารกิจที่พิชิตสำเร็จ
                </p>
                <p className={`text-sm text-[#57534E] mt-1 ${TYPOGRAPHY.body}`}>
                  เริ่มต้นเช็กอินเมื่อเดินทางถึงอุทยานแห่งแรกในแท็บ "ยังไม่พิชิต"
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="divide-y divide-[#E4DFD5] rounded-2xl border border-[#E4DFD5] bg-[#FBF9F5] overflow-hidden">
            {activeList.map((park) => {
              const stamp = stamps[park.id];
              const isStamped = Boolean(stamp);

              return (
                <div
                  key={park.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#F7F4EE]/70 transition-colors"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="shrink-0">
                      {isStamped ? (
                        <ParkStampSvg park={park} stamp={stamp} size="sm" rotate={-4} />
                      ) : (
                        <div className="w-12 h-12 rounded-xl border border-[#E4DFD5] bg-[#F7F4EE] flex items-center justify-center text-[#57534E]">
                          <CircleDashed className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-mono text-[#57534E] tabular-nums">
                        {park.code} · จ.{park.provinces.join(', ')} · {park.subRegion}
                      </p>
                      <button
                        type="button"
                        onClick={() => onOpenPark(park.id)}
                        className="text-left cursor-pointer"
                      >
                        <h3 className={`text-base text-[#1C1917] hover:text-[#183126] transition-colors mt-0.5 ${TYPOGRAPHY.mainHeading}`}>
                          {park.name}
                        </h3>
                      </button>
                      <p className={`text-xs text-[#57534E] mt-1 ${TYPOGRAPHY.body}`}>
                        {isStamped
                          ? `พิชิตเมื่อ ${stamp.visitDate} · ${stamp.note || 'บันทึกตราประทับเรียบร้อย'}`
                          : `จุดเด่น: ${park.highlights[0]} · ช่วงแนะนำ: ${park.bestSeason}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => onOpenPark(park.id)}
                      className={`px-3.5 py-2 min-h-[40px] rounded-lg border border-[#D6CEBE] bg-white text-xs text-[#1C1917] hover:bg-[#EBE6DF] transition-colors whitespace-nowrap cursor-pointer ${TYPOGRAPHY.button}`}
                    >
                      รายละเอียด
                    </button>
                    <button
                      type="button"
                      onClick={() => onOpenCheckIn(park.id)}
                      className={`px-4 py-2 min-h-[40px] rounded-lg text-xs transition-colors whitespace-nowrap inline-flex items-center gap-1.5 cursor-pointer ${TYPOGRAPHY.button} ${
                        isStamped
                          ? 'border border-[#183126] text-[#183126] hover:bg-[#183126] hover:text-white'
                          : 'bg-[#183126] text-white hover:bg-[#11241B]'
                      }`}
                    >
                      {isStamped && <CheckCircle2 className="w-3.5 h-3.5" />}
                      <span>{isStamped ? 'แก้ไขบันทึก' : 'บันทึกการพิชิต'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
