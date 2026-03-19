import React from 'react';

interface Props {
  title: string;
  children: React.ReactNode;
}

export const MobilePreview: React.FC<Props> = ({ title, children }) => (
  <div className="flex flex-col items-center">
    <p className="text-xs font-semibold text-stone-400 mb-2">앱에서 이렇게 보여요</p>
    <div className="w-[320px] border-[3px] border-stone-800 rounded-[2rem] overflow-hidden shadow-xl bg-white">
      {/* Status bar */}
      <div className="bg-stone-900 text-white text-[10px] flex items-center justify-between px-6 py-1.5">
        <span>9:41</span>
        <div className="flex items-center gap-1">
          <span>●●●●</span>
          <span>🔋</span>
        </div>
      </div>
      {/* Header */}
      <div className="bg-white px-4 py-3 border-b border-stone-100">
        <p className="text-xs font-bold text-stone-900">{title}</p>
      </div>
      {/* Content */}
      <div className="bg-stone-50 min-h-[200px] max-h-[400px] overflow-y-auto">
        {children}
      </div>
      {/* Bottom bar */}
      <div className="bg-white border-t border-stone-100 py-2 px-4 flex justify-around">
        {['홈', '걷기', '출입', '단지', '우리동네'].map(t => (
          <span key={t} className={`text-[9px] ${t === '우리동네' ? 'text-[#7f2929] font-bold' : 'text-stone-400'}`}>{t}</span>
        ))}
      </div>
    </div>
  </div>
);

export const ShopPreviewCard: React.FC<{ name: string; category: string; tagline: string; phone?: string; address?: string }> = ({ name, category, tagline, phone, address }) => (
  <div className="mx-3 my-1.5 bg-white rounded-xl p-3 shadow-sm">
    <div className="flex items-center gap-2.5">
      <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center text-lg">🏪</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold">{name || '상호명'}</span>
          <span className="text-[9px] text-stone-400">{category}</span>
        </div>
        <p className="text-[10px] text-stone-500 truncate mt-0.5">{tagline || '홍보문구를 입력해주세요'}</p>
        {address && <p className="text-[9px] text-stone-400 mt-0.5">📍 {address}</p>}
      </div>
      {phone && (
        <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center">
          <span className="text-[10px]">📞</span>
        </div>
      )}
    </div>
  </div>
);

export const AdPreviewCard: React.FC<{ title: string; description: string; period: string; images?: string[] }> = ({ title, description, period, images }) => (
  <div className="mx-3 my-1.5 bg-white rounded-xl p-3 shadow-sm">
    <div className="flex gap-2.5">
      <div className="w-12 h-12 rounded-lg bg-stone-100 flex items-center justify-center overflow-hidden shrink-0">
        {images && images.length > 0 ? (
          <img src={images[0]} alt="" className="w-full h-full object-cover" />
        ) : (
          <span className="text-lg">📢</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-xs font-bold">{title || '광고 제목'}</span>
        <p className="text-[10px] text-stone-500 truncate mt-0.5">{description || '광고 내용'}</p>
        <div className="flex items-center gap-1.5 mt-1">
          <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 font-bold">진행중</span>
          <span className="text-[9px] text-stone-400">📅 {period || '기간 미정'}</span>
        </div>
      </div>
    </div>
  </div>
);

export const ShoppingPreviewCard: React.FC<{ name: string; price: number; discountRate: number; shopName: string; image?: string }> = ({ name, price, discountRate, shopName, image }) => {
  const dp = discountRate ? Math.round(price * (1 - discountRate / 100)) : price;
  return (
    <div className="bg-white rounded-xl p-2.5 shadow-sm">
      <div className="w-full h-16 rounded-lg bg-stone-100 flex items-center justify-center overflow-hidden mb-1.5">
        {image ? <img src={image} alt="" className="w-full h-full object-cover" /> : <span className="text-stone-300 text-lg">🛒</span>}
      </div>
      <p className="text-[10px] font-semibold truncate">{name || '상품명'}</p>
      <div className="flex items-center gap-1 mt-0.5">
        {discountRate > 0 && <span className="text-[10px] font-bold text-red-500">{discountRate}%</span>}
        <span className="text-[11px] font-bold">{dp.toLocaleString()}원</span>
      </div>
      <p className="text-[8px] text-stone-400 mt-0.5">{shopName}</p>
    </div>
  );
};
