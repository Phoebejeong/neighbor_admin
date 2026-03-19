import React, { useState, useMemo } from 'react';
import { LocalShop, LocalAd, ShoppingItem } from '../data/types';
import { apartments } from '../data/mockData';
import { getAdStatus, formatMoney } from '../data/utils';
import {
  FileText,
  Eye,
  DollarSign,
  TrendingUp,
  PhoneIncoming,
  Store,
} from 'lucide-react';

interface Props {
  shops: LocalShop[];
  ads: LocalAd[];
  shopping: ShoppingItem[];
}

export const AdminReportPage: React.FC<Props> = ({ shops, ads, shopping }) => {
  const [selectedShop, setSelectedShop] = useState<string>('all');

  // Get shops that have at least one ad or shopping item
  const activeShops = useMemo(() => {
    const shopNames = new Set([
      ...ads.map(a => a.advertiser),
      ...shopping.map(s => s.shopName),
    ]);
    return Array.from(shopNames);
  }, [ads, shopping]);

  const filteredAds = useMemo(() =>
    selectedShop === 'all' ? ads : ads.filter(a => a.advertiser === selectedShop),
    [ads, selectedShop]
  );
  const filteredShopping = useMemo(() =>
    selectedShop === 'all' ? shopping : shopping.filter(s => s.shopName === selectedShop),
    [shopping, selectedShop]
  );

  const totalViews = filteredAds.reduce((s, a) => s + (a.viewCount || 0), 0);
  const avgViews = filteredAds.length > 0 ? Math.round(totalViews / filteredAds.length) : 0;
  const activeAds = filteredAds.filter(a => getAdStatus(a).label === '진행중').length;
  const totalAdSpend = filteredAds.reduce((s, a) => s + a.amount, 0);
  const totalShoppingSpend = filteredShopping.reduce((s, i) => s + i.amount, 0);

  // Target apartment coverage
  const targetAptIds = new Set([
    ...filteredAds.flatMap(a => a.targetApartments || []),
    ...filteredShopping.flatMap(s => s.targetApartments || []),
  ]);
  const targetApts = apartments.filter(a => targetAptIds.has(a.id));
  const totalHouseholds = targetApts.reduce((s, a) => s + a.households, 0);
  const totalActiveUsers = targetApts.reduce((s, a) => s + (a.activeUsers || 0), 0);

  // Cost per view (CPV)
  const cpv = totalViews > 0 ? Math.round(totalAdSpend / totalViews) : 0;

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold pl-1">성과 리포트</h2>
          <p className="text-sm text-stone-500 mt-1">사장님에게 공유할 월간 성과 요약</p>
        </div>
      </div>

      {/* Shop Selector */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex items-center gap-3">
          <Store className="w-5 h-5 text-stone-400" />
          <span className="text-sm font-bold text-stone-700">상가 선택</span>
          <select
            value={selectedShop}
            onChange={e => setSelectedShop(e.target.value)}
            className="flex-1 max-w-xs border border-stone-200 rounded-lg px-3 py-2.5 text-sm font-semibold text-stone-800 focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
          >
            <option value="all">전체 상가</option>
            {activeShops.map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard icon={<Eye className="w-6 h-6 text-[#B85C38]" />} label="총 조회수" value={`${formatMoney(totalViews)}회`} sub={`평균 ${formatMoney(avgViews)}회/건`} />
        <KpiCard icon={<TrendingUp className="w-6 h-6 text-emerald-500" />} label="도달 가능 세대" value={`${formatMoney(totalHouseholds)}세대`} sub={`활성 ${formatMoney(totalActiveUsers)}명`} />
        <KpiCard icon={<DollarSign className="w-6 h-6 text-amber-500" />} label="총 광고비" value={`${formatMoney(totalAdSpend + totalShoppingSpend)}원`} sub={`CPV ${formatMoney(cpv)}원`} />
        <KpiCard icon={<FileText className="w-6 h-6 text-[#E8C4A0]" />} label="진행중 광고" value={`${activeAds}건`} sub={`총 ${filteredAds.length}건 등록`} />
      </div>

      {/* Report Card - Ad Performance */}
      <div className="bg-white rounded-lg shadow-sm p-5 mb-6">
        <h3 className="text-base font-bold text-stone-800 mb-4">광고별 성과 상세</h3>
        {filteredAds.length === 0 ? (
          <p className="text-sm text-stone-400 text-center py-6">등록된 광고가 없습니다</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-200">
                  <th className="text-left py-3 px-2 text-xs font-bold text-stone-500">광고명</th>
                  <th className="text-center py-3 px-2 text-xs font-bold text-stone-500">상태</th>
                  <th className="text-right py-3 px-2 text-xs font-bold text-stone-500">조회수</th>
                  <th className="text-right py-3 px-2 text-xs font-bold text-stone-500">광고비</th>
                  <th className="text-right py-3 px-2 text-xs font-bold text-stone-500">CPV</th>
                  <th className="text-right py-3 px-2 text-xs font-bold text-stone-500">대상 단지</th>
                  <th className="text-right py-3 px-2 text-xs font-bold text-stone-500">도달 세대</th>
                </tr>
              </thead>
              <tbody>
                {filteredAds.map(ad => {
                  const st = getAdStatus(ad);
                  const adApts = apartments.filter(a => (ad.targetApartments || []).includes(a.id));
                  const adHouseholds = adApts.reduce((s, a) => s + a.households, 0);
                  const adCpv = (ad.viewCount || 0) > 0 ? Math.round(ad.amount / ad.viewCount) : 0;
                  return (
                    <tr key={ad.id} className="border-b border-stone-50 hover:bg-stone-50 transition">
                      <td className="py-3 px-2">
                        <p className="font-bold text-stone-800">{ad.title}</p>
                        <p className="text-xs text-stone-400">{ad.period}</p>
                      </td>
                      <td className="py-3 px-2 text-center">
                        <span className={`text-xs font-bold ${st.cls}`}>{st.label}</span>
                      </td>
                      <td className="py-3 px-2 text-right font-bold">{formatMoney(ad.viewCount)}회</td>
                      <td className="py-3 px-2 text-right font-bold">{formatMoney(ad.amount)}원</td>
                      <td className="py-3 px-2 text-right text-stone-600">{formatMoney(adCpv)}원</td>
                      <td className="py-3 px-2 text-right text-stone-600">{adApts.length}개</td>
                      <td className="py-3 px-2 text-right font-bold text-emerald-500">{formatMoney(adHouseholds)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Target Apartment Coverage */}
      <div className="bg-white rounded-lg shadow-sm p-5 mb-6">
        <h3 className="text-base font-bold text-stone-800 mb-4">대상 아파트 커버리지</h3>
        {targetApts.length === 0 ? (
          <p className="text-sm text-stone-400 text-center py-6">대상 아파트가 없습니다</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {targetApts.map(apt => {
              const installRate = apt.appInstalls ? Math.round((apt.appInstalls / apt.households) * 100) : 0;
              return (
                <div key={apt.id} className="border border-stone-100 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-stone-800">{apt.name}</span>
                    <span className="text-xs text-stone-400">{formatMoney(apt.households)}세대</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-xs text-stone-400">설치수</p>
                      <p className="text-sm font-bold text-[#7f2929]">{formatMoney(apt.appInstalls || 0)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-stone-400">활성유저</p>
                      <p className="text-sm font-bold text-emerald-500">{formatMoney(apt.activeUsers || 0)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-stone-400">설치율</p>
                      <p className="text-sm font-bold text-[#B85C38]">{installRate}%</p>
                    </div>
                  </div>
                  <div className="mt-2 w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#B85C38] rounded-full" style={{ width: `${installRate}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Shopping Performance */}
      <div className="bg-white rounded-lg shadow-sm p-5">
        <h3 className="text-base font-bold text-stone-800 mb-4">실속쇼핑 성과</h3>
        {filteredShopping.length === 0 ? (
          <p className="text-sm text-stone-400 text-center py-6">등록된 상품이 없습니다</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-200">
                  <th className="text-left py-3 px-2 text-xs font-bold text-stone-500">상품명</th>
                  <th className="text-right py-3 px-2 text-xs font-bold text-stone-500">정가</th>
                  <th className="text-right py-3 px-2 text-xs font-bold text-stone-500">할인율</th>
                  <th className="text-right py-3 px-2 text-xs font-bold text-stone-500">광고비</th>
                  <th className="text-right py-3 px-2 text-xs font-bold text-stone-500">대상 단지</th>
                </tr>
              </thead>
              <tbody>
                {filteredShopping.map(item => {
                  const itemApts = apartments.filter(a => (item.targetApartments || []).includes(a.id));
                  return (
                    <tr key={item.id} className="border-b border-stone-50 hover:bg-stone-50 transition">
                      <td className="py-3 px-2">
                        <p className="font-bold text-stone-800">{item.name}</p>
                        <p className="text-xs text-stone-400">{item.shopName}</p>
                      </td>
                      <td className="py-3 px-2 text-right font-bold">{formatMoney(item.price)}원</td>
                      <td className="py-3 px-2 text-right">
                        {item.discountRate > 0 ? (
                          <span className="text-red-500 font-bold">{item.discountRate}%</span>
                        ) : (
                          <span className="text-stone-400">-</span>
                        )}
                      </td>
                      <td className="py-3 px-2 text-right font-bold">{formatMoney(item.amount)}원</td>
                      <td className="py-3 px-2 text-right text-stone-600">{itemApts.length}개</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const KpiCard: React.FC<{ icon: React.ReactNode; label: string; value: string; sub: string }> = ({ icon, label, value, sub }) => (
  <div className="bg-white rounded-lg shadow-sm p-5">
    <div className="flex items-center gap-3 mb-3">
      {icon}
      <span className="text-xs text-stone-400 font-medium">{label}</span>
    </div>
    <p className="text-xl font-bold text-stone-900">{value}</p>
    <p className="text-xs text-stone-400 mt-1">{sub}</p>
  </div>
);
