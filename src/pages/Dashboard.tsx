import React from 'react';
import { LocalShop, LocalAd, ShoppingItem } from '../data/types';
import { getAdStatus, formatMoney } from '../data/utils';

interface Props {
  shops: LocalShop[];
  ads: LocalAd[];
  shopping: ShoppingItem[];
}

export const Dashboard: React.FC<Props> = ({ shops, ads, shopping }) => {
  const activeAds = ads.filter(a => getAdStatus(a).label === '진행중').length;
  const totalViews = ads.reduce((s, a) => s + (a.viewCount || 0), 0);
  const adRevenue = ads.filter(a => a.paymentStatus === 'paid').reduce((s, a) => s + a.amount, 0);
  const shopRevenue = shopping.filter(i => i.paymentStatus === 'paid').reduce((s, i) => s + i.amount, 0);
  const totalRevenue = adRevenue + shopRevenue;
  const topAds = [...ads].sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0)).slice(0, 5);
  const unpaid = [
    ...ads.filter(a => a.paymentStatus === 'unpaid').map(a => ({ type: '광고', name: a.title, amount: a.amount })),
    ...shopping.filter(i => i.paymentStatus === 'unpaid').map(i => ({ type: '쇼핑', name: i.name, amount: i.amount })),
  ];
  const expiring = ads.filter(a => {
    if (!a.endDate) return false;
    const d = (new Date(a.endDate).getTime() - Date.now()) / 86400000;
    return d > 0 && d <= 7;
  });

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-extrabold pl-1">대시보드</h2>
        <p className="text-sm text-gray-500 mt-1">우리동네 서비스 현황을 한눈에 확인하세요</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card label="이웃상가" value={shops.length} unit="개" sub={`홈 노출 ${shops.filter(s => s.isHomeVisible).length}개`} color="blue" />
        <Card label="알짜광고" value={ads.length} unit="개" sub={<>진행중 <span className="text-emerald-500 font-semibold">{activeAds}개</span> · 총 조회 {formatMoney(totalViews)}회</>} color="amber" />
        <Card label="실속쇼핑" value={shopping.length} unit="개" sub={`등록 상품 ${shopping.length}개`} color="purple" />
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-5 text-white hover:shadow-md transition">
          <p className="text-xs font-medium text-blue-200 uppercase tracking-wider">이번 달 수익</p>
          <p className="text-3xl font-extrabold mt-1">{formatMoney(totalRevenue)}<span className="text-base font-medium text-blue-200 ml-1">원</span></p>
          <p className="text-xs text-blue-200 mt-2">광고 {formatMoney(adRevenue)}원 + 쇼핑 {formatMoney(shopRevenue)}원</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Ads */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-bold text-gray-700 mb-3">조회수 TOP 5 광고</h3>
          <div className="space-y-2.5">
            {topAds.map((ad, i) => {
              const st = getAdStatus(ad);
              return (
                <div key={ad.id} className={`flex items-center gap-3 py-2 ${i < topAds.length - 1 ? 'border-b border-gray-100' : ''}`}>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-400'}`}>{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{ad.title}</p>
                    <p className="text-xs text-gray-400">{ad.advertiser}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${st.cls}`}>{st.label}</span>
                  <span className="text-sm font-bold text-gray-600">{formatMoney(ad.viewCount)}회</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Expiring + Unpaid */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-bold text-gray-700 mb-3">7일 내 만료 예정</h3>
          {expiring.length === 0 ? (
            <p className="text-sm text-gray-400 py-4 text-center">만료 임박한 광고가 없습니다</p>
          ) : (
            <div className="space-y-2.5">
              {expiring.map(ad => {
                const days = Math.ceil((new Date(ad.endDate).getTime() - Date.now()) / 86400000);
                return (
                  <div key={ad.id} className="flex items-center gap-3 py-2 border-b border-gray-100">
                    <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                      <span className="text-red-500 text-xs font-bold">D-{days}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{ad.title}</p>
                      <p className="text-xs text-gray-400">{ad.period}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <div className="mt-4 pt-3 border-t border-gray-100">
            <h4 className="text-xs font-bold text-gray-500 mb-2">미결제 항목</h4>
            {unpaid.length === 0 ? (
              <p className="text-xs text-gray-400">미결제 항목 없음</p>
            ) : unpaid.map((item, i) => (
              <div key={i} className="flex items-center justify-between py-1.5 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-xs px-1.5 py-0.5 rounded bg-orange-100 text-orange-600 font-medium">{item.type}</span>
                  <span className="text-gray-700">{item.name}</span>
                </div>
                <span className="font-semibold text-red-500">{formatMoney(item.amount)}원</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const COLORS: Record<string, { bg: string; icon: string }> = {
  blue: { bg: 'bg-blue-50', icon: 'text-blue-500' },
  amber: { bg: 'bg-amber-50', icon: 'text-amber-500' },
  purple: { bg: 'bg-purple-50', icon: 'text-purple-500' },
};

const Card: React.FC<{ label: string; value: number; unit: string; sub: React.ReactNode; color: string }> = ({ label, value, unit, sub, color }) => {
  const c = COLORS[color] || COLORS.blue;
  return (
    <div className="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-md transition">
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{label}</p>
      <p className="text-3xl font-extrabold mt-1">{value}<span className="text-base font-medium text-gray-400 ml-1">{unit}</span></p>
      <p className="text-xs text-gray-400 mt-2">{sub}</p>
    </div>
  );
};
