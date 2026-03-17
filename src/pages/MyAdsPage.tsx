import React, { useState } from 'react';
import { Plus, SquarePen, Trash2, Eye, CircleAlert, Building2 } from 'lucide-react';
import { LocalAd, LocalShop } from '../data/types';
import { getAdStatus, formatMoney, genId } from '../data/utils';
import { apartments } from '../data/mockData';
import { Modal } from '../components/Modal';
import { ImageUpload } from '../components/ImageUpload';
import { AdPreviewCard } from '../components/MobilePreview';
import { ApartmentSelector } from '../components/ApartmentSelector';
import { useToast } from '../components/Toast';

interface Props {
  ads: LocalAd[];
  setAds: React.Dispatch<React.SetStateAction<LocalAd[]>>;
  shopName: string;
  shops: LocalShop[];
  onNavigate: (page: string) => void;
}

const empty: LocalAd = { id: '', title: '', description: '', advertiser: '', period: '', startDate: '', endDate: '', contact: '', address: '', amount: 0, paymentStatus: 'unpaid', viewCount: 0, createdAt: '', targetApartments: [] };

const PRICE_PER_DAY = 10000; // 1만원/건/일

const calcDays = (start: string, end: string): number => {
  if (!start || !end) return 0;
  const s = new Date(start);
  const e = new Date(end);
  const diff = Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  return diff > 0 ? diff : 0;
};

