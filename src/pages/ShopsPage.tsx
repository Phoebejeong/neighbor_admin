import React, { useState } from 'react';
import { Plus, SquarePen, Trash2 } from 'lucide-react';
import { LocalShop, CATEGORIES, ICONS } from '../data/types';
import { genId } from '../data/utils';
import { Modal } from '../components/Modal';

interface Props {
  shops: LocalShop[];
  setShops: React.Dispatch<React.SetStateAction<LocalShop[]>>;
  readOnly?: boolean;
}

const empty: LocalShop = { id: '', name: '', category: '음식점', icon: 'pizza', tagline: '', phone: '', address: '', lat: 37.4410, lng: 127.1400, weight: 5, isHomeVisible: true, createdAt: '', expiresAt: '', targetApartments: [] };

export const ShopsPage: React.FC<Props> = ({ shops, setShops, readOnly }) => {
  const [editing, setEditing] = useState<LocalShop | null>(null);
  const [open, setOpen] = useState(false);

  const openNew = () => { setEditing({ ...empty }); setOpen(true); };
  const openEdit = (s: LocalShop) => { setEditing({ ...s }); setOpen(true); };
  const close = () => { setOpen(false); setEditing(null); };

  const save = () => {
    if (!editing) return;
    if (editing.id) {
      setShops(prev => prev.map(s => s.id === editing.id ? editing : s));
    } else {
      setShops(prev => [...prev, { ...editing, id: genId('shop'), createdAt: new Date().toISOString().slice(0, 10) }]);
    }
    close();
  };

  const remove = (id: string) => {
    if (!window.confirm('이 상가를 삭제하시겠습니까?')) return;
    setShops(prev => prev.filter(s => s.id !== id));
  };

  const toggle = (id: string) => {
    setShops(prev => prev.map(s => s.id === id ? { ...s, isHomeVisible: !s.isHomeVisible } : s));
  };

  const sorted = [...shops].sort((a, b) => b.weight - a.weight);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold pl-1">이웃상가 관리</h2>
          <p className="text-sm text-gray-500 mt-1">무료 등록 · 관리사무소에서 자유롭게 등록/수정</p>
        </div>
        {!readOnly && (
          <button onClick={openNew} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition">
            <Plus className="w-4 h-4" /> 상가 등록
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {['상호명', '업종', '홍보문구', '연락처', '홈노출', '순위', '등록일', ...(readOnly ? [] : ['액션'])].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map(shop => (
                <tr key={shop.id} className="border-b border-gray-100 hover:bg-blue-50/30 transition">
                  <td className="px-4 py-3.5 font-semibold">{shop.name}</td>
                  <td className="px-4 py-3.5"><span className="px-2 py-1 rounded-md bg-gray-100 text-gray-600 text-xs font-medium">{shop.category}</span></td>
                  <td className="px-4 py-3.5 text-gray-500 max-w-[200px] truncate">{shop.tagline}</td>
                  <td className="px-4 py-3.5 text-gray-500">{shop.phone || '-'}</td>
                  <td className="px-4 py-3.5">
                    <button onClick={() => toggle(shop.id)} className={`w-10 h-5 rounded-full relative transition ${shop.isHomeVisible ? 'bg-blue-500' : 'bg-gray-300'}`}>
                      <span className={`absolute top-0.5 ${shop.isHomeVisible ? 'right-0.5' : 'left-0.5'} w-4 h-4 bg-white rounded-full shadow transition-all`} />
                    </button>
                  </td>
                  <td className="px-4 py-3.5 text-center"><span className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 font-bold text-xs inline-flex items-center justify-center">{shop.weight}</span></td>
                  <td className="px-4 py-3.5 text-gray-400 text-xs">{shop.createdAt}</td>
                  {!readOnly && (
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEdit(shop)} className="p-1.5 rounded-lg hover:bg-blue-100 text-gray-400 hover:text-blue-600 transition"><SquarePen className="w-4 h-4" /></button>
                        <button onClick={() => remove(shop.id)} className="p-1.5 rounded-lg hover:bg-red-100 text-gray-400 hover:text-red-500 transition"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {shops.length === 0 && <p className="text-center text-gray-400 py-8">등록된 이웃상가가 없습니다</p>}
      </div>

      {/* Modal */}
      <Modal open={open} title={editing?.id ? '이웃상가 수정' : '이웃상가 등록'} onClose={close}>
        {editing && (
          <div className="space-y-4">
            <Field label="상호명 *" value={editing.name} onChange={v => setEditing({ ...editing, name: v })} />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">업종 *</label>
                <select value={editing.category} onChange={e => setEditing({ ...editing, category: e.target.value, icon: ICONS[e.target.value] || 'store-outline' })} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <Field label="노출 순위 (1~10)" type="number" value={String(editing.weight)} onChange={v => setEditing({ ...editing, weight: Number(v) || 5 })} />
            </div>
            <Field label="한줄 홍보문구 *" value={editing.tagline} onChange={v => setEditing({ ...editing, tagline: v })} placeholder="예: 매일 점심 세트 20% 할인!" />
            <div className="grid grid-cols-2 gap-3">
              <Field label="전화번호" value={editing.phone} onChange={v => setEditing({ ...editing, phone: v })} placeholder="031-000-0000" />
              <Field label="만료일" type="date" value={editing.expiresAt} onChange={v => setEditing({ ...editing, expiresAt: v })} />
            </div>
            <Field label="주소" value={editing.address} onChange={v => setEditing({ ...editing, address: v })} />
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={editing.isHomeVisible} onChange={e => setEditing({ ...editing, isHomeVisible: e.target.checked })} className="w-4 h-4 rounded" />
              <span className="text-sm text-gray-600">홈 화면에 노출</span>
            </label>
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
