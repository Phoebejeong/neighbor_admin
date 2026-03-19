import React, { useState, useMemo } from 'react';
import { LocalShop } from '../data/types';
import { apartments } from '../data/mockData';
import { formatMoney, getDistanceKm } from '../data/utils';
import {
  MapPin,
  Store,
  Building2,
  Signal,
} from 'lucide-react';

interface Props {
  shops: LocalShop[];
}

// 성남시 구 단위 영역 정의
const ZONES = [
  { id: 'jungwon', name: '중원구', lat: 37.4400, lng: 127.1400 },
  { id: 'sujeong', name: '수정구', lat: 37.4550, lng: 127.1350 },
  { id: 'bundang', name: '분당구', lat: 37.3800, lng: 127.1150 },
] as const;

export const AdminMapPage: React.FC<Props> = ({ shops }) => {
  const [selectedZone, setSelectedZone] = useState<string | null>(null);

  // Zone stats
  const zoneStats = useMemo(() => {
    return ZONES.map(zone => {
      const zoneShops = shops.filter(s => getDistanceKm(zone.lat, zone.lng, s.lat, s.lng) < 5);
      const zoneApts = apartments.filter(a => getDistanceKm(zone.lat, zone.lng, a.lat, a.lng) < 5);
      const totalHouseholds = zoneApts.reduce((s, a) => s + a.households, 0);
      const totalInstalls = zoneApts.reduce((s, a) => s + (a.appInstalls || 0), 0);
      const totalActive = zoneApts.reduce((s, a) => s + (a.activeUsers || 0), 0);
      const coverageRate = totalHouseholds > 0 ? Math.round((totalInstalls / totalHouseholds) * 100) : 0;

      // Category distribution
      const catCount: Record<string, number> = {};
      zoneShops.forEach(s => { catCount[s.category] = (catCount[s.category] || 0) + 1; });

      return {
        ...zone,
        shops: zoneShops,
        apartments: zoneApts,
        totalHouseholds,
        totalInstalls,
        totalActive,
        coverageRate,
        catCount,
        density: zoneApts.length > 0 ? (zoneShops.length / zoneApts.length).toFixed(1) : '0',
      };
    });
  }, [shops]);

  const selectedZoneData = selectedZone ? zoneStats.find(z => z.id === selectedZone) : null;

  // Apartment-level detail
  const aptDetails = useMemo(() => {
    return apartments.map(apt => {
      const nearbyShops = shops.filter(s => getDistanceKm(apt.lat, apt.lng, s.lat, s.lng) <= 2);
      const catCount: Record<string, number> = {};
      nearbyShops.forEach(s => { catCount[s.category] = (catCount[s.category] || 0) + 1; });
      return {
        ...apt,
        nearbyShops: nearbyShops.length,
        catCount,
        installRate: apt.appInstalls ? Math.round((apt.appInstalls / apt.households) * 100) : 0,
      };
    }).sort((a, b) => b.nearbyShops - a.nearbyShops);
  }, [shops]);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold pl-1">상가 밀집 지도</h2>
        <p className="text-sm text-stone-500 mt-1">지역별 상가 분포 · 아파트 커버리지 현황</p>
      </div>

      {/* Zone Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {zoneStats.map(zone => (
          <button
            key={zone.id}
            onClick={() => setSelectedZone(selectedZone === zone.id ? null : zone.id)}
            className={`bg-white rounded-lg shadow-sm p-5 text-left transition ${
              selectedZone === zone.id ? 'ring-2 ring-amber-400 shadow-md' : 'hover:shadow-md'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-stone-900">{zone.name}</h3>
              <div className={`w-3 h-3 rounded-full ${
                zone.shops.length >= 5 ? 'bg-[#7f2929]' : zone.shops.length >= 2 ? 'bg-amber-400' : 'bg-red-400'
              }`} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-stone-400">등록 상가</p>
                <p className="text-xl font-bold text-[#7f2929]">{zone.shops.length}개</p>
              </div>
              <div>
                <p className="text-xs text-stone-400">아파트 단지</p>
                <p className="text-xl font-bold text-stone-800">{zone.apartments.length}개</p>
              </div>
              <div>
                <p className="text-xs text-stone-400">총 세대수</p>
                <p className="text-sm font-bold text-stone-700">{formatMoney(zone.totalHouseholds)}</p>
              </div>
              <div>
                <p className="text-xs text-stone-400">앱 설치율</p>
                <p className="text-sm font-bold text-[#B85C38]">{zone.coverageRate}%</p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5">
              <Signal className="w-3.5 h-3.5 text-stone-400" />
              <span className="text-xs text-stone-500">상가/단지 비율: <strong>{zone.density}</strong></span>
            </div>
          </button>
        ))}
      </div>

      {/* Selected Zone Detail */}
      {selectedZoneData && (
        <div className="bg-white rounded-lg shadow-sm p-5 mb-6">
          <h3 className="text-base font-bold text-stone-800 mb-4">{selectedZoneData.name} 상세</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Distribution */}
            <div>
              <h4 className="text-sm font-bold text-stone-600 mb-3">업종 분포</h4>
              {Object.keys(selectedZoneData.catCount).length === 0 ? (
                <p className="text-sm text-stone-400">등록된 상가가 없습니다</p>
              ) : (
                <div className="space-y-2">
                  {Object.entries(selectedZoneData.catCount)
                    .sort(([, a], [, b]) => b - a)
                    .map(([cat, count]) => (
                      <div key={cat} className="flex items-center gap-3">
                        <span className="text-sm text-stone-700 w-16 font-medium">{cat}</span>
                        <div className="flex-1 h-6 bg-stone-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#7f2929] rounded-full flex items-center justify-end pr-2"
                            style={{ width: `${Math.max(20, (count / selectedZoneData.shops.length) * 100)}%` }}
                          >
                            <span className="text-xs font-bold text-white">{count}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  }
                </div>
              )}
            </div>

            {/* Shops List */}
            <div>
              <h4 className="text-sm font-bold text-stone-600 mb-3">등록 상가 목록</h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {selectedZoneData.shops.map(shop => (
                  <div key={shop.id} className="flex items-center gap-3 p-2 rounded-lg border border-stone-100">
                    <Store className="w-4 h-4 text-stone-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-bold text-stone-800">{shop.name}</span>
                      <span className="text-xs text-stone-400 ml-2">{shop.category}</span>
                    </div>
                    <span className="text-xs text-stone-400 shrink-0">{shop.targetApartments.length}개 단지</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Apartment Coverage Table */}
      <div className="bg-white rounded-lg shadow-sm p-5">
        <h3 className="text-base font-bold text-stone-800 mb-4">단지별 상가 밀집도</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-200">
                <th className="text-left py-3 px-2 text-xs font-bold text-stone-500">아파트</th>
                <th className="text-right py-3 px-2 text-xs font-bold text-stone-500">세대수</th>
                <th className="text-right py-3 px-2 text-xs font-bold text-stone-500">설치율</th>
                <th className="text-right py-3 px-2 text-xs font-bold text-stone-500">활성유저</th>
                <th className="text-right py-3 px-2 text-xs font-bold text-stone-500">주변상가</th>
                <th className="text-left py-3 px-2 text-xs font-bold text-stone-500">업종 현황</th>
              </tr>
            </thead>
            <tbody>
              {aptDetails.map(apt => (
                <tr key={apt.id} className="border-b border-stone-50 hover:bg-stone-50 transition">
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-stone-300 shrink-0" />
                      <div>
                        <p className="font-bold text-stone-800">{apt.name}</p>
                        <p className="text-xs text-stone-400">{apt.address}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-right font-bold">{formatMoney(apt.households)}</td>
                  <td className="py-3 px-2 text-right">
                    <span className={`font-bold ${apt.installRate >= 60 ? 'text-[#7f2929]' : apt.installRate >= 40 ? 'text-amber-600' : 'text-red-500'}`}>
                      {apt.installRate}%
                    </span>
                  </td>
                  <td className="py-3 px-2 text-right font-bold text-[#7f2929]">{formatMoney(apt.activeUsers || 0)}</td>
                  <td className="py-3 px-2 text-right">
                    <span className={`text-lg font-bold ${apt.nearbyShops >= 4 ? 'text-[#7f2929]' : apt.nearbyShops >= 2 ? 'text-amber-600' : 'text-red-500'}`}>
                      {apt.nearbyShops}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(apt.catCount).map(([cat, cnt]) => (
                        <span key={cat} className="text-xs bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded font-medium">
                          {cat} {cnt}
                        </span>
                      ))}
                      {Object.keys(apt.catCount).length === 0 && (
                        <span className="text-xs text-stone-300">없음</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