export const MyAdsPage: React.FC<Props> = ({ ads, setAds, shopName, shops, onNavigate }) => {
  const toast = useToast();
  const [editing, setEditing] = useState<LocalAd | null>(null);
  const [selectedShopId, setSelectedShopId] = useState<string>('');
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [step, setStep] = useState<'form' | 'apartments' | 'confirm'>('form');

  const selectedShop = shops.find(s => s.id === selectedShopId) || null;
  const shopLat = selectedShop?.lat || shops[0]?.lat || 37.4410;
  const shopLng = selectedShop?.lng || shops[0]?.lng || 127.1400;

  const openNew = () => {
    const defaultShopId = shops.length === 1 ? shops[0].id : '';
    const defaultShop = shops.length === 1 ? shops[0] : null;
    setSelectedShopId(defaultShopId);
    setEditing({
      ...empty,
      advertiser: defaultShop?.name || shopName,
      contact: defaultShop?.phone || '',
      address: defaultShop?.address || '',
    });
    setImages([]); setErrors({}); setStep('form'); setOpen(true);
  };
  const openEdit = (a: LocalAd) => { setEditing({ ...a }); setImages([]); setErrors({}); setStep('form'); setOpen(true); };
  const close = () => { setOpen(false); setEditing(null); setStep('form'); };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!editing?.title.trim()) e.title = '광고 제목을 입력해주세요';
    if (!editing?.description.trim()) e.description = '광고 내용을 입력해주세요';
    if (!editing?.startDate) e.startDate = '시작일을 선택해주세요';
    if (!editing?.endDate) e.endDate = '종료일을 선택해주세요';
    if (editing?.startDate && editing?.endDate && editing.startDate > editing.endDate) e.endDate = '종료일이 시작일보다 빠릅니다';
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
    const s = editing.startDate.replace(/-/g, '.');
    const e = editing.endDate.replace(/-/g, '.').slice(5);
    const days = calcDays(editing.startDate, editing.endDate);
    const totalAmount = PRICE_PER_DAY * days * editing.targetApartments.length;
    const data = { ...editing, period: `${s} ~ ${e}`, amount: totalAmount };
    if (editing.id) {
      setAds(prev => prev.map(a => a.id === editing.id ? data : a));
      toast('광고가 수정되었습니다');
    } else {
      setAds(prev => [...prev, { ...data, id: genId('ad'), viewCount: 0, createdAt: new Date().toISOString().slice(0, 10) }]);
      toast('광고가 신청되었습니다! 관리사무소 확인 후 결제 안내가 발송됩니다');
    }
    close();
  };

  const remove = (id: string) => {
    if (!window.confirm('이 광고를 삭제하시겠습니까?')) return;
    setAds(prev => prev.filter(a => a.id !== id));
    toast('광고가 삭제되었습니다', 'info');
  };

  const getAptNames = (ids: string[]) => ids.map(id => apartments.find(a => a.id === id)?.name).filter(Boolean);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold pl-1">알짜광고 신청</h2>
          <p className="text-sm text-gray-500 mt-1">기간 한정 이벤트/프로모션을 입주민에게 홍보하세요 (유료)</p>
        </div>
        <button onClick={openNew} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition">
          <Plus className="w-4 h-4" /> 광고 신청
        </button>
      </div>

      {shops.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">

          <p className="text-gray-500 font-medium">등록된 가게가 없습니다</p>
          <p className="text-sm text-gray-400 mt-1">광고를 신청하려면 먼저 가게를 등록해주세요</p>
          <button onClick={() => onNavigate('myshop')} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition">
            가게 등록하기
          </button>
        </div>
      ) : (
      <>
      <div className="rounded-lg p-4 mb-5 flex items-start gap-3">
        <span className="text-xl">💡</span>
        <div>
          <p className="text-sm font-semibold text-gray-700">알짜광고는 유료 서비스입니다</p>
          <p className="text-xs text-gray-500 mt-0.5">광고 신청 후 결제가 완료되면 입주민 앱에 노출됩니다. 기간/위치에 따라 금액이 달라집니다.</p>
        </div>
      </div>

      {ads.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <p className="text-4xl mb-3">📢</p>
          <p className="text-gray-500 font-medium">등록한 광고가 없습니다</p>
          <p className="text-sm text-gray-400 mt-1">알짜광고를 등록해서 입주민에게 이벤트를 알려보세요</p>
          <button onClick={openNew} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition">
            첫 광고 신청하기
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {ads.map(ad => {
            const st = getAdStatus(ad);
            const aptNames = getAptNames(ad.targetApartments || []);
            const isPaid = ad.paymentStatus === 'paid';
            const aptCount = ad.targetApartments?.length || 0;
            return (
              <div key={ad.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="flex">
                  <div className={`w-1.5 shrink-0 ${isPaid ? 'bg-blue-500' : 'bg-amber-400'}`} />
                  <div className="flex-1">
                    {/* 상단: 제목 + 뱃지 + 액션 */}
                    <div className="flex items-center justify-between px-5 pt-5 pb-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <h3 className="text-lg font-bold text-gray-900 truncate">{ad.title}</h3>
                        <span className={`text-xs font-semibold shrink-0 ${st.cls}`}>{st.label}</span>
                        <span className={`text-xs font-semibold shrink-0 ${isPaid ? 'text-emerald-600' : 'text-red-500'}`}>
                          {isPaid ? '결제완료' : '결제대기'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 ml-4 shrink-0">
                        <button onClick={() => openEdit(ad)} className="p-2 rounded-lg hover:bg-blue-100 text-gray-400 hover:text-blue-600 transition"><SquarePen className="w-5 h-5" /></button>
                        <button onClick={() => remove(ad.id)} className="p-2 rounded-lg hover:bg-red-100 text-gray-400 hover:text-red-500 transition"><Trash2 className="w-5 h-5" /></button>
                      </div>
                    </div>
                    {/* 설명 */}
                    <p className="text-sm text-gray-600 px-5 pb-3 line-clamp-2">{ad.description}</p>
                    {/* 중간: 기간 / 조회수 / 금액 3칸 그리드 */}
                    <div className="grid grid-cols-3 border-t border-gray-100 divide-x divide-gray-100">
                      <div className="px-5 py-3">
                        <p className="text-sm text-gray-400 font-medium mb-1">광고 기간</p>
                        <p className="text-sm font-bold text-gray-800">{ad.period || '-'}</p>
                      </div>
                      <div className="px-5 py-3">
                        <p className="text-sm text-gray-400 font-medium mb-1">조회수</p>
                        <p className="text-sm font-bold text-gray-800">{formatMoney(ad.viewCount)}회</p>
                      </div>
                      <div className="px-5 py-3">
                        <p className="text-sm text-gray-400 font-medium mb-1">광고비</p>
                        <p className="text-sm font-bold text-blue-600">{formatMoney(ad.amount)}원</p>
                      </div>
                    </div>
                    {/* 하단: 아파트 */}
                    {aptCount > 0 && (
                      <div className="flex items-center gap-2 px-5 py-3 border-t border-gray-100 bg-gray-50/50">
                        <Building2 className="w-4 h-4 text-gray-400 shrink-0" />
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

      <Modal open={open} title={step === 'confirm' ? '신청 확인' : step === 'apartments' ? '홍보 대상 아파트' : (editing?.id ? '광고 수정' : '알짜광고 신청')} onClose={close}>
        {/* Step 1: Form */}
        {editing && step === 'form' && (
          <div className="space-y-4">
            <StepIndicator current={1} />

            {/* 가게 선택 */}
            {shops.length > 0 && (
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">광고 가게 선택</label>
                <select
                  value={selectedShopId}
                  onChange={e => {
                    const id = e.target.value;
                    setSelectedShopId(id);
                    const s = shops.find(sh => sh.id === id);
                    if (s) {
                      setEditing({ ...editing, advertiser: s.name, contact: s.phone, address: s.address });
                    } else {
                      setEditing({ ...editing, advertiser: shopName, contact: '', address: '' });
                    }
                  }}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">광고 제목 *</label>
              <input value={editing.title} onChange={e => { setEditing({ ...editing, title: e.target.value }); setErrors({ ...errors, title: '' }); }} placeholder="예: 봄맞이 할인 이벤트" className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:outline-none ${errors.title ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'}`} />
              {errors.title && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><CircleAlert className="w-3.5 h-3.5" />{errors.title}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">광고 내용 *</label>
              <textarea value={editing.description} onChange={e => { setEditing({ ...editing, description: e.target.value }); setErrors({ ...errors, description: '' }); }} rows={3} placeholder="이벤트 상세 내용을 작성해주세요" className={`w-full border rounded-lg px-3 py-2.5 text-sm resize-none focus:ring-2 focus:outline-none ${errors.description ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'}`} />
              {errors.description && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><CircleAlert className="w-3.5 h-3.5" />{errors.description}</p>}
            </div>
            <div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">시작일 *</label>
                  <input type="date" value={editing.startDate} onChange={e => { setEditing({ ...editing, startDate: e.target.value }); setErrors({ ...errors, startDate: '' }); }} className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:outline-none ${errors.startDate ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'}`} />
                  {errors.startDate && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><CircleAlert className="w-3.5 h-3.5" />{errors.startDate}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">종료일 *</label>
                  <input type="date" value={editing.endDate} onChange={e => { setEditing({ ...editing, endDate: e.target.value }); setErrors({ ...errors, endDate: '' }); }} className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:outline-none ${errors.endDate ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'}`} />
                  {errors.endDate && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><CircleAlert className="w-3.5 h-3.5" />{errors.endDate}</p>}
                </div>
              </div>
              {(() => {
                const days = calcDays(editing.startDate, editing.endDate);
                return days > 0 ? (
                  <p className="text-xs font-semibold text-blue-600 mt-2">{days}일 선택됨</p>
                ) : null;
              })()}
            </div>
            <Field label="연락처" value={editing.contact} onChange={v => setEditing({ ...editing, contact: v })} placeholder="고객 문의용 연락처" />
            <Field label="주소" value={editing.address} onChange={v => setEditing({ ...editing, address: v })} placeholder="이벤트 장소 (선택)" />
            <ImageUpload images={images} onChange={setImages} max={5} label="광고 이미지" />

            <div className="border-t border-gray-100 pt-4">
              <p className="text-xs font-semibold text-gray-400 mb-2">앱 미리보기</p>
              <AdPreviewCard
                title={editing.title}
                description={editing.description}
                period={editing.startDate && editing.endDate ? `${editing.startDate.replace(/-/g, '.')} ~ ${editing.endDate.replace(/-/g, '.').slice(5)}` : ''}
                images={images}
              />
            </div>

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
        {editing && step === 'confirm' && (() => {
          const days = calcDays(editing.startDate, editing.endDate);
          const aptCount = editing.targetApartments.length;
          const totalAmount = PRICE_PER_DAY * days * aptCount;
          return (
            <div className="space-y-4">
              <StepIndicator current={3} />
              <div className="bg-blue-50 rounded-lg p-5">
                <h4 className="text-sm font-bold text-blue-800 mb-3">신청 내용 확인</h4>
                <div className="space-y-2 text-sm">
                  {editing.advertiser && <ConfirmRow label="광고 가게" value={editing.advertiser} />}
                  <ConfirmRow label="광고 제목" value={editing.title} />
                  <ConfirmRow label="기간" value={`${editing.startDate} ~ ${editing.endDate} (${days}일)`} />
                  <ConfirmRow label="내용" value={editing.description} />
                  {editing.contact && <ConfirmRow label="연락처" value={editing.contact} />}
                  <ConfirmRow label="대상 아파트" value={`${aptCount}개 단지`} />
                  <div className="flex flex-wrap gap-1 ml-20">
                    {getAptNames(editing.targetApartments).map((n, i) => (
                      <span key={i} className="text-xs px-1.5 py-0.5 bg-white rounded text-blue-700">{n}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* 요금 계산 */}
              <div className="bg-gray-900 rounded-lg p-5 text-white">
                <h4 className="text-sm font-bold mb-3">예상 광고비</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between text-gray-300">
                    <span>단가</span>
                    <span>{formatMoney(PRICE_PER_DAY)}원 / 건 / 일</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-300">
                    <span>광고 기간</span>
                    <span>{days}일</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-300">
                    <span>대상 아파트</span>
                    <span>{aptCount}개 단지</span>
                  </div>
                  <div className="border-t border-gray-700 my-2" />
                  <div className="flex items-center justify-between text-gray-400 text-xs">
                    <span>계산식</span>
                    <span>{formatMoney(PRICE_PER_DAY)}원 × {days}일 × {aptCount}개</span>
                  </div>
                  <div className="flex items-center justify-between text-lg font-bold pt-1">
                    <span>총 금액</span>
                    <span className="text-blue-400">{formatMoney(totalAmount)}원</span>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-amber-800">결제 안내</p>
                <p className="text-xs text-amber-600 mt-1">
                  신청 후 관리사무소에서 광고 내용을 확인합니다.<br/>
                  확인 완료 후 결제 안내 문자가 발송됩니다.<br/>
                  결제가 완료되면 선택한 아파트 입주민 앱에 즉시 노출됩니다.
                </p>
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={() => setStep('apartments')} className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-500 hover:bg-gray-50 transition">이전</button>
                <button onClick={save} className="flex-1 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition">신청하기</button>
              </div>
            </div>
          );
        })()}
      </Modal>
      </>
      )}
    </div>
  );
};

const StepIndicator: React.FC<{ current: number }> = ({ current }) => (
  <div className="flex items-center justify-center gap-2 pb-2">
    {['광고 정보', '아파트 선택', '확인'].map((label, i) => {
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

const Field: React.FC<{ label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }> = ({ label, value, onChange, type = 'text', placeholder }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-500 mb-1.5">{label}</label>
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
  </div>
);

const ConfirmRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex">
    <span className="text-gray-500 w-20 shrink-0">{label}</span>
    <span className="text-gray-800 font-medium">{value}</span>
  </div>
);
