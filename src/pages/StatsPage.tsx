import React from 'react';
import { LocalAd, ShoppingItem } from '../data/types';
import { getAdStatus, formatMoney } from '../data/utils';
import { EyeIcon, CurrencyDollarIcon, ClockIcon, CheckCircleIcon, MegaphoneIcon, ShoppingBagIcon, BuildingStorefrontIcon } from '@heroicons/react/24/outline';

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
        <h2 className="text-xl font-extrabold pl-1">광고 성과</h2>
        <p className="text-sm text-gray-500 mt-1">내 광고와 상품의 현황을 확인하세요</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={<EyeIcon className="w-6 h-6 text-blue-500" />} label="총 조회수" value={`${formatMoney(totalViews)}회`} bg="bg-blue-50" />
        <StatCard icon={<ClockIcon className="w-6 h-6 text-emerald-500" />} label="진행중 광고" value={`${activeAds}개`} bg="bg-emerald-50" />
        <StatCard icon={<CheckCircleIcon className="w-6 h-6 text-purple-500" />} label="결제완료 광고" value={`${paidAds} / ${ads.length}개`} bg="bg-purple-50" />
        <StatCard icon={<CurrencyDollarIcon className="w-6 h-6 text-amber-500" />} label="노출 중 상품" value={`${paidItems} / ${shopping.length}개`} bg="bg-amber-50" />
      </div>

      {/* 빈 상태: 시작 가이드 */}
      {!hasData && (
        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
          <div className="text-center mb-6">
            <p className="text-4xl mb-2">🚀</p>
            <h3 className="text-lg font-extrabold text-gray-900">시작해볼까요?</h3>
            <p className="text-sm text-gray-500 mt-1">아래 서비스를 이용하면 여기에 성과가 표시됩니다</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <GuideCard
              icon={<BuildingStorefrontIcon className="w-8 h-8 text-emerald-500" />}
              title="이웃상가 등록"
              desc="가게 기본 정보를 무료로 등록하세요"
              tag="무료"
              tagCls="bg-emerald-100 text-emerald-600"
              onClick={() => onNavigate('myshop')}
            />
            <GuideCard
              icon={<MegaphoneIcon className="w-8 h-8 text-blue-500" />}
              title="알짜광고 신청"
              desc="기간 한정 이벤트를 홍보하세요"
              tag="유료"
              tagCls="bg-blue-100 text-blue-600"
              onClick={() => onNavigate('myads')}
            />
            <GuideCard
              icon={<ShoppingBagIcon className="w-8 h-8 text-purple-500" />}
              title="실속쇼핑 등록"
              desc="입주민 전용 할인 상품을 등록하세요"
              tag="유료"
              tagCls="bg-purple-100 text-purple-600"
              onClick={() => onNavigate('myshopping')}
            />
          </div>
        </div>
      )}

      {/* Ad Performance */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
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
                        <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${st.cls}`}>{st.label}</span>
                        <span className="text-xs font-semibold text-gray-500">{ad.period}</span>
                      </div>
                    </div>
                    <div className="flex-1 flex items-center gap-3">
                      <div className="flex-1">
                        <div className="w-full h-7 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                      <span className="text-sm font-extrabold text-gray-800 w-20 text-right">{formatMoney(ad.viewCount)}회</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Shopping Status */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
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
                    <p className="text-sm font-extrabold text-gray-900">{formatMoney(dp)}원 {item.discountRate > 0 && <span className="text-red-500 font-bold">({item.discountRate}%)</span>}</p>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${item.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
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

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string; bg: string }> = ({ icon, label, value, bg }) => (
  <div className="bg-white rounded-xl p-5 border border-gray-200">
    <div className="flex items-center gap-3">
      <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center`}>{icon}</div>
      <div>
        <p className="text-xs text-gray-400 font-medium">{label}</p>
        <p className="text-xl font-extrabold mt-0.5">{value}</p>
      </div>
    </div>
  </div>
);

const GuideCard: React.FC<{ icon: React.ReactNode; title: string; desc: string; tag: string; tagCls: string; onClick: () => void }> = ({ icon, title, desc, tag, tagCls, onClick }) => (
  <button onClick={onClick} className="bg-gray-50 hover:bg-gray-100 rounded-xl p-5 text-left transition group">
    <div className="flex items-center gap-3 mb-3">
      {icon}
      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${tagCls}`}>{tag}</span>
    </div>
    <h4 className="text-sm font-bold text-gray-800 group-hover:text-blue-600 transition">{title}</h4>
    <p className="text-xs text-gray-500 mt-1">{desc}</p>
  </button>
);
