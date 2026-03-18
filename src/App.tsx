import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { TopNav } from './components/Sidebar';
import { ToastProvider } from './components/Toast';
import { LoginPage } from './pages/LoginPage';
import { MyShopPage } from './pages/MyShopPage';
import { MyAdsPage } from './pages/MyAdsPage';
import { MyShoppingPage } from './pages/MyShoppingPage';
import { StatsPage } from './pages/StatsPage';
import { PricingPage } from './pages/PricingPage';
import { FaqPage } from './pages/FaqPage';
import { ChangePasswordPage } from './pages/ChangePasswordPage';
import { MyAccountPage } from './pages/MyAccountPage';
import { ShopsPage } from './pages/ShopsPage';
import { AdsPage } from './pages/AdsPage';
import { ShoppingPage } from './pages/ShoppingPage';
import { AdminStatsPage } from './pages/AdminStatsPage';
import { AdminSalesPage } from './pages/AdminSalesPage';
import { AdminReportPage } from './pages/AdminReportPage';
import { TermsPage } from './pages/TermsPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { Footer } from './components/Footer';
import { LocalShop, LocalAd, ShoppingItem, Lead } from './data/types';
import { initialShops, initialAds, initialShopping, initialLeads } from './data/mockData';

// 페이지 key → URL 경로 매핑
const ROUTE_MAP: Record<string, string> = {
  'stats': '/stats',
  'myads': '/myads',
  'myshopping': '/myshopping',
  'pricing': '/pricing',
  'faq': '/faq',
  'myshop': '/myshop',
  'my-account': '/my-account',
  'change-password': '/change-password',
  'admin-stats': '/admin/stats',
  'admin-shops': '/admin/shops',
  'admin-ads': '/admin/ads',
  'admin-shopping': '/admin/shopping',
  'admin-sales': '/admin/sales',
  'admin-report': '/admin/report',
};

// URL 경로 → 페이지 key 역매핑
const PATH_TO_KEY: Record<string, string> = Object.fromEntries(
  Object.entries(ROUTE_MAP).map(([k, v]) => [v, k])
);

