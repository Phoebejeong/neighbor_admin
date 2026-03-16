import React, { useState, useMemo } from 'react';
import { MapPinIcon, BuildingOffice2Icon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Apartment } from '../data/types';
import { apartments } from '../data/mockData';
import { getNearbyApartments } from '../data/utils';

interface Props {
  shopLat: number;
  shopLng: number;
  selected: string[];
  onChange: (ids: string[]) => void;
  radiusKm?: number;
}

export const ApartmentSelector: React.FC<Props> = ({ shopLat, shopLng, selected, onChange, radiusKm = 5 }) => {
  const [search, setSearch] = useState('');
  const [radius, setRadius] = useState(radiusKm);

  const nearby = useMemo(
    () => getNearbyApartments(shopLat, shopLng, apartments, radius),
    [shopLat, shopLng, radius]
  );

  const filtered = useMemo(
    () => nearby.filter(a => a.name.includes(search) || a.address.includes(search)),
    [nearby, search]
  );

  const toggle = (id: string) => {
    onChange(selected.includes(id) ? selected.filter(i => i !== id) : [...selected, id]);
  };

  const selectAll = () => {
    const allIds = filtered.map(a => a.id);
    const allSelected = allIds.every(id => selected.includes(id));
    if (allSelected) {
      onChange(selected.filter(id => !allIds.includes(id)));
    } else {
      const merged = [...selected, ...allIds];
      onChange(merged.filter((id, idx) => merged.indexOf(id) === idx));
    }
  };

  const totalHouseholds = filtered.filter(a => selected.includes(a.id)).reduce((s, a) => s + a.households, 0);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-gray-500">홍보 대상 아파트 선택</label>
        <span className="text-xs text-blue-600 font-medium">
          {selected.length}개 선택 · 약 {totalHouseholds.toLocaleString()}세대
        </span>
      </div>

      {/* 반경 선택 */}
      <div className="flex items-center gap-2">
        <MapPinIcon className="w-4 h-4 text-gray-400" />
        <span className="text-xs text-gray-500">반경</span>
        {[1, 3, 5, 10].map(r => (
          <button
            key={r}
            onClick={() => setRadius(r)}
            className={`text-xs px-2.5 py-1 rounded-full font-medium transition ${
              radius === r ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            {r}km
          </button>
        ))}
        <span className="text-xs text-gray-400 ml-1">({nearby.length}개 검색)</span>
      </div>

      {/* 검색 */}
      <div className="relative">
        <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="아파트명 또는 주소 검색"
          className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* 전체 선택 */}
      <div className="flex items-center justify-between px-1">
        <button onClick={selectAll} className="text-xs text-blue-600 font-medium hover:underline">
          {filtered.every(a => selected.includes(a.id)) ? '전체 해제' : '전체 선택'}
        </button>
      </div>

      {/* 아파트 리스트 */}
      <div className="max-h-60 overflow-y-auto space-y-1.5 border border-gray-100 rounded-xl p-2">
        {filtered.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">
            {nearby.length === 0 ? '반경 내 아파트가 없습니다. 반경을 늘려보세요.' : '검색 결과가 없습니다'}
          </p>
        ) : (
          filtered.map(apt => {
            const isSelected = selected.includes(apt.id);
            return (
              <label
                key={apt.id}
                className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition ${
                  isSelected ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50 border border-transparent'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggle(apt.id)}
                  className="w-4 h-4 rounded text-blue-600 shrink-0"
                />
                <BuildingOffice2Icon className={`w-5 h-5 shrink-0 ${isSelected ? 'text-blue-500' : 'text-gray-300'}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-800 truncate">{apt.name}</span>
                    <span className="text-xs text-gray-400 shrink-0">{apt.households.toLocaleString()}세대</span>
                  </div>
                  <p className="text-xs text-gray-400 truncate">{apt.address}</p>
                </div>
                <span className={`text-xs font-medium shrink-0 ${apt.distance < 1 ? 'text-emerald-600' : apt.distance < 3 ? 'text-blue-600' : 'text-gray-500'}`}>
                  {apt.distance < 1 ? `${Math.round(apt.distance * 1000)}m` : `${apt.distance.toFixed(1)}km`}
                </span>
              </label>
            );
          })
        )}
      </div>

      {selected.length === 0 && (
        <p className="text-xs text-amber-600 flex items-center gap-1">
          최소 1개 이상의 아파트를 선택해주세요
        </p>
      )}
    </div>
  );
};
