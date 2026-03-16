import React, { useState } from 'react';
import { PlusIcon, PencilSquareIcon, TrashIcon, ExclamationCircleIcon, BuildingOffice2Icon } from '@heroicons/react/24/outline';
import { ShoppingItem, LocalShop } from '../data/types';
import { formatMoney, genId } from '../data/utils';
import { apartments } from '../data/mockData';
import { Modal } from '../components/Modal';
import { ImageUpload } from '../components/ImageUpload';

import { ApartmentSelector } from '../components/ApartmentSelector';
import { useToast } from '../components/Toast';

interface Props {
  items: ShoppingItem[];
  setItems: React.Dispatch<React.SetStateAction<ShoppingItem[]>>;
  shopName: string;
  shops: LocalShop[];
  onNavigate: (page: string) => void;
}

const empty: ShoppingItem = { id: '', name: '', price: 0, discountRate: 0, shopName: '', amount: 0, paymentStatus: 'unpaid', viewCount: 0, createdAt: '', targetApartments: [] };

export const MyShoppingPage: React.FC<Props> = ({ items, setItems, shopName, shops, onNavigate }) => {
  const toast = useToast();
  const [editing, setEditing] = useState<ShoppingItem | null>(null);
  const [selectedShopId, setSelectedShopId] = useState<string>('');
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [step, setStep] = useState<'form' | 'apartments' | 'confirm'>('form');

  const selectedShop = shops.find(s => s.id === selectedShopId) || null;
  const shopLat = selectedShop?.lat || shops[0]?.lat || 37.4410;
  const shopLng = selectedShop?.lng || shops[0]?.lng || 127.1400;

  const openNew = () => {
    const defaultShopId = shops.length === 1 ? shops[0].id : '';
    const defaultShop = shops.length === 1 ? shops[0] : null;
    setSelectedShopId(defaultShopId);
    setEditing({ ...empty, shopName: defaultShop?.name || shopName });
    setImage([]); setErrors({}); setStep('form'); setOpen(true);
  };
  const openEdit = (i: ShoppingItem) => { setEditing({ ...i }); setImage([]); setErrors({}); setStep('form'); setOpen(true); };
  const close = () => { setOpen(false); setEditing(null); setStep('form'); };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!editing?.name.trim()) e.name = '상품명을 입력해주세요';
    if (!editing?.shopName.trim()) e.shopName = '판매처를 입력해주세요';
    if (!editing?.price || editing.price <= 0) e.price = '정가를 입력해주세요';
    if (editing && (editing.discountRate < 0 || editing.discountRate > 99)) e.discountRate = '할인율은 0~99%';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const goApartments = () => {
    if (!validate()) { toast('필수 항목을 모두 입력해주세요', 'error'); return; }
    setStep('apartments');
  };

  const goConfirm = () => {
    if (!editing || editing.targetApartments.length === 0) {
      toast('최소 1개 이상의 아파트를 선택해주세요', 'error');
      return;
    }
    setStep('confirm');
  };

  const save = () => {
    if (!editing) return;
    if (editing.id) {
      setItems(prev => prev.map(i => i.id === editing.id ? editing : i));
      toast('상품이 수정되었습니다');
    } else {
      setItems(prev => [...prev, { ...editing, id: genId('item'), createdAt: new Date().toISOString().slice(0, 10) }]);
      toast('상품이 등록되었습니다! 관리사무소 확인 후 결제 안내가 발송됩니다');
    }
    close();
  };

  const remove = (id: string) => {
    if (!window.confirm('이 상품을 삭제하시겠습니까?')) return;
    setItems(prev => prev.filter(i => i.id !== id));
    toast('상품이 삭제되었습니다', 'info');
  };

  const dp = editing ? Math.round(editing.price * (1 - (editing.discountRate || 0) / 100)) : 0;
  const saved = editing ? editing.price - dp : 0;
  const getAptNames = (ids: string[]) => ids.map(id => apartments.find(a => a.id === id)?.name).filter(Boolean);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-extrabold pl-1">실속쇼핑 등록</h2>
          <p className="text-sm text-gray-500 mt-1">입주민 전용 할인 상품을 등록하세요 (유료)</p>
        </div>
        <button onClick={openNew} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition">
          <PlusIcon className="w-4 h-4" /> 상품 등록
        </button>
      </div>

      {shops.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-4xl mb-3">🏪</p>
          <p className="text-gray-500 font-medium">등록된 가게가 없습니다</p>
          <p className="text-sm text-gray-400 mt-1">상품을 등록하려면 먼저 가게를 등록해주세요</p>
          <button onClick={() => onNavigate('myshop')} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition">
            가게 등록하기
          </button>
        </div>
      ) : (
      <>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5 flex items-start gap-3">
        <span className="text-xl">🛒</span>
        <div>
          <p className="text-sm font-semibold text-amber-800">실속쇼핑은 유료 서비스입니다</p>
          <p className="text-xs text-amber-600 mt-0.5">상품 등록 시 수수료가 발생합니다. 결제 완료 후 앱에 노출됩니다.</p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-4xl mb-3">🛒</p>
          <p className="text-gray-500 font-medium">등록한 상품이 없습니다</p>
          <p className="text-sm text-gray-400 mt-1">입주민 전용 할인 상품을 등록해보세요</p>
          <button onClick={openNew} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition">
            첫 상품 등록하기
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map(item => {
            const discounted = item.discountRate ? Math.round(item.price * (1 - item.discountRate / 100)) : item.price;
            const aptNames = getAptNames(item.targetApartments || []);
            const isPaid = item.paymentStatus === 'paid';
            const aptCount = item.targetApartments?.length || 0;
            return (
              <div key={item.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="flex">
                  <div className={`w-1.5 shrink-0 ${isPaid ? 'bg-blue-500' : 'bg-amber-400'}`} />
                  <div className="flex-1">
                    {/* 상단: 상품명 + 판매처 + 액션 */}
                    <div className="flex items-center justify-between px-5 pt-5 pb-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold text-gray-900 truncate">{item.name}</h3>
                          <span className={`text-xs px-2.5 py-1 rounded-full font-semibold shrink-0 ${isPaid ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
                            {isPaid ? '노출 중' : '결제대기'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-0.5">{item.shopName} · {item.createdAt}</p>
                      </div>
                      <div className="flex items-center gap-1 ml-4 shrink-0">
                        <button onClick={() => openEdit(item)} className="p-2 rounded-lg hover:bg-blue-100 text-gray-400 hover:text-blue-600 transition"><PencilSquareIcon className="w-5 h-5" /></button>
                        <button onClick={() => remove(item.id)} className="p-2 rounded-lg hover:bg-red-100 text-gray-400 hover:text-red-500 transition"><TrashIcon className="w-5 h-5" /></button>
                      </div>
                    </div>
                    {/* 중간: 가격 + 조회수 */}
                    <div className="grid grid-cols-2 border-t border-gray-100 divide-x divide-gray-100">
                      <div className="px-5 py-3">
                        <p className="text-sm text-gray-400 font-medium mb-1">가격</p>
                        {item.discountRate > 0 ? (
                          <div>
                            <span className="text-xs text-gray-400 line-through mr-1.5">{formatMoney(item.price)}원</span>
                            <span className="text-xs font-bold text-red-500 mr-1">{item.discountRate}%</span>
                            <span className="text-sm font-bold text-gray-900">{formatMoney(discounted)}원</span>
                          </div>
                        ) : (
                          <p className="text-sm font-bold text-gray-900">{formatMoney(item.price)}원</p>
                        )}
                      </div>
                      <div className="px-5 py-3">
                        <p className="text-sm text-gray-400 font-medium mb-1">조회수</p>
                        <p className="text-sm font-bold text-gray-800">{formatMoney(item.viewCount)}회</p>
                      </div>
                    </div>
                    {/* 하단: 아파트 */}
                    {aptCount > 0 && (
                      <div className="flex items-center gap-2 px-5 py-3 border-t border-gray-100 bg-gray-50/50">
                        <BuildingOffice2Icon className="w-4 h-4 text-gray-400 shrink-0" />
                        <span className="text-xs font-semibold text-gray-600 shrink-0">총 {aptCount}개 단지</span>
                        <span className="text-gray-300">|</span>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {aptNames.map((n, i) => (
                            <span key={i} className="text-xs px-2 py-0.5 bg-white rounded-md text-gray-500 border border-gray-200">{n}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal open={open} title={step === 'confirm' ? '등록 확인' : step === 'apartments' ? '홍보 대상 아파트' : (editing?.id ? '상품 수정' : '상품 등록')} onClose={close}>
        {/* Step 1: Form */}
        {editing && step === 'form' && (
          <div className="space-y-4">
            <StepIndicator current={1} />
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">상품명 *</label>
              <input value={editing.name} onChange={e => { setEditing({ ...editing, name: e.target.value }); setErrors({ ...errors, name: '' }); }} placeholder="예: 프리미엄 공기청정기 필터" className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:outline-none ${errors.name ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'}`} />
              {errors.name && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><ExclamationCircleIcon className="w-3.5 h-3.5" />{errors.name}</p>}
            </div>
            {/* 가게 선택 */}
            {shops.length > 0 ? (
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">판매처 *</label>
                <select
                  value={selectedShopId}
                  onChange={e => {
                    const id = e.target.value;
                    setSelectedShopId(id);
                    const s = shops.find(sh => sh.id === id);
                    if (s) {
                      setEditing({ ...editing, shopName: s.name });
                      setErrors({ ...errors, shopName: '' });
                    } else {
                      setEditing({ ...editing, shopName: '' });
                    }
                  }}
                  className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:outline-none ${errors.shopName ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'}`}
                >
                  {shops.length > 1 && <option value="">선택</option>}
                  {shops.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.category})</option>
                  ))}
                </select>
                {selectedShop && (
                  <div className="flex items-center gap-2 mt-2 bg-blue-50 rounded-lg px-3 py-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600">{selectedShop.name.charAt(0)}</div>
                    <div>
                      <p className="text-xs font-semibold text-blue-800">{selectedShop.name}</p>
                      <p className="text-xs text-blue-500">{selectedShop.tagline}</p>
                    </div>
                  </div>
                )}
                {errors.shopName && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><ExclamationCircleIcon className="w-3.5 h-3.5" />{errors.shopName}</p>}
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">판매처 *</label>
                <input value={editing.shopName} onChange={e => { setEditing({ ...editing, shopName: e.target.value }); setErrors({ ...errors, shopName: '' }); }} placeholder="내 상호명" className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:outline-none ${errors.shopName ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'}`} />
                {errors.shopName && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><ExclamationCircleIcon className="w-3.5 h-3.5" />{errors.shopName}</p>}
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">정가 (원) *</label>
                <input type="number" value={String(editing.price)} onChange={e => { setEditing({ ...editing, price: Number(e.target.value) || 0 }); setErrors({ ...errors, price: '' }); }} className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:outline-none ${errors.price ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'}`} />
                {errors.price && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><ExclamationCircleIcon className="w-3.5 h-3.5" />{errors.price}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">할인율 (%)</label>
                <input type="number" value={String(editing.discountRate)} onChange={e => { setEditing({ ...editing, discountRate: Number(e.target.value) || 0 }); setErrors({ ...errors, discountRate: '' }); }} className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:outline-none ${errors.discountRate ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'}`} />
                {errors.discountRate && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><ExclamationCircleIcon className="w-3.5 h-3.5" />{errors.discountRate}</p>}
              </div>
            </div>
            {editing.price > 0 && (
              <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-700 font-medium">
                할인가: <strong>{formatMoney(dp)}원</strong>
                {saved > 0 && ` (${formatMoney(saved)}원 절약)`}
              </div>
            )}
            <ImageUpload images={image} onChange={setImage} max={1} label="상품 이미지" />

            <div className="flex gap-2 pt-2">
              <button onClick={close} className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-500 hover:bg-gray-50 transition">취소</button>
              <button onClick={editing.id ? save : goApartments} className="flex-1 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition">{editing.id ? '저장' : '다음: 아파트 선택'}</button>
            </div>
          </div>
        )}

        {/* Step 2: Apartment Selection */}
        {editing && step === 'apartments' && (
          <div className="space-y-4">
            <StepIndicator current={2} />
            <ApartmentSelector
              shopLat={shopLat}
              shopLng={shopLng}
              selected={editing.targetApartments}
              onChange={ids => setEditing({ ...editing, targetApartments: ids })}
            />
            <div className="flex gap-2 pt-2">
              <button onClick={() => setStep('form')} className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-500 hover:bg-gray-50 transition">이전</button>
              <button onClick={goConfirm} className="flex-1 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition">다음: 확인</button>
            </div>
          </div>
        )}

        {/* Step 3: Confirm */}
        {editing && step === 'confirm' && (
          <div className="space-y-4">
            <StepIndicator current={3} />
            <div className="bg-blue-50 rounded-xl p-5">
              <h4 className="text-sm font-bold text-blue-800 mb-3">등록 내용 확인</h4>
              <div className="space-y-2 text-sm">
                <ConfirmRow label="상품명" value={editing.name} />
                <ConfirmRow label="판매처" value={editing.shopName} />
                <ConfirmRow label="가격" value={editing.discountRate > 0 ? `${formatMoney(editing.price)}원 → ${editing.discountRate}% 할인 → ${formatMoney(dp)}원` : `${formatMoney(editing.price)}원`} />
                <ConfirmRow label="대상 아파트" value={`${editing.targetApartments.length}개 단지`} />
                <div className="flex flex-wrap gap-1 ml-20">
                  {getAptNames(editing.targetApartments).map((n, i) => (
                    <span key={i} className="text-xs px-1.5 py-0.5 bg-white rounded text-blue-700">{n}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-sm font-semibold text-amber-800">결제 안내</p>
              <p className="text-xs text-amber-600 mt-1">
                등록 후 관리사무소에서 상품 정보를 확인합니다.<br/>
                확인 완료 후 등록 수수료 결제 안내가 발송됩니다.<br/>
                결제가 완료되면 선택한 아파트 입주민 앱에 즉시 노출됩니다.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button onClick={() => setStep('apartments')} className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-500 hover:bg-gray-50 transition">이전</button>
              <button onClick={save} className="flex-1 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition">등록하기</button>
            </div>
          </div>
        )}
      </Modal>
      </>
      )}
    </div>
  );
};

const StepIndicator: React.FC<{ current: number }> = ({ current }) => (
  <div className="flex items-center justify-center gap-2 pb-2">
    {['상품 정보', '아파트 선택', '확인'].map((label, i) => {
      const step = i + 1;
      const active = step === current;
      const done = step < current;
      return (
        <React.Fragment key={step}>
          {i > 0 && <div className={`w-8 h-0.5 ${done ? 'bg-blue-500' : 'bg-gray-200'}`} />}
          <div className="flex items-center gap-1.5">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${active ? 'bg-blue-600 text-white' : done ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
              {done ? '✓' : step}
            </div>
            <span className={`text-xs font-medium ${active ? 'text-blue-600' : 'text-gray-400'}`}>{label}</span>
          </div>
        </React.Fragment>
      );
    })}
  </div>
);

const ConfirmRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex">
    <span className="text-gray-500 w-20 shrink-0">{label}</span>
    <span className="text-gray-800 font-medium">{value}</span>
  </div>
);
