import React from 'react';
import { LocalAd, ShoppingItem } from '../data/types';
import { getAdStatus, formatMoney } from '../data/utils';
import { Eye, DollarSign, Clock, CircleCheck, Megaphone, ShoppingBag, Store } from 'lucide-react';

interface Props {
  ads: LocalAd[];
  shopping: ShoppingItem[];
  onNavigate: (page: string) => void;
}

export const StatsPage: React.FC<Props> = ({ ads, shopping, onNavigate }) => {
  const totalViews = ads.reduce((s, a) => s + (a.viewCount || 0), 0);
  const activeAds = ads.filter(a => getAdStatus(a).label === '진행중').length;
  const paidAds = ads.filter(a => a.paymentStatus === 'paid').length;
  const paidItems = shopping.filter(i => i.paymentStatus === 'paid').length;
  const hasData = ads.length > 0 || shopping.length > 0;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold">광고 성과</h2>
        <p className="text-sm text-gray-500 mt-1">내 광고와 상품의 현황을 확인하세요</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={<Eye className="w-6 h-6 text-blue-500" />} label="총 조회수" value={`${formatMoney(totalViews)}회`} />
        <StatCard icon={<Clock className="w-6 h-6 text-emerald-500" />} label="진행중 광고" value={`${activeAds}개`} />
        <StatCard icon={<CircleCheck className="w-6 h-6 text-purple-500" />} label="결제완료 광고" value={`${paidAds} / ${ads.length}개`} />
        <StatCard icon={<DollarSign className="w-6 h-6 text-amber-500" />} label="노출 중 상품" value={`${paidItems} / ${shopping.length}개`} />
      </div>

      {/* 빈 상태: 시작 가이드 */}
      {!hasData && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <GuideCard
            icon={<Store className="w-5 h-5" />}
            title="이웃상가 등록"
            desc="가게 기본 정보를 무료로 등록하세요"
            color="emerald"
            onClick={() => onNavigate('myshop')}
          />
          <GuideCard
            icon={<Megaphone className="w-5 h-5" />}
            title="알짜광고 신청"
            desc="기간 한정 이벤트를 홍보하세요"
            color="blue"
            onClick={() => onNavigate('myads')}
          />
          <GuideCard
            icon={<ShoppingBag className="w-5 h-5" />}
            title="실속쇼핑 등록"
            desc="입주민 전용 할인 상품을 등록하세요"
            color="purple"
            onClick={() => onNavigate('myshopping')}
          />
        </div>
      )}

      {/* Ad Performance */}
      <div className="bg-white rounded-lg shadow-sm p-5 mb-6">
        <h3 className="text-base font-bold text-gray-800 mb-4">광고별 성과</h3>
        {ads.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">등록한 광고가 없습니다</p>
        ) : (
          <div className="space-y-4">
            {[...ads].sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0)).map(ad => {
              const st = getAdStatus(ad);
              const maxViews = Math.max(...ads.map(a => a.viewCount || 1));
              const pct = Math.round(((ad.viewCount || 0) / maxViews) * 100);
              return (
                <div key={ad.id}>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <div className="sm:w-52 shrink-0">
                      <p className="text-sm font-bold text-gray-900 truncate">{ad.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs font-bold ${st.cls}`}>{st.label}</span>
                        <span className="text-xs font-semibold text-gray-500">{ad.period}</span>
                      </div>
                    </div>
                    <div className="flex-1 flex items-center gap-3">
                      <div className="flex-1">
                        <div className="w-full h-7 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                      <span className="text-sm font-bold text-gray-800 w-20 text-right">{formatMoney(ad.viewCount)}회</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Shopping Status */}
      <div className="bg-white rounded-lg shadow-sm p-5">
        <h3 className="text-base font-bold text-gray-800 mb-4">상품 현황</h3>
        {shopping.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">등록한 상품이 없습니다</p>
        ) : (
          <div className="space-y-3">
            {shopping.map(item => {
              const dp = item.discountRate ? Math.round(item.price * (1 - item.discountRate / 100)) : item.price;
              return (
                <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-gray-100 last:border-0 gap-2">
                  <div>
                    <p className="text-sm font-bold text-gray-900">{item.name}</p>
                    <p className="text-xs font-semibold text-gray-500 mt-0.5">{item.shopName}</p>
                  </div>
                  <div className="flex items-center gap-3 sm:text-right">
                    <p className="text-sm font-bold text-gray-900">{formatMoney(dp)}원 {item.discountRate > 0 && <span className="text-red-500 font-bold">({item.discountRate}%)</span>}</p>
                    <span className={`text-xs font-bold ${item.paymentStatus === 'paid' ? 'text-emerald-600' : 'text-red-500'}`}>
                      {item.paymentStatus === 'paid' ? '노출 중' : '결제대기'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="bg-white rounded-lg p-5 shadow-sm">
    <div className="flex items-center gap-3">
      {icon}
      <div>
        <p className="text-xs text-gray-400 font-medium">{label}</p>
        <p className="text-lg font-bold mt-0.5">{value}</p>
      </div>
    </div>
  </div>
);

const colorMap: Record<string, { border: string; hoverBg: string; hoverText: string; iconText: string }> = {
  emerald: { border: 'border-gray-200 hover:border-emerald-500', hoverBg: 'hover:bg-emerald-50', hoverText: 'group-hover:text-emerald-600', iconText: 'group-hover:text-emerald-500' },
  blue: { border: 'border-gray-200 hover:border-blue-500', hoverBg: 'hover:bg-blue-50', hoverText: 'group-hover:text-blue-600', iconText: 'group-hover:text-blue-500' },
  purple: { border: 'border-gray-200 hover:border-purple-500', hoverBg: 'hover:bg-purple-50', hoverText: 'group-hover:text-purple-600', iconText: 'group-hover:text-purple-500' },
};

const GuideCard: React.FC<{ icon: React.ReactNode; title: string; desc: string; color: string; onClick: () => void }> = ({ icon, title, desc, color, onClick }) => {
  const c = colorMap[color] || colorMap.blue;
  return (
    <button onClick={onClick} className={`bg-white rounded-lg border ${c.border} ${c.hoverBg} p-5 text-left transition-all group`}>
      <div className={`text-gray-400 ${c.iconText} transition mb-3`}>{icon}</div>
      <h4 className={`text-sm font-bold text-gray-800 ${c.hoverText} transition`}>{title}</h4>
      <p className="text-xs text-gray-500 mt-1">{desc}</p>
    </button>
  );
};
