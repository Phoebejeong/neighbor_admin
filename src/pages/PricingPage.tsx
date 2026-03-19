import React from 'react';
import { Check } from 'lucide-react';

interface Props {
  onNavigate: (page: string) => void;
}

export const PricingPage: React.FC<Props> = ({ onNavigate }) => (
  <div>
    <div className="mb-8 text-center">
      <h2 className="text-xl font-bold">광고 요금 안내</h2>
      <p className="text-sm text-stone-500 mt-1">입주민 앱에 가게를 홍보하세요</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl mx-auto">
      {/* 알짜광고 */}
      <div className="glow-card rounded-lg p-6 flex flex-col relative shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold text-white bg-[#7f2929] px-2.5 py-0.5 rounded-full">유료</span>
          <span className="text-xs font-bold text-white bg-[#ED1C24] px-2.5 py-0.5 rounded-full">인기</span>
        </div>
        <h3 className="text-xl font-bold">알짜광고</h3>
        <p className="text-stone-500 text-sm mt-1 mb-4">기간 한정 이벤트 홍보</p>
        <p className="text-3xl font-bold mb-1">50,000<span className="text-base font-medium text-stone-400">원~</span></p>
        <p className="text-xs text-stone-400 mb-6">기간/위치에 따라 변동</p>
        <ul className="space-y-2.5 flex-1">
          <Feature text="이벤트/프로모션 광고" />
          <Feature text="이미지 최대 5장 첨부" />
          <Feature text="시작일/종료일 자동 관리" />
          <Feature text="조회수 실시간 확인" />
          <Feature text="입주민 앱 알짜광고 탭 노출" />
          <Feature text="홈 화면 슬라이더 노출" />
        </ul>
        <button onClick={() => onNavigate('myads')} className="mt-6 w-full py-3 rounded-lg bg-[#222] hover:bg-[#333] text-white text-sm font-semibold transition">
          광고 신청하기
        </button>
      </div>

      {/* 실속쇼핑 */}
      <div className="bg-white rounded-lg p-6 flex flex-col shadow-sm">
        <div className="mb-4">
          <span className="text-xs font-bold text-white bg-[#7f2929] px-2.5 py-0.5 rounded-full">유료</span>
        </div>
        <h3 className="text-xl font-bold">실속쇼핑</h3>
        <p className="text-stone-500 text-sm mt-1 mb-4">입주민 전용 할인 상품</p>
        <p className="text-3xl font-bold mb-1">30,000<span className="text-base font-medium text-stone-400">원~</span></p>
        <p className="text-xs text-stone-400 mb-6">상품당 등록 수수료</p>
        <ul className="space-y-2.5 flex-1">
          <Feature text="할인 상품 등록" />
          <Feature text="상품 이미지 첨부" />
          <Feature text="할인율 / 할인가 자동 표시" />
          <Feature text="입주민 앱 실속쇼핑 탭 노출" />
          <Feature text="홈 화면 노출" />
        </ul>
        <button onClick={() => onNavigate('myshopping')} className="mt-6 w-full py-3 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-sm font-semibold transition">
          상품 등록하기
        </button>
      </div>
    </div>

  </div>
);

const Feature: React.FC<{ text: string }> = ({ text }) => (
  <li className="flex items-center gap-2 text-sm text-stone-600">
    <Check className="w-4 h-4 text-[#ED1C24] shrink-0" />
    {text}
  </li>
);
