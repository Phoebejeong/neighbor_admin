import React, { useState, useMemo, useEffect } from 'react';
import { Building2, Search, Loader2 } from 'lucide-react';
import { Apartment } from '../data/types';
import { apartments as mockApartments } from '../data/mockData';
import { searchApartments, ApiApartment } from '../data/api';

interface Props {
  selected: string[];
  onChange: (ids: string[]) => void;
  shopLat?: number;
  shopLng?: number;
  allowedIds?: string[];
}

// API 응답 → 내부 Apartment 타입 변환
const toApartment = (a: ApiApartment): Apartment => ({
  id: String(a.id),
  name: a.name,
  address: a.address || '',
  lat: 0,
  lng: 0,
  households: 0,
});

export const ApartmentSelector: React.FC<Props> = ({ selected, onChange, allowedIds }) => {
  const [search, setSearch] = useState('');
  const [apiResults, setApiResults] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(false);
  const [useApi, setUseApi] = useState(true);

  // 초기 로드 + 검색 시 API 호출 (debounce)
  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true);
      const results = await searchApartments(search);
      if (results.length > 0) {
        setApiResults(results.map(toApartment));
        setUseApi(true);
      } else if (search.trim()) {
        // 검색 결과 없음
        setApiResults([]);
        setUseApi(true);
      } else {
        // API 실패 시 mock fallback
        setUseApi(false);
      }
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // mock fallback 필터
  const mockFiltered = useMemo(
    () => mockApartments.filter(a => a.name.includes(search) || a.address.includes(search)),
    [search]
  );

  const fullList = useApi ? apiResults : mockFiltered;
  const displayList = allowedIds ? fullList.filter(a => allowedIds.includes(a.id)) : fullList;

  const toggle = (id: string) => {
    onChange(selected.includes(id) ? selected.filter(i => i !== id) : [...selected, id]);
  };

  const selectAll = () => {
    const allIds = displayList.map(a => a.id);
    const allSelected = allIds.every(id => selected.includes(id));
    if (allSelected) {
      onChange(selected.filter(id => !allIds.includes(id)));
    } else {
      const merged = [...selected, ...allIds];
      onChange(merged.filter((id, idx) => merged.indexOf(id) === idx));
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-stone-500">홍보 대상 아파트 선택</label>
        <span className="text-xs text-[#7f2929] font-medium">
          {selected.length}개 선택
        </span>
      </div>

      {/* 검색 */}
      <div className="relative">
        <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="아파트명 검색"
          className="w-full border border-stone-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-[#7f2929] focus:outline-none"
        />
        {loading && <Loader2 className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 animate-spin" />}
      </div>

      {/* 전체 선택 */}
      {displayList.length > 0 && (
        <div className="flex items-center justify-between px-1">
          <button onClick={selectAll} className="text-xs text-[#7f2929] font-medium hover:underline">
            {displayList.every(a => selected.includes(a.id)) ? '전체 해제' : '전체 선택'}
          </button>
          <span className="text-xs text-stone-400">{displayList.length}개</span>
        </div>
      )}

      {/* 아파트 리스트 */}
      <div className="max-h-60 overflow-y-auto space-y-1.5 border border-stone-100 rounded-lg p-2">
        {displayList.length === 0 ? (
          <p className="text-sm text-stone-400 text-center py-6">
            {search.trim() ? '검색 결과가 없습니다' : '아파트명을 검색해주세요'}
          </p>
        ) : (
          displayList.map(apt => {
            const isSelected = selected.includes(apt.id);
            return (
              <label
                key={apt.id}
                className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition ${
                  isSelected ? 'bg-[#FDF2F2] border border-[#F0D4D4]' : 'hover:bg-stone-50 border border-transparent'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggle(apt.id)}
                  className="w-4 h-4 rounded text-[#7f2929] shrink-0"
                />
                <Building2 className={`w-5 h-5 shrink-0 ${isSelected ? 'text-[#7f2929]' : 'text-stone-300'}`} />
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-semibold text-stone-800 truncate block">{apt.name}</span>
                  <p className="text-xs text-stone-400 truncate">{apt.address}</p>
                </div>
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
