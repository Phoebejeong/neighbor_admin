import React, { useState } from 'react';
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

function App() {
  const [user, setUser] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [page, setPage] = useState('stats');
  const [prevPage, setPrevPage] = useState('stats');
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

  const navigate = (p: string) => {
    if (p === 'terms' || p === 'privacy') {
      setLegalModal(p);
      return;
    }
    if (p === 'change-password' || p === 'my-account') setPrevPage(page);
    setPage(p);
  };

  if (!user) {
    return (
      <ToastProvider>
        <LoginPage onLogin={(name, isNew, email) => {
          setUser(name);
          setUserEmail(email);
          if (email === 'admin@gmail.com') {
            setPage('admin-stats');
          } else {
            setPage('stats');
            if (isNew) setIsFirstLogin(true);
          }
        }} />
      </ToastProvider>
    );
  }

  const handleLogout = () => {
    setUser(null);
    setUserEmail('');
    setPage('stats');
  };

  // Admin mode
  if (isAdmin) {
    return (
      <ToastProvider>
        <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
          <TopNav
            current={page}
            shopName="관리자"
            userEmail={userEmail}
            onNavigate={navigate}
            onLogout={handleLogout}
            isAdmin
          />
          <main className="w-full flex-1">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
              {page === 'admin-stats' && <AdminStatsPage shops={allShops} ads={allAds} shopping={allShopping} />}
              {page === 'admin-shops' && <ShopsPage shops={allShops} setShops={setAllShops} readOnly />}
              {page === 'admin-ads' && <AdsPage ads={allAds} setAds={setAllAds} readOnly />}
              {page === 'admin-shopping' && <ShoppingPage items={allShopping} setItems={setAllShopping} readOnly />}
              {page === 'admin-sales' && <AdminSalesPage leads={allLeads} setLeads={setAllLeads} shops={allShops} />}
              {page === 'admin-report' && <AdminReportPage shops={allShops} ads={allAds} shopping={allShopping} />}
              {page === 'my-account' && <MyAccountPage name={user} email={userEmail} phone={userPhone} onSave={({ name, phone }) => { setUser(name); setUserPhone(phone); }} onBack={() => setPage(prevPage)} onNavigate={navigate} onWithdraw={handleLogout} />}
              {page === 'change-password' && <ChangePasswordPage onBack={() => setPage(prevPage)} isAdmin />}
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
          current={page}
          shopName={myShops[0]?.name || user}
          userEmail={userEmail}
          onNavigate={navigate}
          onLogout={handleLogout}
        />
        <main className="w-full flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
            {page === 'myshop' && <MyShopPage shops={myShops} setShops={setMyShops} />}
            {page === 'myads' && <MyAdsPage ads={myAds} setAds={setMyAds} shopName={myShops[0]?.name || user} shops={myShops} onNavigate={navigate} />}
            {page === 'myshopping' && <MyShoppingPage items={myShopping} setItems={setMyShopping} shopName={myShops[0]?.name || user} shops={myShops} onNavigate={navigate} />}
            {page === 'stats' && <StatsPage ads={myAds} shopping={myShopping} onNavigate={navigate} />}
            {page === 'pricing' && <PricingPage onNavigate={navigate} />}
            {page === 'faq' && <FaqPage />}
            {page === 'my-account' && <MyAccountPage name={user} email={userEmail} phone={userPhone} onSave={({ name, phone }) => { setUser(name); setUserPhone(phone); }} onBack={() => setPage(prevPage)} onNavigate={navigate} onWithdraw={handleLogout} />}
            {page === 'change-password' && <ChangePasswordPage onBack={() => setPage(prevPage)} />}
          </div>
        </main>
        <Footer onNavigate={navigate} />
        {legalModal === 'terms' && <TermsPage onClose={() => setLegalModal(null)} />}
        {legalModal === 'privacy' && <PrivacyPage onClose={() => setLegalModal(null)} />}
      </div>
    </ToastProvider>
  );
}

export default App;
