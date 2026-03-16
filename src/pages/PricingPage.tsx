import React from 'react';
import { CheckIcon } from '@heroicons/react/24/outline';

interface Props {
  onNavigate: (page: string) => void;
}

export const PricingPage: React.FC<Props> = ({ onNavigate }) => (
  <div>
    <div className="mb-6 text-center">
      <h2 className="text-xl font-extrabold pl-1">광고 요금 안내</h2>
      <p className="text-sm text-gray-500 mt-1">입주민 앱에 가게를 홍보하세요</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
      {/* 이웃상가 */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6 flex flex-col">
        <div className="mb-4">
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">무료</span>
        </div>
        <h3 className="text-xl font-extrabold">이웃상가</h3>
        <p className="text-gray-500 text-sm mt-1 mb-4">기본 가게 정보 등록</p>
        <p className="text-3xl font-extrabold mb-6">0<span className="text-base font-medium text-gray-400">원</span></p>
        <ul className="space-y-2.5 flex-1">
          <Feature text="상호명 / 업종 / 연락처 등록" />
          <Feature text="한줄 홍보문구" />
          <Feature text="전화 연결 / 지도 연동" />
          <Feature text="홈 화면 슬라이더 노출" />
          <Feature text="무제한 게시 기간" />
        </ul>
        <button onClick={() => onNavigate('myshop')} className="mt-6 w-full py-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold transition">
          가게 등록하기
        </button>
      </div>

      {/* 알짜광고 */}
      <div className="bg-white rounded-xl border-2 border-blue-500 p-6 flex flex-col relative shadow-lg shadow-blue-100">
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="text-xs font-bold text-white bg-blue-600 px-3 py-1 rounded-full">인기</span>
        </div>
        <div className="mb-4">
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">유료</span>
        </div>
        <h3 className="text-xl font-extrabold">알짜광고</h3>
        <p className="text-gray-500 text-sm mt-1 mb-4">기간 한정 이벤트 홍보</p>
        <p className="text-3xl font-extrabold mb-1">50,000<span className="text-base font-medium text-gray-400">원~</span></p>
        <p className="text-xs text-gray-400 mb-6">기간/위치에 따라 변동</p>
        <ul className="space-y-2.5 flex-1">
          <Feature text="이벤트/프로모션 광고" />
          <Feature text="이미지 최대 5장 첨부" />
          <Feature text="시작일/종료일 자동 관리" />
          <Feature text="조회수 실시간 확인" />
          <Feature text="입주민 앱 알짜광고 탭 노출" />
          <Feature text="홈 화면 슬라이더 노출" />
        </ul>
        <button onClick={() => onNavigate('myads')} className="mt-6 w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition">
          광고 신청하기
        </button>
      </div>

      {/* 실속쇼핑 */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6 flex flex-col">
        <div className="mb-4">
          <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-full">유료</span>
        </div>
        <h3 className="text-xl font-extrabold">실속쇼핑</h3>
        <p className="text-gray-500 text-sm mt-1 mb-4">입주민 전용 할인 상품</p>
        <p className="text-3xl font-extrabold mb-1">30,000<span className="text-base font-medium text-gray-400">원~</span></p>
        <p className="text-xs text-gray-400 mb-6">상품당 등록 수수료</p>
        <ul className="space-y-2.5 flex-1">
          <Feature text="할인 상품 등록" />
          <Feature text="상품 이미지 첨부" />
          <Feature text="할인율 / 할인가 자동 표시" />
          <Feature text="입주민 앱 실속쇼핑 탭 노출" />
          <Feature text="홈 화면 노출" />
        </ul>
        <button onClick={() => onNavigate('myshopping')} className="mt-6 w-full py-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold transition">
          상품 등록하기
        </button>
      </div>
    </div>

    <div className="mt-10 bg-gray-50 rounded-xl p-6 max-w-4xl mx-auto">
      <h4 className="text-base font-bold text-gray-800 mb-3">자주 묻는 질문</h4>
      <div className="space-y-3 text-sm">
        <QA q="광고비는 어떻게 결제하나요?" a="광고 신청 후 관리사무소에서 결제 안내 문자를 발송합니다. 계좌이체 또는 카드 결제가 가능합니다." />
        <QA q="광고 기간을 연장할 수 있나요?" a="네, 종료일 전에 연장 신청이 가능합니다. 기존 광고를 수정하여 종료일을 변경해주세요." />
        <QA q="환불 규정은 어떻게 되나요?" a="광고 시작일 이전 취소 시 전액 환불, 시작 후 취소 시 잔여 기간에 대해 일할 계산하여 환불합니다." />
      </div>
    </div>
  </div>
);

const Feature: React.FC<{ text: string }> = ({ text }) => (
  <li className="flex items-center gap-2 text-sm text-gray-600">
    <CheckIcon className="w-4 h-4 text-blue-500 shrink-0" />
    {text}
  </li>
);

const QA: React.FC<{ q: string; a: string }> = ({ q, a }) => (
  <div>
    <p className="font-semibold text-gray-700">Q. {q}</p>
    <p className="text-gray-500 mt-0.5">A. {a}</p>
  </div>
);
