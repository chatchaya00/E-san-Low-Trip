import React from 'react';
import { NationalPark, StampMotif, StampRecord } from '../types/park';

interface ParkStampSvgProps {
  park: NationalPark;
  stamp?: StampRecord;
  size?: 'sm' | 'md' | 'lg';
  rotate?: number;
}

function MotifArtwork({ motif, color }: { motif: StampMotif; color: string }) {
  switch (motif) {
    case 'maple-plateau':
      return (
        <g stroke={color} fill="none" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 46 L34 32 L54 32 L66 46" />
          <path d="M44 26 L46 31 L51 30 L47 34 L49 38 L44 36 L39 38 L41 34 L37 30 L42 31 Z" fill={color} fillOpacity="0.18" />
          <path d="M28 46 Q44 42 60 46" />
        </g>
      );
    case 'sunrise-cliff':
      return (
        <g stroke={color} fill="none" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 46 L20 34 L34 34 L38 46" />
          <circle cx="52" cy="31" r="6" fill={color} fillOpacity="0.16" />
          <path d="M52 21 V23 M61 25 L59 27 M63 31 H61 M43 25 L45 27" />
          <path d="M18 46 Q44 43 68 46" />
        </g>
      );
    case 'siam-tulip':
      return (
        <g stroke={color} fill="none" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M44 48 V34" />
          <path d="M44 35 C38 30 39 22 44 20 C49 22 50 30 44 35 Z" fill={color} fillOpacity="0.16" />
          <path d="M44 37 C37 35 34 29 36 25 C40 27 42 32 44 37" />
          <path d="M44 37 C51 35 54 29 52 25 C48 27 46 32 44 37" />
          <path d="M32 48 C36 41 41 40 44 44 C47 40 52 41 56 48" />
        </g>
      );
    case 'waterfall':
    case 'layered-falls':
      return (
        <g stroke={color} fill="none" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M26 26 H62" />
          <path d="M34 26 V42 M41 26 V44 M48 26 V44 M54 26 V41" />
          <path d="M24 45 Q34 42 44 45 Q54 48 64 45" />
          <path d="M28 49 Q44 47 60 49" />
        </g>
      );
    case 'dinosaur':
      return (
        <g stroke={color} fill="none" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M24 44 C26 38 30 35 37 35 C42 35 47 32 49 26 C51 22 56 21 59 23 C60 25 58 27 54 27 C52 33 50 40 54 46" />
          <path d="M31 37 V46 M38 37 V46 M24 44 L18 46" />
        </g>
      );
    case 'naga-cave':
      return (
        <g stroke={color} fill="none" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 46 Q28 24 44 24 Q60 24 66 46" />
          <path d="M30 46 Q35 31 44 31 Q53 31 58 46" />
          <path d="M36 39 C40 35 48 35 52 39" />
          <path d="M40 24 L44 19 L48 24" />
        </g>
      );
    case 'elephant-forest':
      return (
        <g stroke={color} fill="none" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M27 45 V35 C27 28 34 26 43 26 C51 26 57 30 57 36 V45" />
          <path d="M57 35 C61 35 63 39 61 44 C59 46 57 44 58 41" />
          <path d="M33 45 V39 M48 45 V39" />
          <circle cx="51" cy="32" r="1" fill={color} />
        </g>
      );
    case 'mushroom-rock':
    case 'rock-pillar':
    case 'stone-pillar-field':
      return (
        <g stroke={color} fill="none" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M28 46 L31 35 L25 31 L27 25 L41 25 L43 31 L37 35 L40 46" />
          <path d="M47 46 L49 32 L45 28 L47 22 L60 22 L62 28 L57 32 L59 46" />
          <path d="M20 46 H68" />
        </g>
      );
    case 'lotus-pond':
      return (
        <g stroke={color} fill="none" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M44 22 C40 28 40 34 44 38 C48 34 48 28 44 22 Z" fill={color} fillOpacity="0.16" />
          <path d="M44 38 C36 36 32 30 34 25 C38 27 41 32 44 38" />
          <path d="M44 38 C52 36 56 30 54 25 C50 27 47 32 44 38" />
          <path d="M25 43 Q44 40 63 43" />
          <path d="M30 47 Q44 45 58 47" />
        </g>
      );
    case 'thermometer-pine':
      return (
        <g stroke={color} fill="none" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M44 20 L33 34 H55 Z" />
          <path d="M44 28 L30 42 H58 Z" />
          <path d="M44 42 V48" />
          <circle cx="58" cy="25" r="3" />
        </g>
      );
    case 'rapids':
    case 'reservoir-peak':
    case 'stream-canyon':
      return (
        <g stroke={color} fill="none" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 36 L34 24 L45 34 L54 26 L66 36" />
          <path d="M20 42 Q32 39 44 42 Q56 45 68 42" />
          <path d="M24 47 Q36 44 48 47 Q58 49 64 47" />
        </g>
      );
    case 'bat-cave':
      return (
        <g stroke={color} fill="none" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 46 Q25 23 44 23 Q63 23 68 46" />
          <path d="M34 32 Q39 28 44 32 Q49 28 54 32" />
          <path d="M38 38 Q41 35 44 38 Q47 35 50 38" />
        </g>
      );
    default:
      return (
        <g stroke={color} fill="none" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 45 L35 25 L46 37 L55 28 L68 45 Z" fill={color} fillOpacity="0.1" />
          <circle cx="56" cy="24" r="3.5" />
          <path d="M18 45 H70" />
        </g>
      );
  }
}

