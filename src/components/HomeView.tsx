import React from 'react';
import { ArrowRight, BookOpen, CheckCircle2, Compass, MapPin } from 'lucide-react';
import { AppView, NationalPark, StampRecord } from '../types/park';
import { HERO_IMAGE } from '../data/isanParks';
import { TYPOGRAPHY } from '../styles/typography';
import { ParkImage } from './ParkImage';
import { ParkStampSvg } from './ParkStampSvg';
import { IsanMapSvg } from './IsanMapSvg';

interface HomeViewProps {
  parks: NationalPark[];
  stamps: Record<string, StampRecord>;
  travelerName: string;
  onNavigate: (view: AppView) => void;
  onOpenPark: (parkId: string) => void;
  onOpenCheckIn: (parkId: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  parks,
  stamps,
  travelerName,
  onNavigate,
  onOpenPark,
  onOpenCheckIn,
}) => {
  const stampedList = Object.values(stamps).sort((a, b) =>
    b.stampedAt.localeCompare(a.stampedAt)
  );
  const conqueredCount = stampedList.length;
  const totalCount = parks.length;
  const progressPct = Math.round((conqueredCount / totalCount) * 100);

  const visitedProvinces = new Set(
    parks.filter((p) => stamps[p.id]).flatMap((p) => p.provinces)
  );
  const totalProvinces = new Set(parks.flatMap((p) => p.provinces)).size;

  const getExplorerRank = (count: number) => {
    if (count >= 26) return 'ตำนานผู้พิชิต 26 อุทยานอีสาน';
    if (count >= 15) return 'นักเดินทางผู้ชำนาญเส้นทางอีสาน';
    if (count >= 5) return 'นักสำรวจอุทยานภาคอีสาน';
    if (count >= 1) return 'ผู้เริ่มต้นเส้นทางสายหมอก';
    return 'นักเดินทางมือใหม่';
  };

  const upcomingParks = parks.filter((p) => !stamps[p.id]).slice(0, 3);
  const recentStampedParks = stampedList
    .slice(0, 3)
    .map((s) => ({
      stamp: s,
      park: parks.find((p) => p.id === s.parkId),
    }))
    .filter((item): item is { stamp: StampRecord; park: NationalPark } => Boolean(item.park));

  return (
    <div className="space-y-12">
      {/* Hero Split Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-6 flex flex-col justify-between rounded-2xl border border-[#E4DFD5] bg-[#FBF9F5] p-7 sm:p-10">
          <div>
            <p className={`text-xs text-[#57534E] uppercase ${TYPOGRAPHY.enHeading}`}>
              Digital Travel Passport · Northeastern Thailand
            </p>
            <h1 className={`mt-3 text-3xl sm:text-4xl lg:text-[2.5rem] text-[#1C1917] [text-wrap:balance] ${TYPOGRAPHY.mainHeading}`}>
              สมุดบันทึกการเดินทาง พิชิต 26 อุทยานแห่งชาติภาคอีสาน
            </h1>
            <p className={`mt-4 text-base text-[#57534E] max-w-xl ${TYPOGRAPHY.body}`}>
              สวัสดีคุณ {travelerName} — ออกเดินทางสัมผัสผาหินทราย ทะเลหมอก และผืนป่าลุ่มน้ำโขง
              บันทึกตราประทับจริงจากทุกอุทยานที่เดินทางไปถึงไว้ในสมุดพาสปอร์ตดิจิทัลของคุณ
            </p>

            {/* Progress Bar */}
            <div className="mt-7 pt-6 border-t border-[#E4DFD5]">
              <div className="flex items-baseline justify-between gap-4">
                <span className={`text-sm text-[#1C1917] ${TYPOGRAPHY.sectionHeading}`}>
                  ความคืบหน้าการพิชิตทั้งหมด
                </span>
                <span className={`text-lg text-[#183126] ${TYPOGRAPHY.achievement}`}>
                  {conqueredCount} / {totalCount}{' '}
                  <span className="font-sans text-xs font-normal text-[#57534E]">
                    แห่ง ({progressPct}%)
                  </span>
                </span>
              </div>
              <div
                className="mt-2.5 h-2.5 w-full rounded-full bg-[#EBE6DF] overflow-hidden"
                role="progressbar"
                aria-valuenow={progressPct}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="h-full bg-[#183126] rounded-full transition-all duration-300"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('passport')}
              className={`px-5 py-3 min-h-[44px] rounded-xl bg-[#183126] text-white text-sm hover:bg-[#11241B] transition-colors inline-flex items-center gap-2 whitespace-nowrap cursor-pointer ${TYPOGRAPHY.button}`}
            >
              <BookOpen className="w-4 h-4" />
              <span>เปิดสมุดพาสปอร์ต</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('explore')}
              className={`px-5 py-3 min-h-[44px] rounded-xl border border-[#D6CEBE] bg-white text-[#1C1917] text-sm hover:bg-[#F7F4EE] transition-colors inline-flex items-center gap-2 whitespace-nowrap cursor-pointer ${TYPOGRAPHY.button}`}
            >
              <Compass className="w-4 h-4" />
              <span>สำรวจ 26 อุทยาน</span>
            </button>
          </div>
        </div>

        <div className="lg:col-span-6 relative rounded-2xl overflow-hidden border border-[#E4DFD5] min-h-[300px] lg:min-h-[420px]">
          <ParkImage
            src={HERO_IMAGE}
            alt="ทิวทัศน์ทะเลหมอกยามเช้าบนผาหินทราย อุทยานแห่งชาติภูกระดึง"
            className="w-full h-full lg:h-full object-cover"
            fallbackTitle="อุทยานแห่งชาติภูกระดึง"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-white flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-mono text-white/80">
                NP-10 · จ.เลย · จุดหมายยอดนิยมตลอดกาล
              </p>
              <p className={`text-xl sm:text-2xl mt-1 ${TYPOGRAPHY.mainHeading}`}>
                อุทยานแห่งชาติภูกระดึง
              </p>
            </div>
            <button
              type="button"
              onClick={() => onOpenPark('phu-kradueng')}
              className={`px-4 py-2 min-h-[40px] rounded-lg bg-white/95 text-[#1C1917] text-xs hover:bg-white transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${TYPOGRAPHY.button}`}
            >
              <span>ดูรายละเอียด</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 4-Column KPI Strip (Cinzel Bold Achievement Numbers) */}
      <section aria-label="สถิติการเดินทาง" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-[#E4DFD5] bg-[#FBF9F5] p-5">
          <p className={`text-xs text-[#57534E] ${TYPOGRAPHY.body}`}>อุทยานที่พิชิตแล้ว</p>
          <p className={`mt-2 text-2xl sm:text-3xl text-[#183126] ${TYPOGRAPHY.achievement}`}>
            {conqueredCount} <span className="text-base font-sans font-normal text-[#57534E]">/ {totalCount}</span>
          </p>
        </div>
        <div className="rounded-xl border border-[#E4DFD5] bg-[#FBF9F5] p-5">
          <p className={`text-xs text-[#57534E] ${TYPOGRAPHY.body}`}>จังหวัดที่เดินทางถึง</p>
          <p className={`mt-2 text-2xl sm:text-3xl text-[#1C1917] ${TYPOGRAPHY.achievement}`}>
            {visitedProvinces.size} <span className="text-base font-sans font-normal text-[#57534E]">/ {totalProvinces}</span>
          </p>
        </div>
        <div className="rounded-xl border border-[#E4DFD5] bg-[#FBF9F5] p-5">
          <p className={`text-xs text-[#57534E] ${TYPOGRAPHY.body}`}>ตราประทับคงเหลือ</p>
          <p className={`mt-2 text-2xl sm:text-3xl text-[#9A3412] ${TYPOGRAPHY.achievement}`}>
            {totalCount - conqueredCount} <span className="text-base font-sans font-normal text-[#57534E]">แห่ง</span>
          </p>
        </div>
        <div className="rounded-xl border border-[#E4DFD5] bg-[#FBF9F5] p-5">
          <p className={`text-xs text-[#57534E] ${TYPOGRAPHY.body}`}>ระดับนักเดินทาง</p>
          <p className={`mt-2 text-base sm:text-lg text-[#1C1917] ${TYPOGRAPHY.sectionHeading}`}>
            {getExplorerRank(conqueredCount)}
          </p>
        </div>
      </section>

      {/* Map & Recommended Missions */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className={`text-2xl text-[#1C1917] ${TYPOGRAPHY.sectionHeading}`}>
              เครือข่ายอุทยานแห่งชาติภาคอีสาน
            </h2>
            <button
              type="button"
              onClick={() => onNavigate('explore')}
              className={`text-xs text-[#183126] hover:underline whitespace-nowrap cursor-pointer ${TYPOGRAPHY.button}`}
            >
              ดูทั้ง 26 แห่ง →
            </button>
          </div>
          <IsanMapSvg
            parks={parks}
            stamps={stamps}
            onSelectPark={onOpenPark}
          />
        </div>

        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-baseline justify-between">
            <h2 className={`text-2xl text-[#1C1917] ${TYPOGRAPHY.sectionHeading}`}>
              ภารกิจแนะนำถัดไป
            </h2>
            <button
              type="button"
              onClick={() => onNavigate('missions')}
              className={`text-xs text-[#183126] hover:underline whitespace-nowrap cursor-pointer ${TYPOGRAPHY.button}`}
            >
              ดูภารกิจทั้งหมด →
            </button>
          </div>

          {upcomingParks.length === 0 ? (
            <div className="rounded-xl border border-[#E4DFD5] bg-[#FBF9F5] p-6 text-center">
              <CheckCircle2 className="w-8 h-8 text-[#183126] mx-auto mb-2" />
              <p className={`text-lg text-[#1C1917] ${TYPOGRAPHY.mainHeading}`}>
                คุณพิชิตครบทั้ง 26 อุทยานแล้ว!
              </p>
              <p className={`text-sm text-[#57534E] mt-1 ${TYPOGRAPHY.body}`}>
                เปิดดูคอลเลกชันตราประทับทั้งหมดหรือซิงก์ข้อมูลเก็บไว้ใน Google Sheets ได้เลย
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingParks.map((park) => (
                <div
                  key={park.id}
                  className="rounded-xl border border-[#E4DFD5] bg-[#FBF9F5] p-4 flex items-center justify-between gap-4 hover:border-[#183126]/40 transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => onOpenPark(park.id)}
                    className="flex items-center gap-3.5 text-left min-w-0 flex-1 cursor-pointer"
                  >
                    <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-[#E4DFD5]">
                      <ParkImage
                        src={park.coverImage}
                        alt={park.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-mono text-[#57534E] tabular-nums">
                        {park.code} · จ.{park.primaryProvince}
                      </p>
                      <p className={`text-sm text-[#1C1917] truncate mt-0.5 ${TYPOGRAPHY.mainHeading}`}>
                        {park.name}
                      </p>
                      <p className={`text-xs text-[#57534E] truncate mt-0.5 ${TYPOGRAPHY.body}`}>
                        {park.highlights[0]}
                      </p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenCheckIn(park.id)}
                    className="px-3.5 py-2 min-h-[40px] rounded-lg border border-[#183126] text-xs font-medium text-[#183126] hover:bg-[#183126] hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    เช็กอิน
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Recently Stamped Showcase */}
      <section className="pt-4 border-t border-[#E4DFD5]">
        <div className="flex items-baseline justify-between mb-5">
          <div>
            <h2 className={`text-2xl text-[#1C1917] ${TYPOGRAPHY.sectionHeading}`}>
              ตราประทับที่สะสมล่าสุด
            </h2>
            <p className={`text-sm text-[#57534E] mt-1 ${TYPOGRAPHY.body}`}>
              ความทรงจำจากการเดินทางไปยังอุทยานแห่งชาติภาคอีสาน
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('collection')}
            className={`text-xs text-[#183126] hover:underline whitespace-nowrap cursor-pointer ${TYPOGRAPHY.button}`}
          >
            ดูคอลเลกชันทั้งหมด →
          </button>
        </div>

        {recentStampedParks.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#D6CEBE] bg-[#FBF9F5] p-8 text-center">
            <MapPin className="w-7 h-7 text-[#57534E] mx-auto mb-2" />
            <p className={`text-base text-[#1C1917] ${TYPOGRAPHY.sectionHeading}`}>
              ยังไม่มีตราประทับในสมุดพาสปอร์ตของคุณ
            </p>
            <p className={`text-sm text-[#57534E] mt-1 max-w-md mx-auto ${TYPOGRAPHY.body}`}>
              เลือกอุทยานที่คุณเดินทางไปถึงแล้วจากหน้าสำรวจ เพื่อยืนยันด้วย QR Code ประจำอุทยานหรือรหัสเจ้าหน้าที่
            </p>
            <button
              type="button"
              onClick={() => onNavigate('explore')}
              className={`mt-4 px-4 py-2.5 min-h-[44px] rounded-lg bg-[#183126] text-white text-xs hover:bg-[#11241B] transition-colors cursor-pointer ${TYPOGRAPHY.button}`}
            >
              เลือกอุทยานแรกของคุณ
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentStampedParks.map(({ park, stamp }) => (
              <button
                key={park.id}
                type="button"
                onClick={() => onOpenPark(park.id)}
                className="rounded-2xl border border-[#E4DFD5] bg-[#FBF9F5] p-5 text-left hover:border-[#183126]/40 transition-colors flex items-center gap-4 cursor-pointer"
              >
                <div className="shrink-0">
                  <ParkStampSvg park={park} stamp={stamp} size="sm" rotate={-5} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-mono text-[#9A3412] tabular-nums">
                    ประทับวันที่ {stamp.visitDate}
                  </p>
                  <h3 className={`text-base text-[#1C1917] mt-1 line-clamp-2 ${TYPOGRAPHY.mainHeading}`}>
                    {park.name}
                  </h3>
                  <p className={`text-xs text-[#57534E] mt-1 ${TYPOGRAPHY.body}`}>
                    จ.{park.provinces.join(', ')}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
