import React, { useState } from 'react';
import { Plus, SquarePen, Trash2 } from 'lucide-react';
import { ShoppingItem } from '../data/types';
import { formatMoney, genId } from '../data/utils';
import { Modal } from '../components/Modal';

interface Props {
  items: ShoppingItem[];
  setItems: React.Dispatch<React.SetStateAction<ShoppingItem[]>>;
  readOnly?: boolean;
}

const empty: ShoppingItem = { id: '', name: '', price: 0, discountRate: 0, shopName: '', amount: 0, paymentStatus: 'paid', viewCount: 0, createdAt: '', targetApartments: [] };

export const ShoppingPage: React.FC<Props> = ({ items, setItems, readOnly }) => {
  const [editing, setEditing] = useState<ShoppingItem | null>(null);
  const [open, setOpen] = useState(false);

  const openNew = () => { setEditing({ ...empty }); setOpen(true); };
  const openEdit = (i: ShoppingItem) => { setEditing({ ...i }); setOpen(true); };
  const close = () => { setOpen(false); setEditing(null); };

  const save = () => {
    if (!editing) return;
    if (editing.id) {
      setItems(prev => prev.map(i => i.id === editing.id ? editing : i));
    } else {
      setItems(prev => [...prev, { ...editing, id: genId('item'), createdAt: new Date().toISOString().slice(0, 10) }]);
    }
    close();
  };

  const remove = (id: string) => {
    if (!window.confirm('이 상품을 삭제하시겠습니까?')) return;
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const discountedPrice = editing ? Math.round(editing.price * (1 - (editing.discountRate || 0) / 100)) : 0;
  const savedAmount = editing ? editing.price - discountedPrice : 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold pl-1">실속쇼핑 관리</h2>
          <p className="text-sm text-stone-500 mt-1">유료 등록 · 입주민 전용 할인 상품 관리</p>
        </div>
        {!readOnly && (
          <button onClick={openNew} className="bg-[#222] hover:bg-[#333] text-white px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition">
            <Plus className="w-4 h-4" /> 상품 등록
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200">
                {['상품명', '판매처', '가격', '조회수', '등록비', '결제', '등록일', ...(readOnly ? [] : ['액션'])].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-semibold text-stone-500 text-xs uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map(item => {
                const dp = item.discountRate ? Math.round(item.price * (1 - item.discountRate / 100)) : item.price;
                return (
                  <tr key={item.id} className="border-b border-stone-100 hover:bg-[#FDF2F2]/30 transition">
                    <td className="px-4 py-3.5 font-semibold">{item.name}</td>
                    <td className="px-4 py-3.5 text-stone-500">{item.shopName}</td>
                    <td className="px-4 py-3.5">
                      {item.discountRate > 0 ? (
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-stone-400 line-through text-xs">{formatMoney(item.price)}원</span>
                          <span className="text-red-500 font-bold text-xs">{item.discountRate}%</span>
                          <span className="font-bold">{formatMoney(dp)}원</span>
                        </div>
                      ) : (
                        <span className="font-bold">{formatMoney(item.price)}원</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-right font-semibold text-stone-700">{formatMoney(item.viewCount)}회</td>
                    <td className="px-4 py-3.5 text-right font-semibold">{formatMoney(item.amount)}원</td>
                    <td className="px-4 py-3.5">
                      <span className={`text-xs font-medium ${item.paymentStatus === 'paid' ? 'text-emerald-500' : 'text-red-500'}`}>
                        {item.paymentStatus === 'paid' ? '결제완료' : '미결제'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-stone-400 text-xs">{item.createdAt}</td>
                    {!readOnly && (
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1">
                          <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg hover:bg-[#FDF2F2] text-stone-400 hover:text-[#7f2929] transition"><SquarePen className="w-4 h-4" /></button>
                          <button onClick={() => remove(item.id)} className="p-1.5 rounded-lg hover:bg-red-100 text-stone-400 hover:text-red-500 transition"><Trash2 className="w-4 h-4" /></button>
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

      <Modal open={open} title={editing?.id ? '상품 수정' : '상품 등록'} onClose={close}>
        {editing && (
          <div className="space-y-4">
            <Field label="상품명 *" value={editing.name} onChange={v => setEditing({ ...editing, name: v })} />
            <Field label="판매처 *" value={editing.shopName} onChange={v => setEditing({ ...editing, shopName: v })} />
            <div className="grid grid-cols-2 gap-3">
              <Field label="정가 (원) *" type="number" value={String(editing.price)} onChange={v => setEditing({ ...editing, price: Number(v) || 0 })} />
              <Field label="할인율 (%)" type="number" value={String(editing.discountRate)} onChange={v => setEditing({ ...editing, discountRate: Number(v) || 0 })} />
            </div>
            {editing.price > 0 && (
              <div className="bg-[#FDF2F2] rounded-lg p-3 text-sm text-[#6B2222] font-medium">
                할인가: <strong>{formatMoney(discountedPrice)}원</strong>
                {savedAmount > 0 && ` (${formatMoney(savedAmount)}원 절약)`}
              </div>
            )}
            <div className="border-t border-stone-100 pt-4">
              <p className="text-xs font-bold text-stone-400 uppercase mb-3">결제 정보</p>
              <div className="grid grid-cols-2 gap-3">
                <Field label="등록 수수료 (원)" type="number" value={String(editing.amount)} onChange={v => setEditing({ ...editing, amount: Number(v) || 0 })} />
                <div>
                  <label className="block text-xs font-semibold text-stone-500 mb-1.5">결제 상태</label>
                  <select value={editing.paymentStatus} onChange={e => setEditing({ ...editing, paymentStatus: e.target.value as any })} className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm">
                    <option value="paid">결제완료</option>
                    <option value="unpaid">미결제</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button onClick={close} className="flex-1 py-2.5 rounded-lg border border-stone-200 text-sm font-medium text-stone-500 hover:bg-stone-50 transition">취소</button>
              <button onClick={save} className="flex-1 py-2.5 rounded-lg bg-[#222] hover:bg-[#333] text-white text-sm font-semibold transition">{editing.id ? '저장' : '등록하기'}</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

const Field: React.FC<{ label: string; value: string; onChange: (v: string) => void; type?: string }> = ({ label, value, onChange, type = 'text' }) => (
  <div>
    <label className="block text-xs font-semibold text-stone-500 mb-1.5">{label}</label>
    <input type={type} value={value} onChange={e => onChange(e.target.value)} className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#7f2929] focus:outline-none" />
  </div>
);
