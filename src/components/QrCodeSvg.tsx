import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';

interface QrCodeSvgProps {
  value: string;
  size?: number;
}

export const QrCodeSvg: React.FC<QrCodeSvgProps> = ({ value, size = 140 }) => {
  const [svgMarkup, setSvgMarkup] = useState<string>('');

  useEffect(() => {
    let active = true;
    QRCode.toString(value, {
      type: 'svg',
      margin: 1,
      width: size,
      color: {
        dark: '#183126',
        light: '#FBF9F5',
      },
    })
      .then((markup) => {
        if (active) setSvgMarkup(markup);
      })
      .catch(() => {
        if (active) setSvgMarkup('');
      });
    return () => {
      active = false;
    };
  }, [value, size]);

  if (!svgMarkup) {
    return (
      <div
        className="flex items-center justify-center bg-[#FBF9F5] border border-[#E4DFD5] rounded-lg text-xs text-[#57534E] font-mono"
        style={{ width: size, height: size }}
      >
        QR
      </div>
    );
  }

  return (
    <div
      className="inline-block rounded-lg overflow-hidden border border-[#E4DFD5] bg-[#FBF9F5] p-1.5"
      style={{ width: size + 14, height: size + 14 }}
      dangerouslySetInnerHTML={{ __html: svgMarkup }}
      aria-label={`QR Code ${value}`}
    />
  );
};
