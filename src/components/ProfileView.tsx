import React, { useState } from 'react';
import { User } from 'firebase/auth';
import {
  CheckCircle2,
  Download,
  ExternalLink,
  FileSpreadsheet,
  LogOut,
  RefreshCw,
  RotateCcw,
  Save,
} from 'lucide-react';
import { TRAVELER_AVATAR } from '../data/isanParks';
import {
  NationalPark,
  SheetsSyncConfig,
  StampRecord,
  TravelerProfile,
} from '../types/park';
import { TYPOGRAPHY } from '../styles/typography';
import { ParkImage } from './ParkImage';

interface ProfileViewProps {
  parks: NationalPark[];
  stamps: Record<string, StampRecord>;
  profile: TravelerProfile;
  onUpdateProfile: (profile: TravelerProfile) => void;
  googleUser: User | null;
  hasAccessToken: boolean;
  isSigningIn: boolean;
  onGoogleSignIn: () => void;
  onGoogleSignOut: () => void;
  sheetsConfig: SheetsSyncConfig | null;
  sheetsBusy: boolean;
  sheetsMessage: { type: 'success' | 'error'; text: string } | null;
  onCreateSpreadsheet: () => void;
  onConnectSpreadsheet: (input: string) => void;
  onRequestSyncPush: () => void;
  onPullFromSpreadsheet: () => void;
  onRequestResetStamps: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  parks,
  stamps,
  profile,
  onUpdateProfile,
  googleUser,
  hasAccessToken,
  isSigningIn,
  onGoogleSignIn,
  onGoogleSignOut,
  sheetsConfig,
  sheetsBusy,
  sheetsMessage,
  onCreateSpreadsheet,
  onConnectSpreadsheet,
  onRequestSyncPush,
  onPullFromSpreadsheet,
  onRequestResetStamps,
}) => {
  const [displayName, setDisplayName] = useState(profile.displayName);
  const [homeProvince, setHomeProvince] = useState(profile.homeProvince);
  const [bio, setBio] = useState(profile.bio);
  const [savedNotice, setSavedNotice] = useState(false);
  const [sheetUrlInput, setSheetUrlInput] = useState(sheetsConfig?.spreadsheetId || '');

  const conqueredCount = Object.keys(stamps).length;
  const pct = Math.round((conqueredCount / parks.length) * 100);
  const visitedProvinces = new Set(
    parks.filter((p) => stamps[p.id]).flatMap((p) => p.provinces)
  ).size;
  const photosCount = Object.values(stamps).filter((s) => Boolean(s.photoDataUrl)).length;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...profile,
      displayName: displayName.trim() || 'นักเดินทางอีสาน',
      homeProvince: homeProvince.trim() || 'ขอนแก่น',
      bio: bio.trim(),
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  return (
    <div className="space-y-10">
      <div className="border-b border-[#E4DFD5] pb-6">
        <p className={`text-xs text-[#57534E] uppercase ${TYPOGRAPHY.enHeading}`}>
          Traveler Profile & Google Sheets Sync
        </p>
        <h1 className={`mt-2 text-3xl sm:text-4xl text-[#1C1917] ${TYPOGRAPHY.mainHeading}`}>
          ข้อมูลผู้เดินทางและสถิติพาสปอร์ต
        </h1>
        <p className={`mt-2 text-sm text-[#57534E] ${TYPOGRAPHY.body}`}>
          จัดการข้อมูลสมุดเดินทางส่วนตัว และเชื่อมต่อบัญชี Google เพื่อสำรองข้อมูลการพิชิต 26 อุทยานลงใน Google Sheets
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Profile Form & Travel Stats */}
        <div className="lg:col-span-6 space-y-6">
          <section className="rounded-2xl border border-[#E4DFD5] bg-[#FBF9F5] p-6 sm:p-8">
            <div className="flex items-center gap-4 pb-6 border-b border-[#E4DFD5]">
              <div className="w-16 h-16 rounded-2xl overflow-hidden border border-[#D6CEBE] shrink-0">
                <ParkImage
                  src={googleUser?.photoURL || profile.avatarUrl || TRAVELER_AVATAR}
                  alt={profile.displayName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h2 className={`text-xl text-[#1C1917] ${TYPOGRAPHY.mainHeading}`}>
                  {profile.displayName}
                </h2>
                <p className={`text-xs text-[#57534E] mt-0.5 ${TYPOGRAPHY.body}`}>
                  ประจำจังหวัด{profile.homeProvince} · พิชิตแล้ว{' '}
                  <span className={`text-[#183126] ${TYPOGRAPHY.achievement}`}>
                    {conqueredCount}/{parks.length}
                  </span>{' '}
                  อุทยาน
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="profile-name"
                  className="block text-xs font-medium text-[#57534E] mb-1.5"
                >
                  ชื่อบนหน้าสมุดพาสปอร์ต
                </label>
                <input
                  id="profile-name"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-lg border border-[#D6CEBE] bg-white text-sm text-[#1C1917] focus:outline-none focus:border-[#183126]"
                />
              </div>

              <div>
                <label
                  htmlFor="profile-province"
                  className="block text-xs font-medium text-[#57534E] mb-1.5"
                >
                  จังหวัดเริ่มต้นการเดินทาง
                </label>
                <input
                  id="profile-province"
                  type="text"
                  value={homeProvince}
                  onChange={(e) => setHomeProvince(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-lg border border-[#D6CEBE] bg-white text-sm text-[#1C1917] focus:outline-none focus:border-[#183126]"
                />
              </div>

              <div>
                <label
                  htmlFor="profile-bio"
                  className="block text-xs font-medium text-[#57534E] mb-1.5"
                >
                  คติประจำใจหรือเป้าหมายการเดินทาง
                </label>
                <textarea
                  id="profile-bio"
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg border border-[#D6CEBE] bg-white text-sm text-[#1C1917] focus:outline-none focus:border-[#183126]"
                />
              </div>

              <div className="flex items-center justify-between gap-3 pt-1">
                <button
                  type="submit"
                  className={`px-4 py-2.5 min-h-[44px] rounded-xl bg-[#183126] text-white text-sm hover:bg-[#11241B] transition-colors inline-flex items-center gap-2 cursor-pointer ${TYPOGRAPHY.button}`}
                >
                  <Save className="w-4 h-4" />
                  <span>บันทึกข้อมูลส่วนตัว</span>
                </button>
                {savedNotice && (
                  <span className="text-xs font-medium text-[#183126] inline-flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> บันทึกแล้ว
                  </span>
                )}
              </div>
            </form>
          </section>

          {/* Summary Statistics (Cinzel Bold Achievement Numbers) */}
          <section className="rounded-2xl border border-[#E4DFD5] bg-[#FBF9F5] p-6">
            <h2 className={`text-lg text-[#1C1917] ${TYPOGRAPHY.sectionHeading}`}>
              สถิติการสะสมตราประทับ
            </h2>
            <dl className="mt-4 grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-[#E4DFD5] bg-[#F7F4EE] p-4">
                <dt className={`text-xs text-[#57534E] ${TYPOGRAPHY.body}`}>ความคืบหน้า</dt>
                <dd className={`mt-1 text-2xl text-[#183126] ${TYPOGRAPHY.achievement}`}>
                  {pct}%
                </dd>
              </div>
              <div className="rounded-xl border border-[#E4DFD5] bg-[#F7F4EE] p-4">
                <dt className={`text-xs text-[#57534E] ${TYPOGRAPHY.body}`}>จังหวัดที่เยือน</dt>
                <dd className={`mt-1 text-2xl text-[#1C1917] ${TYPOGRAPHY.achievement}`}>
                  {visitedProvinces} <span className="text-sm font-sans font-normal text-[#57534E]">จังหวัด</span>
                </dd>
              </div>
              <div className="rounded-xl border border-[#E4DFD5] bg-[#F7F4EE] p-4">
                <dt className={`text-xs text-[#57534E] ${TYPOGRAPHY.body}`}>ภาพถ่ายที่บันทึก</dt>
                <dd className={`mt-1 text-2xl text-[#1C1917] ${TYPOGRAPHY.achievement}`}>
                  {photosCount} <span className="text-sm font-sans font-normal text-[#57534E]">ภาพ</span>
                </dd>
              </div>
              <div className="rounded-xl border border-[#E4DFD5] bg-[#F7F4EE] p-4">
                <dt className={`text-xs text-[#57534E] ${TYPOGRAPHY.body}`}>อุทยานคงเหลือ</dt>
                <dd className={`mt-1 text-2xl text-[#9A3412] ${TYPOGRAPHY.achievement}`}>
                  {parks.length - conqueredCount} <span className="text-sm font-sans font-normal text-[#57534E]">แห่ง</span>
                </dd>
              </div>
            </dl>
          </section>
        </div>

        {/* Right: Google Sheets Integration & Backup */}
        <div className="lg:col-span-6 space-y-6">
          <section className="rounded-2xl border border-[#E4DFD5] bg-[#FBF9F5] p-6 sm:p-8 space-y-5">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#E4DFD5]">
              <div>
                <h2 className={`text-xl text-[#1C1917] inline-flex items-center gap-2 ${TYPOGRAPHY.sectionHeading}`}>
                  <FileSpreadsheet className="w-5 h-5 text-[#183126]" />
                  เชื่อมต่อ Google Sheets
                </h2>
                <p className={`text-sm text-[#57534E] mt-1 ${TYPOGRAPHY.body}`}>
                  บันทึกและซิงก์รายชื่ออุทยาน วันที่พิชิต วิธียืนยัน และข้อความบันทึกความทรงจำลงสเปรดชีตส่วนตัวของคุณ
                </p>
              </div>
            </div>

            {!googleUser || !hasAccessToken ? (
              <div className="rounded-xl border border-[#E4DFD5] bg-[#F7F4EE] p-5 space-y-4">
                <p className="text-sm text-[#1C1917]">
                  เข้าสู่ระบบด้วย Google เพื่อสร้างหรือเชื่อมต่อสเปรดชีตสำหรับสำรองข้อมูลพาสปอร์ต E-san low Trip ของคุณ
                </p>

                {/* Official Google Sign-In Material Button */}
                <button
                  type="button"
                  onClick={onGoogleSignIn}
                  disabled={isSigningIn}
                  className="gsi-material-button"
                >
                  <div className="gsi-material-button-state" />
                  <div className="gsi-material-button-content-wrapper">
                    <div className="gsi-material-button-icon">
                      <svg
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 48 48"
                        style={{ display: 'block' }}
                      >
                        <path
                          fill="#EA4335"
                          d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                        />
                        <path
                          fill="#4285F4"
                          d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                        />
                        <path
                          fill="#34A853"
                          d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                        />
                        <path fill="none" d="M0 0h48v48H0z" />
                      </svg>
                    </div>
                    <span className="gsi-material-button-contents">
                      {isSigningIn ? 'กำลังเข้าสู่ระบบ...' : 'Sign in with Google'}
                    </span>
                  </div>
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Signed in account row */}
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#E4DFD5] bg-[#F7F4EE] p-4">
                  <div className="min-w-0">
                    <p className="text-xs text-[#57534E]">เชื่อมต่อบัญชี Google แล้ว</p>
                    <p className="text-sm font-medium text-[#1C1917] truncate">
                      {googleUser.displayName || googleUser.email}
                    </p>
                    <p className="text-xs font-mono text-[#57534E] truncate">
                      {googleUser.email}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={onGoogleSignOut}
                    className="px-3.5 py-2 min-h-[38px] rounded-lg border border-[#D6CEBE] bg-white text-xs font-medium text-[#1C1917] hover:bg-[#EBE6DF] transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>ออกจากระบบ</span>
                  </button>
                </div>

                {/* Create or Connect Sheet */}
                {!sheetsConfig ? (
                  <div className="space-y-4">
                    <button
                      type="button"
                      disabled={sheetsBusy}
                      onClick={onCreateSpreadsheet}
                      className="w-full px-4 py-3 min-h-[44px] rounded-xl bg-[#183126] text-white text-sm font-medium hover:bg-[#11241B] disabled:opacity-60 transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <FileSpreadsheet className="w-4 h-4" />
                      <span>
                        {sheetsBusy
                          ? 'กำลังสร้าง Google Sheet...'
                          : 'สร้าง Google Sheet สมุดพาสปอร์ตใหม่'}
                      </span>
                    </button>

                    <div className="pt-3 border-t border-[#E4DFD5]">
                      <label
                        htmlFor="connect-sheet-id"
                        className="block text-xs font-medium text-[#57534E] mb-1.5"
                      >
                        หรือวางลิงก์ / Spreadsheet ID ที่มีอยู่แล้ว
                      </label>
                      <div className="flex gap-2">
                        <input
                          id="connect-sheet-id"
                          type="text"
                          value={sheetUrlInput}
                          onChange={(e) => setSheetUrlInput(e.target.value)}
                          placeholder="https://docs.google.com/spreadsheets/d/..."
                          className="flex-1 min-h-[44px] px-3.5 py-2 rounded-lg border border-[#D6CEBE] bg-white text-xs font-mono text-[#1C1917] focus:outline-none focus:border-[#183126]"
                        />
                        <button
                          type="button"
                          disabled={sheetsBusy || !sheetUrlInput.trim()}
                          onClick={() => onConnectSpreadsheet(sheetUrlInput)}
                          className="px-4 py-2 min-h-[44px] rounded-lg border border-[#183126] text-xs font-medium text-[#183126] hover:bg-[#183126] hover:text-white disabled:opacity-50 transition-colors whitespace-nowrap cursor-pointer"
                        >
                          เชื่อมต่อ
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="rounded-xl border border-[#D6CEBE] bg-white p-4 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-xs text-[#57534E]">สเปรดชีตที่เชื่อมต่ออยู่</p>
                          <p className="text-sm font-semibold text-[#1C1917] mt-0.5">
                            {sheetsConfig.spreadsheetTitle}
                          </p>
                        </div>
                        <a
                          href={sheetsConfig.spreadsheetUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-medium text-[#183126] hover:underline whitespace-nowrap"
                        >
                          เปิดไฟล์ <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                      <p className="text-xs font-mono text-[#57534E] tabular-nums">
                        Tab: {sheetsConfig.sheetTabName} ·{' '}
                        {sheetsConfig.lastSyncedAt
                          ? `ซิงก์ล่าสุด ${new Date(sheetsConfig.lastSyncedAt).toLocaleString('th-TH')}`
                          : 'ยังไม่ได้ซิงก์ข้อมูล'}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        type="button"
                        disabled={sheetsBusy}
                        onClick={onRequestSyncPush}
                        className="px-4 py-3 min-h-[44px] rounded-xl bg-[#183126] text-white text-xs font-medium hover:bg-[#11241B] disabled:opacity-60 transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <RefreshCw className={`w-4 h-4 ${sheetsBusy ? 'animate-spin' : ''}`} />
                        <span>อัปเดตข้อมูลขึ้น Google Sheet</span>
                      </button>

                      <button
                        type="button"
                        disabled={sheetsBusy}
                        onClick={onPullFromSpreadsheet}
                        className="px-4 py-3 min-h-[44px] rounded-xl border border-[#D6CEBE] bg-white text-[#1C1917] text-xs font-medium hover:bg-[#F7F4EE] disabled:opacity-60 transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                        <span>ดึงข้อมูลจาก Google Sheet</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {sheetsMessage && (
              <div
                role="status"
                className={`rounded-xl px-4 py-3 text-xs border ${
                  sheetsMessage.type === 'success'
                    ? 'border-[#183126]/30 bg-[#183126]/5 text-[#183126]'
                    : 'border-[#9A3412]/30 bg-[#9A3412]/10 text-[#9A3412]'
                }`}
              >
                {sheetsMessage.text}
              </div>
            )}
          </section>

          {/* Reset Passport Data Section */}
          <section className="rounded-2xl border border-[#E4DFD5] bg-[#FBF9F5] p-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold text-[#1C1917]">
                ล้างข้อมูลตราประทับในอุปกรณ์นี้
              </h3>
              <p className="text-xs text-[#57534E] mt-0.5">
                รีเซ็ตตราประทับทั้งหมดในเบราว์เซอร์กลับเป็น 0 / 26 แห่ง
              </p>
            </div>
            <button
              type="button"
              disabled={conqueredCount === 0}
              onClick={onRequestResetStamps}
              className="px-4 py-2 min-h-[40px] rounded-lg border border-[#9A3412]/40 text-xs font-medium text-[#9A3412] hover:bg-[#9A3412]/10 disabled:opacity-40 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>รีเซ็ตตราประทับ</span>
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};
