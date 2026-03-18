import React, { useState, useRef, useEffect } from 'react';
import {
  Megaphone,
  ShoppingBag,
  BarChart3,
  DollarSign,
  CircleHelp,
  LogOut,
  Store,
  Settings,
  KeyRound,
  CircleUser,
  Users,
  FileBarChart,
  Map,
  Tag,
  Globe,
} from 'lucide-react';

// 임시 번역 함수 (나중에 제거)
const setGoogleTranslateLang = (lang: string) => {
  const select = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
  if (select) {
    select.value = lang;
    select.dispatchEvent(new Event('change'));
  }
};

const SHOP_NAV = [
  { key: 'stats', label: '광고 성과', icon: BarChart3 },
  { key: 'myads', label: '알짜광고', icon: Megaphone },
  { key: 'myshopping', label: '실속쇼핑', icon: ShoppingBag },
  { key: 'pricing', label: '요금 안내', icon: DollarSign },
  { key: 'faq', label: '고객센터', icon: CircleHelp },
] as const;

const ADMIN_NAV = [
  { key: 'admin-stats', label: '통계', icon: BarChart3 },
  { key: 'admin-shops', label: '이웃상가', icon: Store },
  { key: 'admin-ads', label: '알짜광고', icon: Megaphone },
  { key: 'admin-shopping', label: '실속쇼핑', icon: ShoppingBag },
  { key: 'admin-sales', label: '영업 대시보드', icon: Users },
  { key: 'admin-report', label: '성과 리포트', icon: FileBarChart },
] as const;

interface Props {
  current: string;
  shopName: string;
  userEmail?: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  isAdmin?: boolean;
}