function AppInner() {
  const routerNavigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [myShops, setMyShops] = useState<LocalShop[]>([]);
  const [myAds, setMyAds] = useState<LocalAd[]>([]);
  const [myShopping, setMyShopping] = useState<ShoppingItem[]>([]);
  const [isFirstLogin, setIsFirstLogin] = useState(false);

  // Admin state (pre-loaded with mock data)
  const [allShops, setAllShops] = useState<LocalShop[]>(initialShops);
  const [allAds, setAllAds] = useState<LocalAd[]>(initialAds);
  const [allShopping, setAllShopping] = useState<ShoppingItem[]>(initialShopping);
  const [allLeads, setAllLeads] = useState<Lead[]>(initialLeads);

  const [legalModal, setLegalModal] = useState<'terms' | 'privacy' | null>(null);

  const isAdmin = userEmail === 'admin@gmail.com';

  // 현재 URL에서 페이지 key 추출
  const currentKey = PATH_TO_KEY[location.pathname] || (isAdmin ? 'admin-stats' : 'stats');

  const navigate = (p: string) => {
    if (p === 'terms' || p === 'privacy') {
      setLegalModal(p);
      return;
    }
    const path = ROUTE_MAP[p];
    if (path) routerNavigate(path);
  };

  if (!user) {
    return (
      <ToastProvider>
        <LoginPage onLogin={(name, isNew, email) => {
          setUser(name);
          setUserEmail(email);
          if (email === 'admin@gmail.com') {
            routerNavigate('/admin/stats');
          } else {
            routerNavigate('/stats');
            if (isNew) setIsFirstLogin(true);
          }
        }} />
      </ToastProvider>
    );
  }

  const handleLogout = () => {
    setUser(null);
    setUserEmail('');
    routerNavigate('/');
  };

  // Admin mode
  if (isAdmin) {
    return (
      <ToastProvider>
        <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
          <TopNav
            current={currentKey}
            shopName="관리자"
            userEmail={userEmail}
            onNavigate={navigate}
            onLogout={handleLogout}
            isAdmin
          />
          <main className="w-full flex-1">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
              <Routes>
                <Route path="/admin/stats" element={<AdminStatsPage shops={allShops} ads={allAds} shopping={allShopping} />} />
                <Route path="/admin/shops" element={<ShopsPage shops={allShops} setShops={setAllShops} readOnly />} />
                <Route path="/admin/ads" element={<AdsPage ads={allAds} setAds={setAllAds} readOnly />} />
                <Route path="/admin/shopping" element={<ShoppingPage items={allShopping} setItems={setAllShopping} readOnly />} />
                <Route path="/admin/sales" element={<AdminSalesPage leads={allLeads} setLeads={setAllLeads} shops={allShops} />} />
                <Route path="/admin/report" element={<AdminReportPage shops={allShops} ads={allAds} shopping={allShopping} />} />
                <Route path="/my-account" element={<MyAccountPage name={user} email={userEmail} phone={userPhone} onSave={({ name, phone }) => { setUser(name); setUserPhone(phone); }} onBack={() => routerNavigate(-1)} onNavigate={navigate} onWithdraw={handleLogout} />} />
                <Route path="/change-password" element={<ChangePasswordPage onBack={() => routerNavigate(-1)} isAdmin />} />
                <Route path="*" element={<Navigate to="/admin/stats" replace />} />
              </Routes>
            </div>
          </main>
          <Footer onNavigate={navigate} />
          {legalModal === 'terms' && <TermsPage onClose={() => setLegalModal(null)} />}
          {legalModal === 'privacy' && <PrivacyPage onClose={() => setLegalModal(null)} />}
        </div>
      </ToastProvider>
    );
  }

  // 첫 로그인 → 바로 내 가게 관리 페이지로
  if (isFirstLogin && myShops.length === 0) {
    return (
      <ToastProvider>
        <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
          <TopNav current="myshop" shopName={user} userEmail={userEmail} onNavigate={navigate} onLogout={handleLogout} />
          <main className="w-full flex-1">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
              <MyShopPage shops={myShops} setShops={(shops) => { setMyShops(shops); if (shops.length > 0) setIsFirstLogin(false); }} />
            </div>
          </main>
          <Footer onNavigate={navigate} />
          {legalModal === 'terms' && <TermsPage onClose={() => setLegalModal(null)} />}
          {legalModal === 'privacy' && <PrivacyPage onClose={() => setLegalModal(null)} />}
        </div>
      </ToastProvider>
    );
  }

  // Shop owner mode
  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
        <TopNav
          current={currentKey}
          shopName={myShops[0]?.name || user}
          userEmail={userEmail}
          onNavigate={navigate}
          onLogout={handleLogout}
        />
        <main className="w-full flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
            <Routes>
              <Route path="/myshop" element={<MyShopPage shops={myShops} setShops={setMyShops} />} />
              <Route path="/myads" element={<MyAdsPage ads={myAds} setAds={setMyAds} shopName={myShops[0]?.name || user} shops={myShops} onNavigate={navigate} />} />
              <Route path="/myshopping" element={<MyShoppingPage items={myShopping} setItems={setMyShopping} shopName={myShops[0]?.name || user} shops={myShops} onNavigate={navigate} />} />
              <Route path="/stats" element={<StatsPage ads={myAds} shopping={myShopping} onNavigate={navigate} />} />
              <Route path="/pricing" element={<PricingPage onNavigate={navigate} />} />
              <Route path="/faq" element={<FaqPage />} />
              <Route path="/my-account" element={<MyAccountPage name={user} email={userEmail} phone={userPhone} onSave={({ name, phone }) => { setUser(name); setUserPhone(phone); }} onBack={() => routerNavigate(-1)} onNavigate={navigate} onWithdraw={handleLogout} />} />
              <Route path="/change-password" element={<ChangePasswordPage onBack={() => routerNavigate(-1)} />} />
              <Route path="*" element={<Navigate to="/stats" replace />} />
            </Routes>
          </div>
        </main>
        <Footer onNavigate={navigate} />
        {legalModal === 'terms' && <TermsPage onClose={() => setLegalModal(null)} />}
        {legalModal === 'privacy' && <PrivacyPage onClose={() => setLegalModal(null)} />}
      </div>
    </ToastProvider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  );
}

export default App;
