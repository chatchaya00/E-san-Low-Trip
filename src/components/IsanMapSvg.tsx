import React, { useState } from 'react';
import { NationalPark, StampRecord } from '../types/park';
import { TYPOGRAPHY } from '../styles/typography';

interface IsanMapSvgProps {
  parks: NationalPark[];
  stamps: Record<string, StampRecord>;
  activeParkId?: string;
  onSelectPark?: (parkId: string) => void;
}

export const IsanMapSvg: React.FC<IsanMapSvgProps> = ({
  parks,
  stamps,
  activeParkId,
  onSelectPark,
}) => {
  const [hoveredPark, setHoveredPark] = useState<NationalPark | null>(null);

  const displayPark =
    hoveredPark || parks.find((p) => p.id === activeParkId) || null;

  return (
    <div className="relative rounded-xl border border-[#E4DFD5] bg-[#FBF9F5] p-4 overflow-hidden">
      <div className={`flex flex-wrap items-center justify-between gap-2 mb-3 text-xs text-[#57534E] ${TYPOGRAPHY.body}`}>
        <span className={`${TYPOGRAPHY.sectionHeading} text-sm text-[#1C1917]`}>
          แผนที่พิกัด 26 อุทยานแห่งชาติภาคตะวันออกเฉียงเหนือ
        </span>
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#9A3412]" />
            พิชิตแล้ว
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#183126]/30 border border-[#183126]" />
            ยังไม่พิชิต
          </span>
        </div>
      </div>

      <svg
        viewBox="0 0 480 390"
        className="w-full h-auto max-h-[380px] select-none"
        role="img"
        aria-label="แผนที่อุทยานแห่งชาติภาคตะวันออกเฉียงเหนือ 26 แห่ง"
      >
        {/* Subtle topographic grid */}
        <defs>
          <pattern id="isan-grid" width="30" height="30" patternUnits="userSpaceOnUse">
            <path
              d="M 30 0 L 0 0 0 30"
              fill="none"
              stroke="#E4DFD5"
              strokeWidth="0.6"
            />
          </pattern>
        </defs>
        <rect width="480" height="390" fill="url(#isan-grid)" rx="8" />

        {/* Stylized Khorat Plateau / Isan Region Contour */}
        <path
          d="M 58,95 C 58,64 110,50 155,44 C 210,36 275,26 325,38 C 365,48 395,78 412,126 C 426,166 446,204 438,242 C 428,286 418,328 386,342 C 330,362 248,360 184,354 C 128,348 80,340 76,304 C 72,268 82,238 92,202 C 102,164 58,136 58,95 Z"
          fill="#EFECE4"
          stroke="#C8BFA8"
          strokeWidth="1.5"
        />

        {/* Mekong River Border (North & East) */}
        <path
          d="M 52,72 C 95,46 155,40 218,34 C 282,28 338,34 388,74 C 414,96 426,158 446,216 C 454,242 442,272 426,296"
          fill="none"
          stroke="#93A8AC"
          strokeWidth="2.5"
          strokeDasharray="6 3"
          opacity="0.7"
        />

        {/* Chi & Mun River Lines */}
        <path
          d="M 122,190 Q 220,210 315,225 Q 375,235 426,232"
          fill="none"
          stroke="#A3B8BC"
          strokeWidth="1.4"
          opacity="0.6"
        />
        <path
          d="M 110,308 Q 225,296 340,264 Q 385,250 426,232"
          fill="none"
          stroke="#A3B8BC"
          strokeWidth="1.4"
          opacity="0.6"
        />

        {/* Labels for geography context */}
        <text x="342" y="34" fontSize="9" fill="#6B7F82" fontFamily="Sarabun, sans-serif">
          แม่น้ำโขง
        </text>
        <text x="235" y="216" fontSize="8" fill="#78716C" fontFamily="Sarabun, sans-serif">
          ลุ่มน้ำชี
        </text>
        <text x="245" y="294" fontSize="8" fill="#78716C" fontFamily="Sarabun, sans-serif">
          ลุ่มน้ำมูล
        </text>

        {/* Park Markers */}
        {parks.map((park) => {
          const isStamped = Boolean(stamps[park.id]);
          const isActive = park.id === activeParkId;
          const isHovered = hoveredPark?.id === park.id;

          return (
            <g
              key={park.id}
              transform={`translate(${park.mapPos.x}, ${park.mapPos.y})`}
              className="cursor-pointer"
              onMouseEnter={() => setHoveredPark(park)}
              onMouseLeave={() => setHoveredPark(null)}
              onClick={() => onSelectPark?.(park.id)}
            >
              {isActive && (
                <circle
                  r="13"
                  fill="none"
                  stroke="#9A3412"
                  strokeWidth="1.4"
                  strokeDasharray="2 2"
                />
              )}
              <circle
                r={isActive || isHovered ? 7.5 : 5.5}
                fill={
                  isStamped
                    ? '#9A3412'
                    : isActive
                    ? '#183126'
                    : '#FBF9F5'
                }
                stroke={isStamped ? '#9A3412' : '#183126'}
                strokeWidth={isActive ? '2.2' : '1.5'}
              />
              <text
                y="14"
                textAnchor="middle"
                fontSize="7"
                fontWeight={isActive ? '700' : '500'}
                fill="#1C1917"
                fontFamily="JetBrains Mono, monospace"
                className="pointer-events-none"
              >
                {park.number}
              </text>
            </g>
          );
        })}
      </svg>

      {displayPark && (
        <div className="mt-3 pt-3 border-t border-[#E4DFD5] flex flex-wrap items-center justify-between gap-2 text-xs">
          <div>
            <span className="font-mono text-[#57534E] mr-2 tabular-nums">
              {displayPark.code}
            </span>
            <span className={`${TYPOGRAPHY.sectionHeading} text-[#1C1917]`}>{displayPark.name}</span>
            <span className={`${TYPOGRAPHY.body} text-[#57534E] ml-2`}>
              · จ.{displayPark.provinces.join(', ')}
            </span>
          </div>
          <span className="font-mono text-[#57534E] tabular-nums">
            {displayPark.coordinates.lat.toFixed(4)}°N, {displayPark.coordinates.lng.toFixed(4)}°E
          </span>
        </div>
      )}
    </div>
  );
};