export const TopNav: React.FC<Props> = ({ current, shopName, userEmail, onNavigate, onLogout, isAdmin }) => {
  const NAV = isAdmin ? ADMIN_NAV : SHOP_NAV;
  const defaultPage = isAdmin ? 'admin-stats' : 'stats';
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 시 닫기
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className={`${isAdmin ? 'bg-gray-900' : 'bg-white'} border-b ${isAdmin ? 'border-gray-700' : 'border-gray-200'} sticky top-0 z-40`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer shrink-0" onClick={() => onNavigate(defaultPage)}>
            <img src="/logo.png" alt="EYEVACS" className="w-10 h-10 rounded-lg object-cover" />
            <div>
              <h1 className={`text-lg font-bold leading-none ${isAdmin ? 'text-white' : 'text-gray-900'}`}>EYEVACS</h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                {isAdmin && <span className="text-[9px] font-bold text-amber-400 bg-amber-400/20 px-1.5 py-0.5 rounded">ADMIN</span>}
                <p className="text-xs text-gray-400 leading-none">
                  {isAdmin ? '관리자 콘솔' : '우리동네 사장님'}
                </p>
              </div>
            </div>
          </div>

          {/* Nav Links — 중앙 */}
          <nav className={`hidden lg:flex items-center justify-center flex-1 ${isAdmin ? 'gap-2 mx-6' : 'gap-2 mx-6'}`}>
            {NAV.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => onNavigate(key)}
                className={`flex items-center gap-2 px-3 py-2.5 text-sm border-b-2 transition ${
                  current === key
                    ? isAdmin ? 'border-amber-400 text-amber-400 font-bold' : 'border-[#222] text-[#222] font-bold'
                    : isAdmin ? 'border-transparent text-gray-400 hover:text-amber-400 font-medium' : 'border-transparent text-gray-500 hover:text-gray-900 font-medium'
                }`}
              >
                {label}
              </button>
            ))}
          </nav>

          {/* 임시 언어 전환 */}
          <div className="relative mr-2" ref={langRef}>
            <button
              onClick={() => setLangOpen(!langOpen)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                isAdmin ? 'text-gray-400 hover:bg-white/10' : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              Language
              <svg className={`w-3 h-3 transition ${langOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {langOpen && (
              <div className={`absolute right-0 top-full mt-1 w-36 rounded-lg shadow-sm border overflow-hidden z-50 animate-fade-in ${
                isAdmin ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                {[
                  { code: 'ko', label: '한국어', flag: '🇰🇷' },
                  { code: 'en', label: 'English', flag: '🇺🇸' },
                  { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
                ].map(({ code, label, flag }) => (
                  <button
                    key={code}
                    onClick={() => { setGoogleTranslateLang(code); setLangOpen(false); }}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-medium transition ${
                      isAdmin ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span>{flag}</span>
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right — Profile Dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition ${
                menuOpen
                  ? isAdmin ? 'bg-white/10' : 'bg-gray-100'
                  : isAdmin ? 'hover:bg-white/5' : 'hover:bg-gray-50'
              }`}
            >
              <div className="hidden sm:block text-left">
                <span className={`text-sm font-medium block leading-none ${isAdmin ? 'text-white' : 'text-gray-700'}`}>
                  {isAdmin ? '관리자' : `${shopName} 사장님`}
                </span>
                {isAdmin && (
                  <span className="text-xs text-gray-400 leading-none">admin@gmail.com</span>
                )}
              </div>
              <svg className={`w-4 h-4 transition ${menuOpen ? 'rotate-180' : ''} ${isAdmin ? 'text-gray-400' : 'text-gray-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {menuOpen && (
              <div className={`absolute right-0 top-full mt-2 w-56 rounded-lg shadow-sm border overflow-hidden z-50 animate-fade-in ${
                isAdmin ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                {/* Header */}
                <div className={`px-4 py-3 border-b ${isAdmin ? 'border-gray-700' : 'border-gray-100'}`}>
                  <p className={`text-sm font-semibold ${isAdmin ? 'text-white' : 'text-gray-900'}`}>
                    {isAdmin ? '관리자' : `${shopName} 사장님`}
                  </p>
                  {isAdmin && (
                    <p className="text-xs mt-0.5 text-gray-400">admin@gmail.com</p>
                  )}
                </div>

                {/* Menu Items */}
                <div className="py-1">
                  {!isAdmin && (
                    <>
                      <DropdownItem
                        icon={<CircleUser className="w-4 h-4" />}
                        label="내 계정"
                        dark={false}
                        onClick={() => { onNavigate('my-account'); setMenuOpen(false); }}
                      />
                      <DropdownItem
                        icon={<Store className="w-4 h-4" />}
                        label="내 가게 관리"
                        dark={false}
                        onClick={() => { onNavigate('myshop'); setMenuOpen(false); }}
                      />
                    </>
                  )}
                  {isAdmin && (
                    <>
                      <DropdownItem
                        icon={<CircleUser className="w-4 h-4" />}
                        label="계정 정보"
                        dark
                        onClick={() => { onNavigate('my-account'); setMenuOpen(false); }}
                      />
                    </>
                  )}
                </div>

                <div className={`border-t ${isAdmin ? 'border-gray-700' : 'border-gray-100'}`}>
                  <DropdownItem
                    icon={<LogOut className="w-4 h-4" />}
                    label="로그아웃"
                    dark={!!isAdmin}
                    danger
                    onClick={() => { onLogout(); setMenuOpen(false); }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Nav */}
        <nav className={`flex lg:hidden items-center gap-2 pb-3 overflow-x-auto -mx-1 px-1`}>
          {NAV.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => onNavigate(key)}
              className={`flex items-center gap-1.5 px-3 py-2.5 text-sm whitespace-nowrap border-b-2 transition ${
                current === key
                  ? isAdmin ? 'border-amber-400 text-amber-400 font-bold' : 'border-[#222] text-[#222] font-bold'
                  : isAdmin ? 'border-transparent text-gray-400 hover:text-amber-400 font-medium' : 'border-transparent text-gray-500 hover:text-gray-900 font-medium'
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};

const DropdownItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  dark: boolean;
  danger?: boolean;
  onClick: () => void;
}> = ({ icon, label, dark, danger, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition ${
      danger
        ? dark ? 'text-red-400 hover:bg-red-500/10' : 'text-red-500 hover:bg-red-50'
        : dark ? 'text-gray-300 hover:bg-white/5' : 'text-gray-700 hover:bg-gray-50'
    }`}
  >
    {icon}
    {label}
  </button>
);
