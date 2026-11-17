import React, { useMemo, useState } from 'react';
import { CheckCircle2, Clock, Search, X } from 'lucide-react';
import { ALL_PROVINCES } from '../data/isanParks';
import { NationalPark, StampRecord } from '../types/park';
import { TYPOGRAPHY } from '../styles/typography';
import { ParkImage } from './ParkImage';

interface ExploreViewProps {
  parks: NationalPark[];
  stamps: Record<string, StampRecord>;
  onOpenPark: (parkId: string) => void;
  onOpenCheckIn: (parkId: string) => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({
  parks,
  stamps,
  onOpenPark,
  onOpenCheckIn,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvince, setSelectedProvince] = useState<string>('ทั้งหมด');
  const [statusFilter, setStatusFilter] = useState<'all' | 'stamped' | 'pending'>('all');

  const filteredParks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return parks.filter((park) => {
      const matchesProvince =
        selectedProvince === 'ทั้งหมด' || park.provinces.includes(selectedProvince);
      const isStamped = Boolean(stamps[park.id]);
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'stamped' && isStamped) ||
        (statusFilter === 'pending' && !isStamped);
      const matchesQuery =
        !q ||
        park.name.toLowerCase().includes(q) ||
        park.englishName.toLowerCase().includes(q) ||
        park.provinces.some((prov) => prov.toLowerCase().includes(q)) ||
        park.highlights.some((h) => h.toLowerCase().includes(q));
      return matchesProvince && matchesStatus && matchesQuery;
    });
  }, [parks, stamps, searchQuery, selectedProvince, statusFilter]);

  const groupedByProvince = useMemo(() => {
    const groups = new Map<string, NationalPark[]>();
    filteredParks.forEach((park) => {
      const key =
        selectedProvince !== 'ทั้งหมด' ? selectedProvince : park.primaryProvince;
      const list = groups.get(key) || [];
      list.push(park);
      groups.set(key, list);
    });
    return Array.from(groups.entries()).sort((a, b) =>
      a[0].localeCompare(b[0], 'th')
    );
  }, [filteredParks, selectedProvince]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E4DFD5] pb-6">
        <div>
          <p className={`text-xs text-[#57534E] uppercase ${TYPOGRAPHY.enHeading}`}>
            Explore Northeastern Parks · 26 Destinations
          </p>
          <h1 className={`mt-2 text-3xl sm:text-4xl text-[#1C1917] ${TYPOGRAPHY.mainHeading}`}>
            สำรวจอุทยานแห่งชาติภาคอีสาน 26 แห่ง
          </h1>
          <p className={`mt-2 text-sm text-[#57534E] ${TYPOGRAPHY.body}`}>
            ค้นหาตามชื่ออุทยาน จุดเด่น หรือเลือกกรองตามจังหวัดเพื่อวางแผนพิชิตตราประทับ
          </p>
        </div>

        {/* Status Filter Segmented Control */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-[#EBE6DF] self-start md:self-auto">
          {(
            [
              { id: 'all', label: 'ทั้งหมด (26)' },
              { id: 'pending', label: 'ยังไม่พิชิต' },
              { id: 'stamped', label: 'พิชิตแล้ว' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3.5 py-2 min-h-[38px] rounded-lg text-xs transition-colors whitespace-nowrap cursor-pointer ${TYPOGRAPHY.button} ${
                statusFilter === tab.id
                  ? 'bg-[#FBF9F5] text-[#183126] shadow-sm'
                  : 'text-[#57534E] hover:text-[#1C1917]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search & Province Filter Bar */}
      <div className="space-y-4">
        <div className="relative max-w-xl">
          <Search className="w-4 h-4 text-[#57534E] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหาชื่ออุทยาน จังหวัด หรือจุดเด่น (เช่น ภูกระดึง, ดอกกระเจียว, ถ้ำนาคา)..."
            className="w-full min-h-[44px] pl-10 pr-10 py-2.5 rounded-xl border border-[#D6CEBE] bg-[#FBF9F5] text-sm text-[#1C1917] focus:outline-none focus:border-[#183126]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 min-w-[36px] min-h-[36px] flex items-center justify-center text-[#57534E] hover:text-[#1C1917]"
              aria-label="ล้างคำค้นหา"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="ตัวกรองจังหวัด">
          <button
            type="button"
            onClick={() => setSelectedProvince('ทั้งหมด')}
            className={`px-3.5 py-2 min-h-[38px] rounded-lg text-xs font-medium border transition-colors whitespace-nowrap cursor-pointer ${
              selectedProvince === 'ทั้งหมด'
                ? 'bg-[#183126] text-white border-[#183126]'
                : 'bg-[#FBF9F5] text-[#57534E] border-[#E4DFD5] hover:border-[#183126]/40 hover:text-[#1C1917]'
            }`}
          >
            ทุกจังหวัด
          </button>
          {ALL_PROVINCES.map((prov) => (
            <button
              key={prov}
              type="button"
              onClick={() => setSelectedProvince(prov)}
              className={`px-3.5 py-2 min-h-[38px] rounded-lg text-xs font-medium border transition-colors whitespace-nowrap cursor-pointer ${
                selectedProvince === prov
                  ? 'bg-[#183126] text-white border-[#183126]'
                  : 'bg-[#FBF9F5] text-[#57534E] border-[#E4DFD5] hover:border-[#183126]/40 hover:text-[#1C1917]'
              }`}
            >
              {prov}
            </button>
          ))}
        </div>
      </div>

      {/* Results Grouped by Province */}
      {groupedByProvince.length === 0 ? (
        <div className="rounded-2xl border border-[#E4DFD5] bg-[#FBF9F5] p-10 text-center">
          <p className="text-base font-medium text-[#1C1917]">
            ไม่พบอุทยานแห่งชาติที่ตรงกับเงื่อนไขการค้นหา
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedProvince('ทั้งหมด');
              setStatusFilter('all');
            }}
            className="mt-4 px-4 py-2 min-h-[40px] rounded-lg border border-[#D6CEBE] bg-white text-xs font-medium text-[#1C1917] hover:bg-[#F7F4EE]"
          >
            รีเซ็ตตัวกรองทั้งหมด
          </button>
        </div>
      ) : (
        <div className="space-y-10">
          {groupedByProvince.map(([province, provinceParks]) => (
            <section key={province} className="space-y-4">
              <div className="flex items-baseline justify-between border-b border-[#E4DFD5] pb-2">
                <h2 className={`text-xl text-[#1C1917] ${TYPOGRAPHY.sectionHeading}`}>
                  จังหวัด{province}
                </h2>
                <span className="text-xs font-mono text-[#57534E] tabular-nums">
                  {provinceParks.length} อุทยาน
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {provinceParks.map((park) => {
                  const stamp = stamps[park.id];
                  const isStamped = Boolean(stamp);

                  return (
                    <article
                      key={park.id}
                      className="rounded-2xl border border-[#E4DFD5] bg-[#FBF9F5] overflow-hidden flex flex-col justify-between hover:border-[#183126]/40 transition-colors"
                    >
                      <div>
                        <button
                          type="button"
                          onClick={() => onOpenPark(park.id)}
                          className="block w-full aspect-[4/3] overflow-hidden bg-[#EBE6DF] cursor-pointer"
                        >
                          <ParkImage
                            src={park.coverImage}
                            alt={park.name}
                            className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-300"
                            fallbackTitle={park.name}
                          />
                        </button>

                        <div className="p-5">
                          <div className="flex items-center justify-between gap-2 text-xs text-[#57534E]">
                            <span className="font-mono tabular-nums">
                              {park.code} · {park.provinces.join(', ')}
                            </span>
                            {isStamped ? (
                              <span className={`inline-flex items-center gap-1 text-[#9A3412] ${TYPOGRAPHY.button}`}>
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                พิชิตแล้ว
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[#57534E]">
                                <Clock className="w-3.5 h-3.5" />
                                รอพิชิต
                              </span>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => onOpenPark(park.id)}
                            className="mt-2 text-left cursor-pointer"
                          >
                            <h3 className={`text-lg text-[#1C1917] hover:text-[#183126] transition-colors ${TYPOGRAPHY.mainHeading}`}>
                              {park.name}
                            </h3>
                          </button>

                          <p className={`mt-2 text-sm text-[#57534E] line-clamp-2 ${TYPOGRAPHY.body}`}>
                            {park.history}
                          </p>
                        </div>
                      </div>

                      <div className="px-5 py-3.5 border-t border-[#E4DFD5] bg-[#F7F4EE]/60 flex items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => onOpenPark(park.id)}
                          className={`text-xs text-[#183126] hover:underline whitespace-nowrap cursor-pointer ${TYPOGRAPHY.button}`}
                        >
                          ดูข้อมูลสถานที่
                        </button>
                        <button
                          type="button"
                          onClick={() => onOpenCheckIn(park.id)}
                          className={`px-3.5 py-2 min-h-[38px] rounded-lg text-xs transition-colors whitespace-nowrap cursor-pointer ${TYPOGRAPHY.button} ${
                            isStamped
                              ? 'border border-[#D6CEBE] bg-white text-[#1C1917] hover:bg-[#EBE6DF]'
                              : 'bg-[#183126] text-white hover:bg-[#11241B]'
                          }`}
                        >
                          {isStamped ? 'แก้ไขบันทึก' : 'ประทับตราพิชิต'}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
};
