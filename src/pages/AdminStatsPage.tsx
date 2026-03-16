import React, { useState, useMemo } from 'react';
import { LocalShop, LocalAd, ShoppingItem, CATEGORIES } from '../data/types';
import { apartments } from '../data/mockData';
import { getAdStatus, formatMoney, getDistanceKm } from '../data/utils';
import {
  BuildingStorefrontIcon, MegaphoneIcon, ShoppingBagIcon, EyeIcon,
  CurrencyDollarIcon, CheckCircleIcon, BuildingOffice2Icon, TagIcon, MapPinIcon,
} from '@heroicons/react/24/outline';

interface Props {
  shops: LocalShop[];
  ads: LocalAd[];
  shopping: ShoppingItem[];
}

const ZONES = [
  { id: 'all', name: '전체 지역' },
  { id: 'jungwon', name: '중원구', lat: 37.4400, lng: 127.1400 },
  { id: 'sujeong', name: '수정구', lat: 37.4550, lng: 127.1350 },
  { id: 'bundang', name: '분당구', lat: 37.3800, lng: 127.1150 },
] as const;

export const AdminStatsPage: React.FC<Props> = ({ shops, ads, shopping }) => {
  const [selectedApt, setSelectedApt] = useState<string>('all');
  const [selectedZone, setSelectedZone] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // 지역 필터 → 해당 지역 아파트 ID 목록
  const zoneAptIds = useMemo(() => {
    if (selectedZone === 'all') return null;
    const zone = ZONES.find(z => z.id === selectedZone);
    if (!zone || !('lat' in zone)) return null;
    return apartments
      .filter(a => getDistanceKm(zone.lat, zone.lng, a.lat, a.lng) < 5)
      .map(a => a.id);
  }, [selectedZone]);

  // 업종 필터 → 해당 업종 상가명 목록
  const categoryShopNames = useMemo(() => {
    if (selectedCategory === 'all') return null;
    return shops.filter(s => s.category === selectedCategory).map(s => s.name);
  }, [selectedCategory, shops]);

  // 필터 적용 (아파트 + 지역 + 업종)
  const filteredShops = useMemo(() => {
    let result = shops;
    if (selectedCategory !== 'all') result = result.filter(s => s.category === selectedCategory);
    if (zoneAptIds) result = result.filter(s => s.targetApartments.some(a => zoneAptIds.includes(a)));
    if (selectedApt !== 'all') result = result.filter(s => s.targetApartments.includes(selectedApt));
    return result;
  }, [shops, selectedCategory, zoneAptIds, selectedApt]);

  const filteredAds = useMemo(() => {
    let result = ads;
    if (selectedApt !== 'all') result = result.filter(a => (a.targetApartments || []).includes(selectedApt));
    if (zoneAptIds) result = result.filter(a => (a.targetApartments || []).some(id => zoneAptIds.includes(id)));
    if (categoryShopNames) result = result.filter(a => categoryShopNames.includes(a.advertiser));
    return result;
  }, [ads, selectedApt, zoneAptIds, categoryShopNames]);

  const filteredShopping = useMemo(() => {
    let result = shopping;
    if (selectedApt !== 'all') result = result.filter(i => (i.targetApartments || []).includes(selectedApt));
    if (zoneAptIds) result = result.filter(i => (i.targetApartments || []).some(id => zoneAptIds.includes(id)));
    if (categoryShopNames) result = result.filter(i => categoryShopNames.includes(i.shopName));
    return result;
  }, [shopping, selectedApt, zoneAptIds, categoryShopNames]);

  const totalViews = filteredAds.reduce((s, a) => s + (a.viewCount || 0), 0);
  const activeAds = filteredAds.filter(a => getAdStatus(a).label === '진행중').length;
  const paidAds = filteredAds.filter(a => a.paymentStatus === 'paid').length;
  const totalAdRevenue = filteredAds.filter(a => a.paymentStatus === 'paid').reduce((s, a) => s + a.amount, 0);
  const paidItems = filteredShopping.filter(i => i.paymentStatus === 'paid').length;
  const totalShoppingRevenue = filteredShopping.filter(i => i.paymentStatus === 'paid').reduce((s, i) => s + i.amount, 0);

  const hasFilter = selectedApt !== 'all' || selectedZone !== 'all' || selectedCategory !== 'all';
  const resetFilters = () => { setSelectedApt('all'); setSelectedZone('all'); setSelectedCategory('all'); };

  // 업종별 상가 수 (for category breakdown)
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredShops.forEach(s => { counts[s.category] = (counts[s.category] || 0) + 1; });
    return Object.entries(counts).sort(([, a], [, b]) => b - a);
  }, [filteredShops]);

  // 지역별 상가 수
  const zoneCounts = useMemo(() => {
    return ZONES.filter(z => z.id !== 'all').map(zone => {
      if (!('lat' in zone)) return { name: zone.name, count: 0 };
      const count = shops.filter(s => getDistanceKm(zone.lat, zone.lng, s.lat, s.lng) < 5).length;
      return { name: zone.name, count };
    });
  }, [shops]);

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-xl font-extrabold pl-1">전체 통계</h2>
          <p className="text-sm text-gray-500 mt-1">
            {hasFilter ? '필터 조건에 맞는 통계입니다' : '우리동네 서비스 전체 현황을 확인하세요'}
          </p>
        </div>
      </div>

      {/* 필터 영역 */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <MapPinIcon className="w-5 h-5 text-gray-400 shrink-0" />
          <select
            value={selectedZone}
            onChange={e => setSelectedZone(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm font-semibold text-gray-800 focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
          >
            {ZONES.map(z => (
              <option key={z.id} value={z.id}>{z.name}</option>
            ))}
          </select>

          <BuildingOffice2Icon className="w-5 h-5 text-gray-400 shrink-0 ml-2" />
          <select
            value={selectedApt}
            onChange={e => setSelectedApt(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm font-semibold text-gray-800 focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
          >
            <option value="all">전체 아파트</option>
            {apartments.map(apt => (
              <option key={apt.id} value={apt.id}>{apt.name} ({apt.households}세대)</option>
            ))}
          </select>

          <TagIcon className="w-5 h-5 text-gray-400 shrink-0 ml-2" />
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm font-semibold text-gray-800 focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
          >
            <option value="all">전체 업종</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {hasFilter && (
            <button onClick={resetFilters} className="text-xs text-gray-400 hover:text-gray-600 font-medium transition ml-auto">
              필터 초기화
            </button>
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard icon={<BuildingStorefrontIcon className="w-6 h-6 text-emerald-500" />} label="등록 이웃상가" value={`${filteredShops.length}개`} bg="bg-emerald-50" />
        <StatCard icon={<MegaphoneIcon className="w-6 h-6 text-blue-500" />} label="알짜광고" value={`${filteredAds.length}개 (진행중 ${activeAds})`} bg="bg-blue-50" />
        <StatCard icon={<ShoppingBagIcon className="w-6 h-6 text-purple-500" />} label="실속쇼핑" value={`${filteredShopping.length}개`} bg="bg-purple-50" />
        <StatCard icon={<EyeIcon className="w-6 h-6 text-cyan-500" />} label="총 광고 조회수" value={`${formatMoney(totalViews)}회`} bg="bg-cyan-50" />
        <StatCard icon={<CurrencyDollarIcon className="w-6 h-6 text-amber-500" />} label="광고 매출" value={`${formatMoney(totalAdRevenue)}원`} bg="bg-amber-50" />
        <StatCard icon={<CheckCircleIcon className="w-6 h-6 text-pink-500" />} label="쇼핑 매출" value={`${formatMoney(totalShoppingRevenue)}원`} bg="bg-pink-50" />
      </div>

      {/* 지역별 · 업종별 요약 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* 지역별 상가 분포 */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-base font-bold text-gray-800 mb-4">지역별 상가 분포</h3>
          <div className="space-y-3">
            {zoneCounts.map(z => {
              const maxCount = Math.max(...zoneCounts.map(zz => zz.count), 1);
              const pct = Math.round((z.count / maxCount) * 100);
              return (
                <div key={z.name} className="flex items-center gap-3">
                  <span className="w-14 text-sm font-bold text-gray-700 shrink-0">{z.name}</span>
                  <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-end pr-2"
                      style={{ width: `${Math.max(pct, 10)}%` }}
                    >
                      {pct > 20 && <span className="text-xs font-bold text-white">{z.count}</span>}
                    </div>
                  </div>
                  {pct <= 20 && <span className="text-sm font-bold text-gray-600 w-8 text-right">{z.count}</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* 업종별 상가 분포 */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-base font-bold text-gray-800 mb-4">업종별 상가 분포</h3>
          {categoryCounts.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">등록된 상가가 없습니다</p>
          ) : (
            <div className="space-y-3">
              {categoryCounts.map(([cat, count]) => {
                const maxCount = Math.max(...categoryCounts.map(([, c]) => c), 1);
                const pct = Math.round((count / maxCount) * 100);
                return (
                  <div key={cat} className="flex items-center gap-3">
                    <span className="w-14 text-sm font-bold text-gray-700 shrink-0">{cat}</span>
                    <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full flex items-center justify-end pr-2"
                        style={{ width: `${Math.max(pct, 10)}%` }}
                      >
                        {pct > 20 && <span className="text-xs font-bold text-white">{count}</span>}
                      </div>
                    </div>
                    {pct <= 20 && <span className="text-sm font-bold text-gray-600 w-8 text-right">{count}</span>}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 결제 현황 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-base font-bold text-gray-800 mb-4">알짜광고 결제 현황</h3>
          {filteredAds.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">해당 조건의 광고가 없습니다</p>
          ) : (
            <>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(paidAds / filteredAds.length) * 100}%` }} />
                </div>
                <span className="text-base font-bold text-gray-800">{paidAds}/{filteredAds.length}</span>
              </div>
              <div className="space-y-2">
                {filteredAds.map(ad => {
                  const st = getAdStatus(ad);
                  return (
                    <div key={ad.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${st.cls}`}>{st.label}</span>
                        <span className="text-sm font-medium truncate max-w-[180px]">{ad.title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">{formatMoney(ad.amount)}원</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ad.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-500'}`}>
                          {ad.paymentStatus === 'paid' ? '결제완료' : '미결제'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-base font-bold text-gray-800 mb-4">실속쇼핑 결제 현황</h3>
          {filteredShopping.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">해당 조건의 상품이 없습니다</p>
          ) : (
            <>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: `${(paidItems / filteredShopping.length) * 100}%` }} />
                </div>
                <span className="text-base font-bold text-gray-800">{paidItems}/{filteredShopping.length}</span>
              </div>
              <div className="space-y-2">
                {filteredShopping.map(item => (
                  <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <div>
                      <span className="text-sm font-medium">{item.name}</span>
                      <span className="text-xs text-gray-400 ml-2">{item.shopName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">{formatMoney(item.amount)}원</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${item.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-500'}`}>
                        {item.paymentStatus === 'paid' ? '결제완료' : '미결제'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* 광고 조회수 순위 */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-base font-bold text-gray-800 mb-4">광고 조회수 순위</h3>
        {filteredAds.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">해당 조건의 광고가 없습니다</p>
        ) : (
          <div className="space-y-3">
            {[...filteredAds].sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0)).map((ad, i) => {
              const maxViews = Math.max(...filteredAds.map(a => a.viewCount || 1));
              const pct = Math.round(((ad.viewCount || 0) / maxViews) * 100);
              return (
                <div key={ad.id} className="flex items-center gap-4">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i < 3 ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'}`}>{i + 1}</span>
                  <div className="w-44 shrink-0">
                    <p className="text-sm font-semibold truncate">{ad.title}</p>
                    <p className="text-xs text-gray-400">{ad.advertiser}</p>
                  </div>
                  <div className="flex-1">
                    <div className="w-full h-5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                  <span className="text-base font-bold text-gray-800 w-16 text-right">{formatMoney(ad.viewCount)}회</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string; bg: string }> = ({ icon, label, value, bg }) => (
  <div className="bg-white rounded-xl p-5 border border-gray-200">
    <div className="flex items-center gap-3">
      <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center`}>{icon}</div>
      <div>
        <p className="text-xs text-gray-400 font-medium">{label}</p>
        <p className="text-xl font-extrabold mt-0.5">{value}</p>
      </div>
    </div>
  </div>
);
