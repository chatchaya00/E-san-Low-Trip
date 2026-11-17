import React, { useState } from 'react';
import { Mountain } from 'lucide-react';

interface ParkImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
}

export const ParkImage: React.FC<ParkImageProps> = ({
  src,
  alt,
  className = 'w-full h-full object-cover',
  fallbackTitle,
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#EBE6DF] to-[#DCD4C6] text-[#57534E] p-4 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <Mountain className="w-8 h-8 mb-2 text-[#183126]/60" strokeWidth={1.5} />
        {fallbackTitle && (
          <span className="text-xs font-medium text-[#1C1917]/80 line-clamp-2">
            {fallbackTitle}
          </span>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
      loading="lazy"
    />
  );
};
