import React, { useState, useEffect } from 'react';
import { SquarePen, CircleCheck, CircleAlert, Plus, Trash2, X, Building2 } from 'lucide-react';
import { LocalShop, CATEGORIES, ICONS } from '../data/types';
import { apartments } from '../data/mockData';
import { ImageUpload } from '../components/ImageUpload';
import { useToast } from '../components/Toast';

const MAX_SHOPS = 5;

const emptyShop = (): LocalShop => ({
  id: `shop_${Date.now()}`, name: '', category: '음식점', icon: 'pizza', tagline: '', phone: '', address: '', lat: 37.4410, lng: 127.1400, weight: 5, isHomeVisible: true, createdAt: new Date().toISOString().slice(0, 10), expiresAt: '', targetApartments: [],
});

interface Props {
  shops: LocalShop[];
  setShops: (shops: LocalShop[]) => void;
}

export const MyShopPage: React.FC<Props> = ({ shops, setShops }) => {
  const toast = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [form, setForm] = useState<LocalShop>(emptyShop());
  const [images, setImages] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const canAdd = shops.length < MAX_SHOPS;

  const openCreate = () => {
    setForm(emptyShop());
    setErrors({});
    setImages([]);
    setModalMode('create');
    setModalOpen(true);
  };

  const openEdit = (shop: LocalShop) => {
    setForm({ ...shop });
    setErrors({});
    setImages([]);
    setModalMode('edit');
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = '상호명을 입력해주세요';
    if (!form.tagline.trim()) e.tagline = '홍보문구를 입력해주세요';
    if (!form.phone.trim()) e.phone = '연락처를 입력해주세요';
    if (form.targetApartments.length === 0) e.apartments = '노출할 아파트를 1개 이상 선택해주세요';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) { toast('필수 항목을 모두 입력해주세요', 'error'); return; }
    if (modalMode === 'create') {
      setShops([...shops, form]);
      toast('가게가 등록되었습니다!');
    } else {
      setShops(shops.map(s => s.id === form.id ? form : s));
      toast('가게 정보가 저장되었습니다');
    }
    closeModal();
  };

  const deleteShop = (id: string) => {
    if (!window.confirm('정말 이 가게를 삭제하시겠습니까?')) return;
    setShops(shops.filter(s => s.id !== id));
    toast('가게가 삭제되었습니다');
  };

  const toggleApartment = (aptId: string) => {
    setForm(prev => ({
      ...prev,
      targetApartments: prev.targetApartments.includes(aptId)
        ? prev.targetApartments.filter(id => id !== aptId)
        : [...prev.targetApartments, aptId],
    }));
    setErrors(prev => ({ ...prev, apartments: '' }));
  };

  const selectAllApartments = () => {
    const allIds = apartments.map(a => a.id);
    const allSelected = allIds.every(id => form.targetApartments.includes(id));
    setForm(prev => ({ ...prev, targetApartments: allSelected ? [] : allIds }));
    setErrors(prev => ({ ...prev, apartments: '' }));
  };

  const getApartmentNames = (ids: string[]) =>
    ids.map(id => apartments.find(a => a.id === id)?.name).filter(Boolean);

  return (
    <div>
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold pl-1">내 가게 관리</h2>
          <p className="text-sm text-gray-500 mt-1">등록된 가게를 관리하고 입주민 앱에 노출하세요 ({shops.length}/{MAX_SHOPS})</p>
        </div>
        {canAdd && shops.length > 0 && (
          <button
            onClick={openCreate}
            className="bg-[#222] hover:bg-[#333] text-white px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition"
          >
            <Plus className="w-4 h-4" /> 가게 추가
          </button>
        )}
      </div>

      {shops.length === 0 ? (
        /* 빈 상태 */
        <div className="flex flex-col items-center justify-center py-24">
          <button
            onClick={openCreate}
            className="w-20 h-20 rounded-lg bg-blue-50 hover:bg-blue-100 border-2 border-dashed border-blue-300 flex items-center justify-center transition group"
          >
            <Plus className="w-10 h-10 text-blue-400 group-hover:text-blue-600 transition" />
          </button>
          <div className="mt-5 text-center">
            <p className="text-lg font-bold text-gray-800">내 가게를 등록해보세요</p>
            <p className="text-sm text-gray-400 mt-1">등록하시면 입주민 앱에 무료로 노출됩니다</p>
          </div>
        </div>
      ) : (
        /* 가게 카드 목록 */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {shops.map(shop => {
            const aptNames = getApartmentNames(shop.targetApartments);
            const aptCount = shop.targetApartments.length;
            return (
              <div key={shop.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                {/* 헤더 */}
                <div className="px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-600 shrink-0">
                      {shop.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-gray-900 truncate">{shop.name}</h3>
                      <p className="text-xs text-gray-400">{shop.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-xs font-semibold ${shop.isHomeVisible ? 'text-emerald-600' : 'text-gray-400'}`}>
                      {shop.isHomeVisible ? '노출 중' : '비노출'}
                    </span>
                    <button onClick={() => openEdit(shop)} className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition">
                      <SquarePen className="w-4 h-4" />
                    </button>
                    <button onClick={() => deleteShop(shop.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {/* 정보 */}
                <div className="px-4 py-2 border-t border-gray-100 text-xs text-gray-600">
                  <p className="truncate">{shop.tagline}</p>
                  <div className="flex items-center gap-3 mt-1 text-gray-400">
                    <span>{shop.phone || '-'}</span>
                    <span>{shop.createdAt}</span>
                  </div>
                </div>
                {/* 아파트 */}
                {aptCount > 0 && (
                  <div className="flex items-center gap-2 px-4 py-2 border-t border-gray-100 bg-gray-50/50">
                    <Building2 className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span className="text-xs font-semibold text-gray-500 shrink-0">총 {aptCount}개</span>
                    <span className="text-gray-300">|</span>
                    <div className="flex items-center gap-1 flex-wrap">
                      {aptNames.slice(0, 3).map((n, i) => (
                        <span key={i} className="text-xs px-1.5 py-0.5 bg-white rounded text-gray-500 border border-gray-200">{n}</span>
                      ))}
                      {aptNames.length > 3 && <span className="text-xs text-gray-400">+{aptNames.length - 3}</span>}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ═══ 등록/수정 모달 ═══ */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* 오버레이 */}
          <div className="absolute inset-0 bg-black/40" onClick={closeModal} />

          {/* 모달 */}
          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* 헤더 */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10 rounded-t-lg">
              <div>
                <h3 className="text-lg font-bold">{modalMode === 'create' ? '새 가게 등록' : '가게 정보 수정'}</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {modalMode === 'create' ? '가게 정보를 등록하면 입주민 앱에 무료로 노출됩니다' : '수정한 정보는 즉시 앱에 반영됩니다'}
                </p>
              </div>
              <button onClick={closeModal} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* 폼 */}
            <div className="p-6 space-y-5">
              <Field label="상호명 *" value={form.name} onChange={v => { setForm({ ...form, name: v }); setErrors({ ...errors, name: '' }); }} placeholder="예: 맛있는피자" error={errors.name} />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">업종 *</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value, icon: ICONS[e.target.value] || 'store-outline' })} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <Field label="연락처 *" value={form.phone} onChange={v => { setForm({ ...form, phone: v }); setErrors({ ...errors, phone: '' }); }} placeholder="031-000-0000" error={errors.phone} />
              </div>

              <Field label="한줄 홍보문구 *" value={form.tagline} onChange={v => { setForm({ ...form, tagline: v }); setErrors({ ...errors, tagline: '' }); }} placeholder="예: 매일 점심 세트 20% 할인!" error={errors.tagline} />
              <Field label="주소" value={form.address} onChange={v => setForm({ ...form, address: v })} placeholder="성남시 중원구..." />

              <ImageUpload images={images} onChange={setImages} max={3} label="가게 사진" />

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isHomeVisible} onChange={e => setForm({ ...form, isHomeVisible: e.target.checked })} className="w-4 h-4 rounded" />
                <span className="text-sm text-gray-600">홈 화면에 내 가게 노출하기</span>
              </label>

              {/* ── 아파트 선택 ── */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-gray-500" />
                    <label className="text-xs font-semibold text-gray-500">노출 아파트 선택 *</label>
                  </div>
                  <button
                    type="button"
                    onClick={selectAllApartments}
                    className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    {apartments.every(a => form.targetApartments.includes(a.id)) ? '전체 해제' : '전체 선택'}
                  </button>
                </div>
                <p className="text-xs text-gray-400 mb-3">이웃상가는 무료입니다. 노출할 아파트를 선택해주세요.</p>

                <div className="border border-gray-200 rounded-lg overflow-hidden max-h-60 overflow-y-auto">
                  {apartments.map((apt, i) => {
                    const checked = form.targetApartments.includes(apt.id);
                    return (
                      <label
                        key={apt.id}
                        className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition ${
                          checked ? 'bg-blue-50' : 'hover:bg-gray-50'
                        } ${i > 0 ? 'border-t border-gray-100' : ''}`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleApartment(apt.id)}
                          className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{apt.name}</p>
                          <p className="text-xs text-gray-400 truncate">{apt.address} · {apt.households.toLocaleString()}세대</p>
                        </div>
                      </label>
                    );
                  })}
                </div>

                {form.targetApartments.length > 0 && (
                  <p className="text-xs text-blue-600 mt-2 font-medium">
                    {form.targetApartments.length}개 아파트 선택됨
                  </p>
                )}
                {errors.apartments && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><CircleAlert className="w-3.5 h-3.5" />{errors.apartments}</p>}
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500">
                  이웃상가 등록은 <strong className="text-blue-600">무료</strong>입니다. 등록하시면 선택한 아파트 입주민 앱의 "우리동네 &gt; 이웃상가" 탭에 노출됩니다.
                </p>
              </div>
            </div>

            {/* 하단 버튼 */}
            <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex gap-3 rounded-b-lg">
              <button onClick={closeModal} className="flex-1 py-3 rounded-lg border border-gray-200 text-sm font-medium text-gray-500 hover:bg-gray-50 transition">
                취소
              </button>
              <button onClick={handleSave} className="flex-1 py-3 rounded-lg bg-[#222] hover:bg-[#333] text-white text-sm font-semibold transition">
                {modalMode === 'create' ? '가게 등록하기' : '저장하기'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex items-center justify-between py-1.5 border-b border-gray-100 last:border-0">
    <span className="text-xs text-gray-500">{label}</span>
    <span className="text-xs font-medium text-gray-900 text-right max-w-[60%] truncate">{value}</span>
  </div>
);

const Field: React.FC<{ label: string; value: string; onChange: (v: string) => void; placeholder?: string; error?: string }> = ({ label, value, onChange, placeholder, error }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-500 mb-1.5">{label}</label>
    <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:outline-none ${error ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'}`} />
    {error && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><CircleAlert className="w-3.5 h-3.5" />{error}</p>}
  </div>
);
