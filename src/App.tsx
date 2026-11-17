import React, { useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { ISAN_NATIONAL_PARKS, TRAVELER_AVATAR } from './data/isanParks';
import {
  AppView,
  SheetsSyncConfig,
  StampRecord,
  TravelerProfile,
} from './types/park';
import {
  getAccessToken,
  googleSignIn,
  googleSignOut,
  initAuth,
} from './services/googleAuth';
import {
  createPassportSpreadsheet,
  extractSpreadsheetId,
  loadStampsFromSheet,
  syncStampsToSheet,
} from './services/googleSheets';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { ExploreView } from './components/ExploreView';
import { ParkDetailView } from './components/ParkDetailView';
import { PassportView } from './components/PassportView';
import { MissionsView } from './components/MissionsView';
import { CollectionView } from './components/CollectionView';
import { ProfileView } from './components/ProfileView';
import { CheckInModal } from './components/CheckInModal';
import { ConfirmationModal } from './components/ConfirmationModal';
import { TYPOGRAPHY } from './styles/typography';

const STORAGE_STAMPS_KEY = 'esan_low_trip_stamps_v1';
const STORAGE_PROFILE_KEY = 'esan_low_trip_profile_v1';
const STORAGE_SHEETS_KEY = 'esan_low_trip_sheets_config_v1';

const DEFAULT_PROFILE: TravelerProfile = {
  displayName: 'นักสำรวจอีสาน',
  homeProvince: 'ขอนแก่น',
  bio: 'ออกเดินทางเก็บตราประทับ 26 อุทยานแห่งชาติทั่วแผ่นดินอีสาน',
  avatarUrl: TRAVELER_AVATAR,
};

export default function App() {
  const [activeView, setActiveView] = useState<AppView>('home');
  const [selectedParkId, setSelectedParkId] = useState<string>(ISAN_NATIONAL_PARKS[9].id);
  const [checkInParkId, setCheckInParkId] = useState<string | null>(null);

  const [stamps, setStamps] = useState<Record<string, StampRecord>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_STAMPS_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [profile, setProfile] = useState<TravelerProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PROFILE_KEY);
      return saved ? { ...DEFAULT_PROFILE, ...JSON.parse(saved) } : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  const [sheetsConfig, setSheetsConfig] = useState<SheetsSyncConfig | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SHEETS_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Google Auth & Sheets state (token kept strictly in memory via googleAuth.ts)
  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const [hasAccessToken, setHasAccessToken] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [sheetsBusy, setSheetsBusy] = useState(false);
  const [sheetsMessage, setSheetsMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Confirmation dialogs for destructive / mutating actions
  const [confirmState, setConfirmState] = useState<
    | { type: 'sync-push' }
    | { type: 'remove-stamp'; parkId: string }
    | { type: 'reset-all' }
    | null
  >(null);

  useEffect(() => {
    const unsubscribe = initAuth(
      (user) => {
        setGoogleUser(user);
        setHasAccessToken(Boolean(getAccessToken()));
      },
      (user) => {
        setGoogleUser(user);
        setHasAccessToken(false);
      }
    );
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_STAMPS_KEY, JSON.stringify(stamps));
    } catch {
      // Ignore storage quota overflow gracefully
    }
  }, [stamps]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(profile));
    } catch {
      // Ignore
    }
  }, [profile]);

  useEffect(() => {
    try {
      if (sheetsConfig) {
        localStorage.setItem(STORAGE_SHEETS_KEY, JSON.stringify(sheetsConfig));
      } else {
        localStorage.removeItem(STORAGE_SHEETS_KEY);
      }
    } catch {
      // Ignore
    }
  }, [sheetsConfig]);

  const handleNavigate = (view: AppView) => {
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenPark = (parkId: string) => {
    setSelectedParkId(parkId);
    setActiveView('park-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveStamp = (record: StampRecord) => {
    setStamps((prev) => ({
      ...prev,
      [record.parkId]: record,
    }));
    setCheckInParkId(null);
  };

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    setSheetsMessage(null);
    try {
      const { user } = await googleSignIn();
      setGoogleUser(user);
      setHasAccessToken(true);
      if (user.displayName && profile.displayName === DEFAULT_PROFILE.displayName) {
        setProfile((prev) => ({ ...prev, displayName: user.displayName! }));
      }
    } catch (err) {
      setSheetsMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'เข้าสู่ระบบ Google ไม่สำเร็จ',
      });
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleGoogleSignOut = async () => {
    await googleSignOut();
    setGoogleUser(null);
    setHasAccessToken(false);
    setSheetsMessage(null);
  };

  const handleCreateSpreadsheet = async () => {
    const token = getAccessToken();
    if (!token) {
      setHasAccessToken(false);
      return;
    }
    setSheetsBusy(true);
    setSheetsMessage(null);
    try {
      const created = await createPassportSpreadsheet(token, profile.displayName);
      const synced = await syncStampsToSheet(
        token,
        created,
        ISAN_NATIONAL_PARKS,
        stamps,
        profile.displayName
      );
      setSheetsConfig(synced);
      setSheetsMessage({
        type: 'success',
        text: `สร้างและบันทึกข้อมูลลง Google Sheet "${synced.spreadsheetTitle}" เรียบร้อยแล้ว`,
      });
    } catch (err) {
      setSheetsMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'สร้าง Google Sheet ไม่สำเร็จ',
      });
    } finally {
      setSheetsBusy(false);
    }
  };

  const handleConnectSpreadsheet = async (input: string) => {
    const token = getAccessToken();
    if (!token) {
      setHasAccessToken(false);
      return;
    }
    const id = extractSpreadsheetId(input);
    if (!id) {
      setSheetsMessage({
        type: 'error',
        text: 'รูปแบบลิงก์หรือ Spreadsheet ID ไม่ถูกต้อง',
      });
      return;
    }
    setSheetsBusy(true);
    setSheetsMessage(null);
    try {
      const validIds = new Set(ISAN_NATIONAL_PARKS.map((p) => p.id));
      const { importedCount, mergedStamps, config } = await loadStampsFromSheet(
        token,
        id,
        stamps,
        validIds
      );
      setStamps(mergedStamps);
      setSheetsConfig(config);
      setSheetsMessage({
        type: 'success',
        text: `เชื่อมต่อสเปรดชีต "${config.spreadsheetTitle}" สำเร็จ (พบข้อมูลพิชิต ${importedCount} แห่ง)`,
      });
    } catch (err) {
      setSheetsMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'เชื่อมต่อสเปรดชีตไม่สำเร็จ',
      });
    } finally {
      setSheetsBusy(false);
    }
  };

  const executeSyncPush = async () => {
    const token = getAccessToken();
    if (!token || !sheetsConfig) {
      setConfirmState(null);
      return;
    }
    setSheetsBusy(true);
    setSheetsMessage(null);
    try {
      const updated = await syncStampsToSheet(
        token,
        sheetsConfig,
        ISAN_NATIONAL_PARKS,
        stamps,
        profile.displayName
      );
      setSheetsConfig(updated);
      setSheetsMessage({
        type: 'success',
        text: `อัปเดตข้อมูลทั้ง 26 อุทยานขึ้น Google Sheet "${updated.spreadsheetTitle}" เรียบร้อยแล้ว`,
      });
    } catch (err) {
      setSheetsMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'อัปเดต Google Sheet ไม่สำเร็จ',
      });
    } finally {
      setSheetsBusy(false);
      setConfirmState(null);
    }
  };

  const handlePullFromSpreadsheet = async () => {
    const token = getAccessToken();
    if (!token || !sheetsConfig) return;
    setSheetsBusy(true);
    setSheetsMessage(null);
    try {
      const validIds = new Set(ISAN_NATIONAL_PARKS.map((p) => p.id));
      const { importedCount, mergedStamps, config } = await loadStampsFromSheet(
        token,
        sheetsConfig.spreadsheetId,
        stamps,
        validIds
      );
      setStamps(mergedStamps);
      setSheetsConfig(config);
      setSheetsMessage({
        type: 'success',
        text: `ดึงข้อมูลจาก "${config.spreadsheetTitle}" สำเร็จ (นำเข้า ${importedCount} รายการ)`,
      });
    } catch (err) {
      setSheetsMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'ดึงข้อมูลจาก Google Sheet ไม่สำเร็จ',
      });
    } finally {
      setSheetsBusy(false);
    }
  };

  const selectedPark =
    ISAN_NATIONAL_PARKS.find((p) => p.id === selectedParkId) ||
    ISAN_NATIONAL_PARKS[0];

  const checkInPark = checkInParkId
    ? ISAN_NATIONAL_PARKS.find((p) => p.id === checkInParkId) || null
    : null;

  const conqueredCount = Object.keys(stamps).length;

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F4EE] text-[#1C1917] pb-20 md:pb-0">
      <Navbar
        activeView={activeView}
        onNavigate={handleNavigate}
        conqueredCount={conqueredCount}
        totalCount={ISAN_NATIONAL_PARKS.length}
      />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {activeView === 'home' && (
          <HomeView
            parks={ISAN_NATIONAL_PARKS}
            stamps={stamps}
            travelerName={profile.displayName}
            onNavigate={handleNavigate}
            onOpenPark={handleOpenPark}
            onOpenCheckIn={(parkId) => setCheckInParkId(parkId)}
          />
        )}

        {activeView === 'explore' && (
          <ExploreView
            parks={ISAN_NATIONAL_PARKS}
            stamps={stamps}
            onOpenPark={handleOpenPark}
            onOpenCheckIn={(parkId) => setCheckInParkId(parkId)}
          />
        )}

        {activeView === 'park-detail' && (
          <ParkDetailView
            park={selectedPark}
            allParks={ISAN_NATIONAL_PARKS}
            stamps={stamps}
            onBack={() => handleNavigate('explore')}
            onSelectPark={handleOpenPark}
            onOpenCheckIn={(parkId) => setCheckInParkId(parkId)}
            onRequestRemoveStamp={(parkId) =>
              setConfirmState({ type: 'remove-stamp', parkId })
            }
          />
        )}

        {activeView === 'passport' && (
          <PassportView
            parks={ISAN_NATIONAL_PARKS}
            stamps={stamps}
            travelerName={profile.displayName}
            onOpenPark={handleOpenPark}
            onOpenCheckIn={(parkId) => setCheckInParkId(parkId)}
          />
        )}

        {activeView === 'missions' && (
          <MissionsView
            parks={ISAN_NATIONAL_PARKS}
            stamps={stamps}
            onOpenPark={handleOpenPark}
            onOpenCheckIn={(parkId) => setCheckInParkId(parkId)}
          />
        )}

        {activeView === 'collection' && (
          <CollectionView
            parks={ISAN_NATIONAL_PARKS}
            stamps={stamps}
            onNavigate={handleNavigate}
            onOpenPark={handleOpenPark}
            onOpenCheckIn={(parkId) => setCheckInParkId(parkId)}
          />
        )}

        {activeView === 'profile' && (
          <ProfileView
            parks={ISAN_NATIONAL_PARKS}
            stamps={stamps}
            profile={profile}
            onUpdateProfile={setProfile}
            googleUser={googleUser}
            hasAccessToken={hasAccessToken}
            isSigningIn={isSigningIn}
            onGoogleSignIn={handleGoogleSignIn}
            onGoogleSignOut={handleGoogleSignOut}
            sheetsConfig={sheetsConfig}
            sheetsBusy={sheetsBusy}
            sheetsMessage={sheetsMessage}
            onCreateSpreadsheet={handleCreateSpreadsheet}
            onConnectSpreadsheet={handleConnectSpreadsheet}
            onRequestSyncPush={() => setConfirmState({ type: 'sync-push' })}
            onPullFromSpreadsheet={handlePullFromSpreadsheet}
            onRequestResetStamps={() => setConfirmState({ type: 'reset-all' })}
          />
        )}
      </main>

      <footer className="border-t border-[#E4DFD5] bg-[#FBF9F5] py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#57534E]">
          <span className={TYPOGRAPHY.body}>
            <span className={`${TYPOGRAPHY.logo} text-[#183126] mr-1.5`}>E-san low Trip</span>
            · สมุดสะสมตราประทับดิจิทัล 26 อุทยานแห่งชาติภาคตะวันออกเฉียงเหนือ
          </span>
          <div className={`flex items-center gap-4 ${TYPOGRAPHY.button}`}>
            <button
              type="button"
              onClick={() => handleNavigate('passport')}
              className="hover:text-[#1C1917] cursor-pointer"
            >
              สมุดพาสปอร์ต
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('profile')}
              className="hover:text-[#1C1917] cursor-pointer"
            >
              เชื่อมต่อ Google Sheets
            </button>
          </div>
        </div>
      </footer>

      <CheckInModal
        park={checkInPark}
        existingStamp={checkInPark ? stamps[checkInPark.id] : undefined}
        onClose={() => setCheckInParkId(null)}
        onSaveStamp={handleSaveStamp}
      />

      {/* Explicit Confirmation Dialogs for Mutating / Destructive Operations */}
      <ConfirmationModal
        isOpen={confirmState?.type === 'sync-push'}
        title="ยืนยันการอัปเดตข้อมูลไปยัง Google Sheets"
        description={`ระบบจะเขียนทับข้อมูลในแผ่นงาน "${sheetsConfig?.sheetTabName || 'StampLog'}" ของไฟล์ "${sheetsConfig?.spreadsheetTitle || ''}" ด้วยข้อมูลสมุดพาสปอร์ตล่าสุดของคุณ`}
        details={[
          `จำนวนอุทยานทั้งหมดที่จะบันทึก: ${ISAN_NATIONAL_PARKS.length} แห่ง`,
          `จำนวนตราประทับที่พิชิตแล้ว: ${conqueredCount} แห่ง`,
          'รวมวันที่เดินทาง รหัสยืนยัน และบันทึกความทรงจำ',
        ]}
        confirmLabel="ยืนยันการอัปเดต"
        isLoading={sheetsBusy}
        onConfirm={executeSyncPush}
        onCancel={() => setConfirmState(null)}
      />

      <ConfirmationModal
        isOpen={confirmState?.type === 'remove-stamp'}
        title="ลบตราประทับออกจากสมุดพาสปอร์ต?"
        description="คุณต้องการลบตราประทับและบันทึกความทรงจำของอุทยานแห่งนี้ออกจากสมุดพาสปอร์ตใช่หรือไม่?"
        confirmLabel="ยืนยันการลบ"
        variant="danger"
        onConfirm={() => {
          if (confirmState?.type === 'remove-stamp') {
            setStamps((prev) => {
              const next = { ...prev };
              delete next[confirmState.parkId];
              return next;
            });
          }
          setConfirmState(null);
        }}
        onCancel={() => setConfirmState(null)}
      />

      <ConfirmationModal
        isOpen={confirmState?.type === 'reset-all'}
        title="รีเซ็ตตราประทับทั้งหมด?"
        description={`การดำเนินการนี้จะลบตราประทับทั้งหมด ${conqueredCount} ดวง และบันทึกภาพถ่ายในเบราว์เซอร์นี้ออกทั้งหมด (ไม่สามารถกู้คืนได้ ยกเว้นคุณได้ซิงก์สำรองไว้ใน Google Sheets แล้ว)`}
        confirmLabel="ยืนยันรีเซ็ตทั้งหมด"
        variant="danger"
        onConfirm={() => {
          setStamps({});
          setConfirmState(null);
        }}
        onCancel={() => setConfirmState(null)}
      />
    </div>
  );
}
