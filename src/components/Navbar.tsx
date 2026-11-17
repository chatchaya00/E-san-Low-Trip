import React from 'react';
import { BookOpen, Compass, Flag, Home, Stamp } from 'lucide-react';
import { AppView } from '../types/park';
import { TYPOGRAPHY } from '../styles/typography';

interface NavbarProps {
  activeView: AppView;
  onNavigate: (view: AppView) => void;
  conqueredCount: number;
  totalCount: number;
}

const NAV_ITEMS: { id: AppView; label: string; mobileLabel: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'home', label: 'หน้าหลัก', mobileLabel: 'หน้าหลัก', icon: Home },
  { id: 'explore', label: 'สำรวจ 26 อุทยาน', mobileLabel: 'สำรวจ', icon: Compass },
  { id: 'passport', label: 'สมุดพาสปอร์ต', mobileLabel: 'พาสปอร์ต', icon: BookOpen },
  { id: 'missions', label: 'ภารกิจ', mobileLabel: 'ภารกิจ', icon: Flag },
  { id: 'collection', label: 'คอลเลกชัน', mobileLabel: 'ตราประทับ', icon: Stamp },
];

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  onNavigate,
  conqueredCount,
  totalCount,
}) => {
  const isNavActive = (id: AppView) => {
    if (activeView === 'park-detail' && id === 'explore') return true;
    return activeView === id;
  };

  return (
    <>
      <header className="md:sticky md:top-0 z-30 bg-[#F7F4EE]/95 backdrop-blur-md border-b border-[#E4DFD5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single text element Brand wordmark (Cinzel Bold) */}
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className={`${TYPOGRAPHY.logo} text-xl text-[#183126] whitespace-nowrap shrink-0 text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#183126]`}
          >
            E-san low Trip
          </button>

          {/* Zone 2: Clean single-line text navigation links (Prompt Medium) */}
          <nav
            aria-label="เมนูหลัก"
            className={`hidden md:flex items-center gap-6 text-sm text-[#57534E] ${TYPOGRAPHY.nav}`}
          >
            {NAV_ITEMS.map((item) => {
              const active = isNavActive(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onNavigate(item.id)}
                  className={`relative py-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#183126] ${
                    active
                      ? 'text-[#183126] font-semibold'
                      : 'text-[#57534E] hover:text-[#1C1917]'
                  }`}
                >
                  {item.label}
                  {active && (
                    <span
                      aria-hidden="true"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#183126]"
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Single primary action (Prompt Medium + Cinzel Bold count) */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('profile')}
              className={`px-4 py-2 min-h-[40px] rounded-lg text-xs transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#183126] ${TYPOGRAPHY.button} ${
                activeView === 'profile'
                  ? 'bg-[#9A3412] text-white'
                  : 'bg-[#183126] text-white hover:bg-[#11241B]'
              }`}
            >
              โปรไฟล์ · <span className={TYPOGRAPHY.achievement}>{conqueredCount}/{totalCount}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Fixed Bottom Tab Bar (Thumb Zone, <= 10% height) */}
      <nav
        aria-label="เมนูนำทางมือถือ"
        className={`md:hidden fixed bottom-0 left-0 right-0 z-40 h-16 bg-[#FBF9F5]/95 backdrop-blur-md border-t border-[#E4DFD5] grid grid-cols-5 items-center ${TYPOGRAPHY.nav}`}
      >
        {NAV_ITEMS.slice(0, 4).map((item) => {
          const Icon = item.icon;
          const active = isNavActive(item.id);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`min-h-[44px] flex flex-col items-center justify-center gap-0.5 transition-colors ${
                active ? 'text-[#183126] font-semibold' : 'text-[#57534E]'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[11px] leading-none whitespace-nowrap">
                {item.mobileLabel}
              </span>
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => onNavigate('collection')}
          className={`min-h-[44px] flex flex-col items-center justify-center gap-0.5 transition-colors ${
            activeView === 'collection' ? 'text-[#183126] font-semibold' : 'text-[#57534E]'
          }`}
        >
          <Stamp className="w-5 h-5" />
          <span className="text-[11px] leading-none whitespace-nowrap">
            ตราประทับ
          </span>
        </button>
      </nav>
    </>
  );
};
