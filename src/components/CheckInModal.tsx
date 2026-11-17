import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import {
  Camera,
  CheckCircle2,
  KeyRound,
  QrCode,
  ShieldCheck,
  Upload,
  X,
} from 'lucide-react';
import { NationalPark, StampRecord, VerificationMethod } from '../types/park';
import { TYPOGRAPHY } from '../styles/typography';
import { ParkStampSvg } from './ParkStampSvg';
import { QrCodeSvg } from './QrCodeSvg';

interface CheckInModalProps {
  park: NationalPark | null;
  existingStamp?: StampRecord;
  onClose: () => void;
  onSaveStamp: (record: StampRecord) => void;
}

async function compressImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const maxDim = 960;
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('ไม่สามารถประมวลผลรูปภาพได้'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.78));
      };
      img.onerror = () => reject(new Error('ไฟล์รูปภาพไม่ถูกต้อง'));
      img.src = String(reader.result);
    };
    reader.onerror = () => reject(new Error('อ่านไฟล์ไม่สำเร็จ'));
    reader.readAsDataURL(file);
  });
}

export const CheckInModal: React.FC<CheckInModalProps> = ({
  park,
  existingStamp,
  onClose,
  onSaveStamp,
}) => {
  const [method, setMethod] = useState<VerificationMethod>(
    existingStamp?.verificationMethod || 'qr-scan'
  );
  const [codeInput, setCodeInput] = useState(
    existingStamp?.verificationCode || ''
  );
  const [visitDate, setVisitDate] = useState(
    existingStamp?.visitDate || new Date().toISOString().slice(0, 10)
  );
  const [note, setNote] = useState(existingStamp?.note || '');
  const [photoDataUrl, setPhotoDataUrl] = useState<string | undefined>(
    existingStamp?.photoDataUrl
  );
  const [error, setError] = useState<string | null>(null);
  const [showSampleSign, setShowSampleSign] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraStatus, setCameraStatus] = useState<string | null>(null);
  const [justStamped, setJustStamped] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  if (!park) return null;

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const startQrCamera = async () => {
    setError(null);
    setCameraStatus(null);
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraStatus('เบราว์เซอร์ไม่รองรับการเปิดกล้อง กรุณากรอกรหัส QR หรือดูป้ายจุดบริการตัวอย่าง');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      streamRef.current = stream;
      setIsCameraActive(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      // Check native BarcodeDetector if available
      const BarcodeDetectorCtor = (window as unknown as { BarcodeDetector?: new (opts: { formats: string[] }) => { detect: (el: HTMLVideoElement) => Promise<{ rawValue: string }[]> } }).BarcodeDetector;
      if (BarcodeDetectorCtor && videoRef.current) {
        const detector = new BarcodeDetectorCtor({ formats: ['qr_code'] });
        const scanLoop = async () => {
          if (!streamRef.current || !videoRef.current) return;
          try {
            const codes = await detector.detect(videoRef.current);
            if (codes.length > 0 && codes[0].rawValue) {
              setCodeInput(codes[0].rawValue.trim());
              setCameraStatus(`สแกนพบ: ${codes[0].rawValue.trim()}`);
              stopCamera();
              return;
            }
          } catch {
            // continue polling
          }
          if (streamRef.current) {
            requestAnimationFrame(scanLoop);
          }
        };
        requestAnimationFrame(scanLoop);
      } else {
        setCameraStatus('เปิดกล้องแล้ว หากเบราว์เซอร์ไม่ถอดรหัสอัตโนมัติ กรุณากรอกรหัสใต้ QR Code ของศูนย์บริการ');
      }
    } catch {
      setCameraStatus('ไม่สามารถเข้าถึงกล้องได้ในสภาพแวดล้อมนี้ กรุณากรอกรหัสยืนยันจากป้าย QR ประจำอุทยาน');
      setIsCameraActive(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setError(null);
      const dataUrl = await compressImageFile(file);
      setPhotoDataUrl(dataUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'อัปโหลดรูปไม่สำเร็จ');
    }
  };

  const isCodeValid = () => {
    const normalized = codeInput.trim().toUpperCase();
    if (method === 'qr-scan') {
      return normalized === park.qrCodeValue.toUpperCase();
    }
    return normalized === park.rangerPin.toUpperCase();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isCodeValid()) {
      setError(
        method === 'qr-scan'
          ? `รหัส QR ไม่ตรงกับจุดตรวจของ ${park.name} (กรุณาตรวจสอบป้าย QR ณ ศูนย์บริการนักท่องเที่ยว)`
          : `รหัสเจ้าหน้าที่อุทยานไม่ถูกต้อง สำหรับ ${park.name}`
      );
      return;
    }

    stopCamera();
    const record: StampRecord = {
      parkId: park.id,
      visitDate,
      stampedAt: new Date().toISOString(),
      verificationMethod: method,
      verificationCode: codeInput.trim().toUpperCase(),
      note: note.trim(),
      photoDataUrl,
    };

    setJustStamped(true);
    setTimeout(() => {
      onSaveStamp(record);
    }, 850);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/55 backdrop-blur-sm sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkin-modal-title"
    >
      <div className="w-full sm:max-w-xl max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-2xl border border-[#E4DFD5] bg-[#FBF9F5] p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#E4DFD5]">
          <div>
            <p className="text-xs font-mono text-[#57534E] tabular-nums">
              {park.code} · จ.{park.provinces.join(', ')}
            </p>
            <h2
              id="checkin-modal-title"
              className={`${TYPOGRAPHY.mainHeading} text-xl text-[#1C1917] mt-0.5`}
            >
              {existingStamp ? 'แก้ไขบันทึกการพิชิต' : 'บันทึกการพิชิตและประทับตรา'}
            </h2>
            <p className={`${TYPOGRAPHY.body} text-sm text-[#57534E]`}>{park.name}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-[#57534E] hover:bg-[#EBE6DF] transition-colors"
            aria-label="ปิดหน้าต่าง"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {justStamped ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <motion.div
              initial={{ scale: 1.9, opacity: 0, rotate: -14 }}
              animate={{ scale: 1, opacity: 1, rotate: -5 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            >
              <ParkStampSvg
                park={park}
                stamp={{
                  parkId: park.id,
                  visitDate,
                  stampedAt: new Date().toISOString(),
                  verificationMethod: method,
                  verificationCode: codeInput.trim().toUpperCase(),
                  note,
                  photoDataUrl,
                }}
                size="lg"
                rotate={-4}
              />
            </motion.div>
            <p className={`mt-5 text-lg text-[#183126] ${TYPOGRAPHY.mainHeading}`}>
              ประทับตราลงสมุดพาสปอร์ตสำเร็จ
            </p>
            <p className={`text-sm text-[#57534E] mt-1 ${TYPOGRAPHY.body}`}>
              กำลังบันทึกข้อมูลตราประทับลงในคอลเลกชันของคุณ...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-5">
            {/* Verification Method Switcher */}
            <div>
              <label className={`block text-xs text-[#57534E] mb-2 ${TYPOGRAPHY.sectionHeading}`}>
                1. เลือกวิธียืนยันการเดินทางถึงอุทยานจริง
              </label>
              <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-[#EBE6DF]">
                <button
                  type="button"
                  onClick={() => {
                    setMethod('qr-scan');
                    setError(null);
                  }}
                  className={`min-h-[44px] px-3 py-2 rounded-lg text-xs flex items-center justify-center gap-2 transition-colors whitespace-nowrap ${TYPOGRAPHY.button} ${
                    method === 'qr-scan'
                      ? 'bg-[#FBF9F5] text-[#183126] shadow-sm'
                      : 'text-[#57534E] hover:text-[#1C1917]'
                  }`}
                >
                  <QrCode className="w-4 h-4 shrink-0" />
                  <span>QR Code ประจำอุทยาน</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    stopCamera();
                    setMethod('ranger-pin');
                    setError(null);
                  }}
                  className={`min-h-[44px] px-3 py-2 rounded-lg text-xs flex items-center justify-center gap-2 transition-colors whitespace-nowrap ${TYPOGRAPHY.button} ${
                    method === 'ranger-pin'
                      ? 'bg-[#FBF9F5] text-[#183126] shadow-sm'
                      : 'text-[#57534E] hover:text-[#1C1917]'
                  }`}
                >
                  <KeyRound className="w-4 h-4 shrink-0" />
                  <span>รหัสยืนยันเจ้าหน้าที่</span>
                </button>
              </div>
            </div>

            {/* Verification Input Area */}
            <div className="rounded-xl border border-[#E4DFD5] bg-[#F7F4EE] p-4 space-y-3">
              {method === 'qr-scan' ? (
                <>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-medium text-[#1C1917] flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-[#183126]" />
                      สแกนหรือกรอกรหัส QR ณ ศูนย์บริการนักท่องเที่ยว
                    </span>
                    <button
                      type="button"
                      onClick={isCameraActive ? stopCamera : startQrCamera}
                      className="px-3 py-1.5 min-h-[36px] rounded-lg border border-[#D6CEBE] bg-white text-xs font-medium text-[#183126] hover:bg-[#EBE6DF] transition-colors inline-flex items-center gap-1.5 whitespace-nowrap"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      {isCameraActive ? 'ปิดกล้อง' : 'เปิดกล้องสแกน QR'}
                    </button>
                  </div>

                  {isCameraActive && (
                    <div className="rounded-lg overflow-hidden border border-[#D6CEBE] bg-black">
                      <video
                        ref={videoRef}
                        className="w-full h-44 object-cover"
                        muted
                        playsInline
                      />
                    </div>
                  )}

                  {cameraStatus && (
                    <p className="text-xs text-[#57534E]">{cameraStatus}</p>
                  )}

                  <input
                    type="text"
                    value={codeInput}
                    onChange={(e) => setCodeInput(e.target.value)}
                    placeholder={`กรอกรหัส QR (เช่น ${park.qrCodeValue})`}
                    className="w-full min-h-[44px] px-3.5 py-2 rounded-lg border border-[#D6CEBE] bg-white font-mono text-sm text-[#1C1917] focus:outline-none focus:border-[#183126]"
                    required
                  />
                </>
              ) : (
                <>
                  <div className="flex items-center gap-1.5 text-xs font-medium text-[#1C1917]">
                    <ShieldCheck className="w-4 h-4 text-[#183126]" />
                    กรอกรหัสยืนยันจากเจ้าหน้าที่ประจำด่านตรวจอุทยาน
                  </div>
                  <input
                    type="text"
                    value={codeInput}
                    onChange={(e) => setCodeInput(e.target.value)}
                    placeholder={`กรอกรหัสเจ้าหน้าที่ (เช่น ${park.rangerPin})`}
                    className="w-full min-h-[44px] px-3.5 py-2 rounded-lg border border-[#D6CEBE] bg-white font-mono text-sm text-[#1C1917] focus:outline-none focus:border-[#183126]"
                    required
                  />
                </>
              )}

              {/* Park Checkpoint Sample Pass Drawer for Demo / Testing */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setShowSampleSign((prev) => !prev)}
                  className="text-xs text-[#183126] underline underline-offset-4 hover:text-[#9A3412] transition-colors cursor-pointer"
                >
                  {showSampleSign
                    ? 'ซ่อนข้อมูลจุดตรวจศูนย์บริการ'
                    : 'ดูป้าย QR และรหัสประจำด่านตรวจของอุทยานนี้ (สำหรับทดสอบ)'}
                </button>

                {showSampleSign && (
                  <div className="mt-3 p-3 rounded-xl border border-[#D6CEBE] bg-white flex flex-col sm:flex-row items-center gap-4">
                    <QrCodeSvg value={park.qrCodeValue} size={96} />
                    <div className="flex-1 text-xs space-y-1.5 text-center sm:text-left">
                      <p className="font-semibold text-[#1C1917]">
                        จุดตรวจศูนย์บริการนักท่องเที่ยว · {park.name}
                      </p>
                      <p className="font-mono text-[#57534E]">
                        QR Payload: <strong className="text-[#1C1917]">{park.qrCodeValue}</strong>
                      </p>
                      <p className="font-mono text-[#57534E]">
                        Ranger PIN: <strong className="text-[#1C1917]">{park.rangerPin}</strong>
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setCodeInput(
                            method === 'qr-scan' ? park.qrCodeValue : park.rangerPin
                          );
                          setError(null);
                        }}
                        className="mt-1 px-3 py-1.5 rounded-lg bg-[#183126] text-white text-xs font-medium hover:bg-[#11241B] transition-colors inline-flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        จำลองการสแกน/ยืนยัน ณ จุดบริการ
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Visit Date & Photo Upload */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="visit-date-input"
                  className="block text-xs font-medium text-[#57534E] mb-1.5"
                >
                  2. วันที่เดินทางถึงอุทยาน
                </label>
                <input
                  id="visit-date-input"
                  type="date"
                  value={visitDate}
                  max={new Date().toISOString().slice(0, 10)}
                  onChange={(e) => setVisitDate(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-lg border border-[#D6CEBE] bg-white font-mono text-sm text-[#1C1917] focus:outline-none focus:border-[#183126]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#57534E] mb-1.5">
                  3. แนบภาพถ่ายความทรงจำ (ไม่บังคับ)
                </label>
                <label className="w-full min-h-[44px] px-3.5 py-2 rounded-lg border border-dashed border-[#C8BFA8] bg-white hover:bg-[#F7F4EE] transition-colors flex items-center justify-center gap-2 text-xs font-medium text-[#1C1917] cursor-pointer">
                  <Upload className="w-4 h-4 text-[#183126]" />
                  <span>{photoDataUrl ? 'เปลี่ยนรูปภาพที่แนบ' : 'อัปโหลดภาพถ่ายจากทริป'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="sr-only"
                  />
                </label>
              </div>
            </div>

            {photoDataUrl && (
              <div className="relative rounded-xl overflow-hidden border border-[#E4DFD5] bg-white">
                <img
                  src={photoDataUrl}
                  alt="ภาพถ่ายที่แนบในการเดินทาง"
                  className="w-full h-44 object-cover"
                />
                <button
                  type="button"
                  onClick={() => setPhotoDataUrl(undefined)}
                  className="absolute top-2 right-2 px-2.5 py-1 rounded-lg bg-black/70 text-white text-xs hover:bg-black transition-colors"
                >
                  ลบรูป
                </button>
              </div>
            )}

            {/* Memory Note */}
            <div>
              <label
                htmlFor="visit-note-input"
                className="block text-xs font-medium text-[#57534E] mb-1.5"
              >
                4. บันทึกความทรงจำระหว่างเดินทาง
              </label>
              <textarea
                id="visit-note-input"
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="บรรยากาศ เส้นทางเดินป่า หรือเรื่องราวประทับใจในอุทยานนี้..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#D6CEBE] bg-white text-sm text-[#1C1917] focus:outline-none focus:border-[#183126]"
              />
            </div>

            {error && (
              <div
                role="alert"
                className="rounded-lg border border-[#9A3412]/30 bg-[#9A3412]/10 px-3.5 py-2.5 text-xs text-[#9A3412]"
              >
                {error}
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  stopCamera();
                  onClose();
                }}
                className="px-4 py-2.5 min-h-[44px] rounded-lg border border-[#D6CEBE] bg-white text-sm font-medium text-[#1C1917] hover:bg-[#F7F4EE] transition-colors"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 min-h-[44px] rounded-lg bg-[#183126] text-white text-sm font-medium hover:bg-[#11241B] transition-colors whitespace-nowrap"
              >
                ยืนยันและประทับตราลงพาสปอร์ต
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