export const ParkStampSvg: React.FC<ParkStampSvgProps> = ({
  park,
  stamp,
  size = 'md',
  rotate = -4,
}) => {
  const isStamped = Boolean(stamp);
  const inkColor = isStamped ? park.stampInkColor : '#A8A29E';
  const dimClass =
    size === 'sm' ? 'w-24 h-24' : size === 'lg' ? 'w-44 h-44' : 'w-32 h-32';

  const formattedDate = stamp?.visitDate
    ? stamp.visitDate.replace(/-/g, '.')
    : '----.--.--';

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${dimClass}`}
      style={{
        transform: isStamped ? `rotate(${rotate}deg)` : 'none',
        opacity: isStamped ? 0.94 : 0.48,
      }}
      aria-label={
        isStamped
          ? `ตราประทับ ${park.name} วันที่ ${formattedDate}`
          : `ช่องตราประทับ ${park.name} (ยังไม่ได้ประทับ)`
      }
    >
      <svg viewBox="0 0 88 88" className="w-full h-full overflow-visible">
        <defs>
          <path
            id={`topArc-${park.id}-${size}`}
            d="M 14,44 A 30,30 0 1,1 74,44"
          />
          <path
            id={`botArc-${park.id}-${size}`}
            d="M 74,46 A 30,30 0 1,1 14,46"
          />
        </defs>

        {/* Outer Stamp Ring */}
        <circle
          cx="44"
          cy="44"
          r="41"
          fill={isStamped ? `${inkColor}0A` : 'none'}
          stroke={inkColor}
          strokeWidth={isStamped ? '2.2' : '1.4'}
          strokeDasharray={isStamped ? 'none' : '4 3'}
        />

        {/* Inner Ring */}
        <circle
          cx="44"
          cy="44"
          r="35"
          fill="none"
          stroke={inkColor}
          strokeWidth={isStamped ? '1' : '0.8'}
          strokeDasharray={isStamped ? '1.5 1.5' : '3 3'}
        />

        {/* Curved Top Park Title (Cinzel Stamp Crest) */}
        <text
          fill={inkColor}
          fontSize="6.4"
          fontWeight="700"
          letterSpacing="1.15"
          fontFamily="Cinzel, Georgia, serif"
        >
          <textPath
            href={`#topArc-${park.id}-${size}`}
            startOffset="50%"
            textAnchor="middle"
          >
            {park.stampTitle}
          </textPath>
        </text>

        {/* Central Motif Illustration */}
        <MotifArtwork motif={park.stampMotif} color={inkColor} />

        {/* Date Strip */}
        <rect
          x="22"
          y="53"
          width="44"
          height="11"
          rx="2"
          fill={isStamped ? '#FBF9F5' : 'none'}
          stroke={inkColor}
          strokeWidth="0.9"
          strokeDasharray={isStamped ? 'none' : '2 2'}
        />
        <text
          x="44"
          y="60.5"
          textAnchor="middle"
          fill={inkColor}
          fontSize="6"
          fontWeight="600"
          fontFamily="JetBrains Mono, monospace"
        >
          {formattedDate}
        </text>

        {/* Bottom Serial / Code */}
        <text
          x="44"
          y="74"
          textAnchor="middle"
          fill={inkColor}
          fontSize="5.2"
          fontWeight="600"
          letterSpacing="0.9"
          fontFamily="Cinzel, Georgia, serif"
        >
          {`${park.code} · ISAN`}
        </text>
      </svg>
    </div>
  );
};
