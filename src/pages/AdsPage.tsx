import React, { useState } from 'react';
import { Plus, SquarePen, Trash2 } from 'lucide-react';
import { LocalAd } from '../data/types';
import { getAdStatus, formatMoney, genId } from '../data/utils';
import { Modal } from '../components/Modal';

interface Props {
  ads: LocalAd[];
  setAds: React.Dispatch<React.SetStateAction<LocalAd[]>>;
  readOnly?: boolean;
}

const empty: LocalAd = { id: '', title: '', description: '', advertiser: '', period: '', startDate: '', endDate: '', contact: '', address: '', amount: 0, paymentStatus: 'paid', viewCount: 0, createdAt: '', targetApartments: [] };

export const AdsPage: React.FC<Props> = ({ ads, setAds, readOnly }) => {
  const [editing, setEditing] = useState<LocalAd | null>(null);
  const [open, setOpen] = useState(false);

  const openNew = () => { setEditing({ ...empty }); setOpen(true); };
  const openEdit = (a: LocalAd) => { setEditing({ ...a }); setOpen(true); };
  const close = () => { setOpen(false); setEditing(null); };

  const save = () => {
    if (!editing) return;
    const s = editing.startDate.replace(/-/g, '.');
    const e = editing.endDate.replace(/-/g, '.').slice(5);
    const withPeriod = { ...editing, period: `${s} ~ ${e}` };
    if (editing.id) {
      setAds(prev => prev.map(a => a.id === editing.id ? withPeriod : a));
    } else {
      setAds(prev => [...prev, { ...withPeriod, id: genId('ad'), viewCount: 0, createdAt: new Date().toISOString().slice(0, 10) }]);
    }
    close();
  };

  const remove = (id: string) => {
    if (!window.confirm('이 광고를 삭제하시겠습니까?')) return;
    setAds(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold pl-1">알짜광고 관리</h2>
          <p className="text-sm text-gray-500 mt-1">유료 광고 · 기간별 이벤트/프로모션 관리</p>
        </div>
        {!readOnly && (
          <button onClick={openNew} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition">
            <Plus className="w-4 h-4" /> 광고 등록
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {['광고 제목', '광고주', '상태', '기간', '조회수', '광고비', '결제', ...(readOnly ? [] : ['액션'])].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ads.map(ad => {
                const st = getAdStatus(ad);
                return (
                  <tr key={ad.id} className="border-b border-gray-100 hover:bg-blue-50/30 transition">
                    <td className="px-4 py-3.5 font-semibold max-w-[200px] truncate">{ad.title}</td>
                    <td className="px-4 py-3.5 text-gray-500">{ad.advertiser}</td>
                    <td className="px-4 py-3.5"><span className={`text-xs font-semibold ${st.cls}`}>{st.label}</span></td>
                    <td className="px-4 py-3.5 text-gray-500 text-xs">{ad.period}</td>
                    <td className="px-4 py-3.5 font-semibold text-center">{formatMoney(ad.viewCount)}</td>
                    <td className="px-4 py-3.5 font-semibold text-right">{formatMoney(ad.amount)}원</td>
                    <td className="px-4 py-3.5">
                      <span className={`text-xs font-medium ${ad.paymentStatus === 'paid' ? 'text-emerald-600' : 'text-red-500'}`}>
                        {ad.paymentStatus === 'paid' ? '결제완료' : '미결제'}
                      </span>
                    </td>
                    {!readOnly && (
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1">
                          <button onClick={() => openEdit(ad)} className="p-1.5 rounded-lg hover:bg-blue-100 text-gray-400 hover:text-blue-600 transition"><SquarePen className="w-4 h-4" /></button>
                          <button onClick={() => remove(ad.id)} className="p-1.5 rounded-lg hover:bg-red-100 text-gray-400 hover:text-red-500 transition"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={open} title={editing?.id ? '알짜광고 수정' : '알짜광고 등록'} onClose={close}>
        {editing && (
          <div className="space-y-4">
            <Field label="광고 제목 *" value={editing.title} onChange={v => setEditing({ ...editing, title: v })} />
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">광고 설명 *</label>
              <textarea value={editing.description} onChange={e => setEditing({ ...editing, description: e.target.value })} rows={3} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="광고주명 *" value={editing.advertiser} onChange={v => setEditing({ ...editing, advertiser: v })} />
              <Field label="연락처" value={editing.contact} onChange={v => setEditing({ ...editing, contact: v })} />
            </div>
            <Field label="주소" value={editing.address} onChange={v => setEditing({ ...editing, address: v })} />
            <div className="grid grid-cols-2 gap-3">
              <Field label="시작일 *" type="date" value={editing.startDate} onChange={v => setEditing({ ...editing, startDate: v })} />
              <Field label="종료일 *" type="date" value={editing.endDate} onChange={v => setEditing({ ...editing, endDate: v })} />
            </div>
            <div className="border-t border-gray-100 pt-4">
              <p className="text-xs font-bold text-gray-400 uppercase mb-3">결제 정보</p>
              <div className="grid grid-cols-2 gap-3">
                <Field label="광고 금액 (원)" type="number" value={String(editing.amount)} onChange={v => setEditing({ ...editing, amount: Number(v) || 0 })} />
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">결제 상태</label>
                  <select value={editing.paymentStatus} onChange={e => setEditing({ ...editing, paymentStatus: e.target.value as any })} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm">
                    <option value="paid">결제완료</option>
                    <option value="unpaid">미결제</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button onClick={close} className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-500 hover:bg-gray-50 transition">취소</button>
              <button onClick={save} className="flex-1 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition">{editing.id ? '저장' : '등록하기'}</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

const Field: React.FC<{ label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }> = ({ label, value, onChange, type = 'text', placeholder }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-500 mb-1.5">{label}</label>
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
  </div>
);
