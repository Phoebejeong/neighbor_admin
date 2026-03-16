import React, { useMemo } from 'react';
import { LocalShop, LocalAd, ShoppingItem, CATEGORIES } from '../data/types';
import { formatMoney, getAdStatus } from '../data/utils';
import {
  TagIcon,
  EyeIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  BuildingStorefrontIcon,
} from '@heroicons/react/24/outline';

interface Props {
  shops: LocalShop[];
  ads: LocalAd[];
  shopping: ShoppingItem[];
}

interface CategoryData {
  category: string;
  shopCount: number;
  adCount: number;
  shoppingCount: number;
  totalViews: number;
  avgViews: number;
  totalRevenue: number;
  activeAds: number;
  avgCpv: number;
}

export const AdminCategoryStatsPage: React.FC<Props> = ({ shops, ads, shopping }) => {
  const categoryData = useMemo((): CategoryData[] => {
    // Map shops by name for lookup
    const shopByName = new Map<string, LocalShop>();
    shops.forEach(s => shopByName.set(s.name, s));

    // Map ads to categories via advertiser → shop name matching
    // For simplicity, map ad advertiser to shop category
    const adsByCategory: Record<string, LocalAd[]> = {};
    const shoppingByCategory: Record<string, ShoppingItem[]> = {};

    ads.forEach(ad => {
      // Try to match advertiser to a shop
      const matchedShop = shops.find(s => s.name === ad.advertiser);
      const cat = matchedShop?.category || '기타';
      if (!adsByCategory[cat]) adsByCategory[cat] = [];
      adsByCategory[cat].push(ad);
    });

    shopping.forEach(item => {
      const matchedShop = shops.find(s => s.name === item.shopName);
      const cat = matchedShop?.category || '기타';
      if (!shoppingByCategory[cat]) shoppingByCategory[cat] = [];
      shoppingByCategory[cat].push(item);
    });

    // Build category stats
    const allCats = new Set([
      ...shops.map(s => s.category),
      ...Object.keys(adsByCategory),
      ...Object.keys(shoppingByCategory),
    ]);

    return Array.from(allCats).map(category => {
      const catShops = shops.filter(s => s.category === category);
      const catAds = adsByCategory[category] || [];
      const catShopping = shoppingByCategory[category] || [];
      const totalViews = catAds.reduce((s, a) => s + (a.viewCount || 0), 0);
      const avgViews = catAds.length > 0 ? Math.round(totalViews / catAds.length) : 0;
      const totalRevenue = catAds.reduce((s, a) => s + a.amount, 0) + catShopping.reduce((s, i) => s + i.amount, 0);
      const activeAds = catAds.filter(a => getAdStatus(a).label === '진행중').length;
      const avgCpv = totalViews > 0 ? Math.round(catAds.reduce((s, a) => s + a.amount, 0) / totalViews) : 0;

      return {
        category,
        shopCount: catShops.length,
        adCount: catAds.length,
        shoppingCount: catShopping.length,
        totalViews,
        avgViews,
        totalRevenue,
        activeAds,
        avgCpv,
      };
    }).sort((a, b) => b.totalViews - a.totalViews);
  }, [shops, ads, shopping]);

  const maxViews = Math.max(...categoryData.map(c => c.totalViews), 1);
  const maxRevenue = Math.max(...categoryData.map(c => c.totalRevenue), 1);

  // Top performing categories
  const topByViews = categoryData.length > 0 ? categoryData[0] : null;
  const topByRevenue = [...categoryData].sort((a, b) => b.totalRevenue - a.totalRevenue)[0] || null;
  const topByShops = [...categoryData].sort((a, b) => b.shopCount - a.shopCount)[0] || null;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-extrabold pl-1">업종별 통계</h2>
        <p className="text-sm text-gray-500 mt-1">업종별 광고 효과 · 상가 분포 분석</p>
      </div>

      {/* Top Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {topByViews && (
          <HighlightCard
            icon={<EyeIcon className="w-5 h-5 text-cyan-500" />}
            label="조회수 1위 업종"
            value={topByViews.category}
            sub={`${formatMoney(topByViews.totalViews)}회 · 평균 ${formatMoney(topByViews.avgViews)}회`}
            bg="bg-cyan-50"
          />
        )}
        {topByRevenue && (
          <HighlightCard
            icon={<CurrencyDollarIcon className="w-5 h-5 text-amber-500" />}
            label="매출 1위 업종"
            value={topByRevenue.category}
            sub={`${formatMoney(topByRevenue.totalRevenue)}원`}
            bg="bg-amber-50"
          />
        )}
        {topByShops && (
          <HighlightCard
            icon={<BuildingStorefrontIcon className="w-5 h-5 text-emerald-500" />}
            label="상가수 1위 업종"
            value={topByShops.category}
            sub={`${topByShops.shopCount}개 상가`}
            bg="bg-emerald-50"
          />
        )}
      </div>

      {/* Category Comparison Chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <h3 className="text-base font-bold text-gray-800 mb-4">업종별 조회수 비교</h3>
        <div className="space-y-3">
          {categoryData.map((cat, i) => {
            const pct = Math.round((cat.totalViews / maxViews) * 100);
            return (
              <div key={cat.category} className="flex items-center gap-4">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  i < 3 ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'
                }`}>{i + 1}</span>
                <span className="w-20 text-sm font-bold text-gray-700 shrink-0">{cat.category}</span>
                <div className="flex-1">
                  <div className="w-full h-7 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-400 to-cyan-600 rounded-full flex items-center justify-end pr-2 transition-all"
                      style={{ width: `${Math.max(pct, 5)}%` }}
                    >
                      {pct > 15 && <span className="text-xs font-bold text-white">{formatMoney(cat.totalViews)}</span>}
                    </div>
                  </div>
                </div>
                {pct <= 15 && <span className="text-sm font-bold text-gray-600 w-16 text-right">{formatMoney(cat.totalViews)}</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Revenue Comparison */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <h3 className="text-base font-bold text-gray-800 mb-4">업종별 매출 비교</h3>
        <div className="space-y-3">
          {[...categoryData].sort((a, b) => b.totalRevenue - a.totalRevenue).map((cat, i) => {
            const pct = Math.round((cat.totalRevenue / maxRevenue) * 100);
            return (
              <div key={cat.category} className="flex items-center gap-4">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  i < 3 ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'
                }`}>{i + 1}</span>
                <span className="w-20 text-sm font-bold text-gray-700 shrink-0">{cat.category}</span>
                <div className="flex-1">
                  <div className="w-full h-7 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full flex items-center justify-end pr-2 transition-all"
                      style={{ width: `${Math.max(pct, 5)}%` }}
                    >
                      {pct > 20 && <span className="text-xs font-bold text-white">{formatMoney(cat.totalRevenue)}원</span>}
                    </div>
                  </div>
                </div>
                {pct <= 20 && <span className="text-sm font-bold text-gray-600 w-20 text-right">{formatMoney(cat.totalRevenue)}원</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Table */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-base font-bold text-gray-800 mb-4">업종별 상세 현황</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-2 text-xs font-bold text-gray-500">업종</th>
                <th className="text-right py-3 px-2 text-xs font-bold text-gray-500">상가수</th>
                <th className="text-right py-3 px-2 text-xs font-bold text-gray-500">광고수</th>
                <th className="text-right py-3 px-2 text-xs font-bold text-gray-500">진행중</th>
                <th className="text-right py-3 px-2 text-xs font-bold text-gray-500">총 조회</th>
                <th className="text-right py-3 px-2 text-xs font-bold text-gray-500">평균 조회</th>
                <th className="text-right py-3 px-2 text-xs font-bold text-gray-500">CPV</th>
                <th className="text-right py-3 px-2 text-xs font-bold text-gray-500">총 매출</th>
              </tr>
            </thead>
            <tbody>
              {categoryData.map(cat => (
                <tr key={cat.category} className="border-b border-gray-50 hover:bg-gray-50 transition">
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2">
                      <TagIcon className="w-4 h-4 text-gray-300" />
                      <span className="font-bold text-gray-800">{cat.category}</span>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-right font-bold">{cat.shopCount}</td>
                  <td className="py-3 px-2 text-right font-bold">{cat.adCount}</td>
                  <td className="py-3 px-2 text-right">
                    <span className={`font-bold ${cat.activeAds > 0 ? 'text-emerald-600' : 'text-gray-400'}`}>
                      {cat.activeAds}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-right font-bold text-cyan-600">{formatMoney(cat.totalViews)}</td>
                  <td className="py-3 px-2 text-right text-gray-600">{formatMoney(cat.avgViews)}</td>
                  <td className="py-3 px-2 text-right text-gray-600">{cat.avgCpv > 0 ? `${formatMoney(cat.avgCpv)}원` : '-'}</td>
                  <td className="py-3 px-2 text-right font-bold text-amber-600">{formatMoney(cat.totalRevenue)}원</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const HighlightCard: React.FC<{ icon: React.ReactNode; label: string; value: string; sub: string; bg: string }> = ({ icon, label, value, sub, bg }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-5">
    <div className="flex items-center gap-2 mb-2">
      <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center`}>{icon}</div>
      <span className="text-xs text-gray-400 font-medium">{label}</span>
    </div>
    <p className="text-xl font-extrabold text-gray-900">{value}</p>
    <p className="text-xs text-gray-400 mt-1">{sub}</p>
  </div>
);
