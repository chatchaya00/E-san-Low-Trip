import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { TYPOGRAPHY } from '../styles/typography';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  details?: string[];
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'default' | 'danger';
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  description,
  details = [],
  confirmLabel = 'ยืนยัน',
  cancelLabel = 'ยกเลิก',
  variant = 'default',
  isLoading = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      <div className="w-full max-w-md rounded-2xl border border-[#E4DFD5] bg-[#FBF9F5] p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                variant === 'danger'
                  ? 'bg-[#9A3412]/10 text-[#9A3412]'
                  : 'bg-[#183126]/10 text-[#183126]'
              }`}
            >
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3
              id="confirm-modal-title"
              className={`${TYPOGRAPHY.mainHeading} text-lg text-[#1C1917]`}
            >
              {title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg text-[#57534E] hover:bg-[#EBE6DF] transition-colors"
            aria-label="ปิดหน้าต่าง"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className={`mt-3 text-sm text-[#57534E] ${TYPOGRAPHY.body}`}>{description}</p>

        {details.length > 0 && (
          <ul className={`mt-3 space-y-1.5 rounded-xl border border-[#E4DFD5] bg-[#F7F4EE] p-3 text-xs text-[#1C1917] ${TYPOGRAPHY.body}`}>
            {details.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span aria-hidden="true" className="text-[#57534E]">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className={`px-4 py-2.5 min-h-[44px] rounded-lg border border-[#D6CEBE] bg-white text-sm text-[#1C1917] hover:bg-[#F7F4EE] transition-colors whitespace-nowrap shrink-0 ${TYPOGRAPHY.button}`}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-5 py-2.5 min-h-[44px] rounded-lg text-sm text-white transition-colors whitespace-nowrap shrink-0 ${TYPOGRAPHY.button} ${
              variant === 'danger'
                ? 'bg-[#9A3412] hover:bg-[#7C2D12]'
                : 'bg-[#183126] hover:bg-[#11241B]'
            } disabled:opacity-60`}
          >
            {isLoading ? 'กำลังดำเนินการ...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
