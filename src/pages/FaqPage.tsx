import React, { useState } from 'react';
import { ChevronDownIcon, PhoneIcon, EnvelopeIcon, ClockIcon } from '@heroicons/react/24/outline';

export const FaqPage: React.FC = () => {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-extrabold pl-1">고객센터</h2>
        <p className="text-sm text-gray-500 mt-1">궁금한 점이 있으시면 아래를 확인해주세요</p>
      </div>

      {/* Contact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
            <PhoneIcon className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">전화 문의</p>
            <p className="text-sm font-bold text-gray-900 mt-0.5">031-000-0000</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
            <EnvelopeIcon className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">이메일 문의</p>
            <p className="text-sm font-bold text-gray-900 mt-0.5">admin@eyevacs.com</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
            <ClockIcon className="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">운영 시간</p>
            <p className="text-sm font-bold text-gray-900 mt-0.5">평일 09:00 ~ 18:00</p>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="text-base font-bold text-gray-800">자주 묻는 질문</h3>
        </div>
        <div className="divide-y divide-gray-100">
          <FaqItem q="이웃상가 등록은 정말 무료인가요?" a="네, 이웃상가 등록은 완전 무료입니다. 상호명, 연락처, 주소, 홍보문구 등 기본 정보를 등록하시면 입주민 앱에 노출됩니다." />
          <FaqItem q="알짜광고와 이웃상가의 차이점이 뭔가요?" a="이웃상가는 상시 노출되는 기본 정보이고, 알짜광고는 기간 한정 이벤트/프로모션을 홍보하는 유료 서비스입니다. 알짜광고는 이미지와 상세 설명을 포함할 수 있고, 조회수를 확인할 수 있습니다." />
          <FaqItem q="광고비는 어떻게 결제하나요?" a="광고 신청 후 관리사무소에서 결제 안내 문자를 발송합니다. 계좌이체 또는 카드 결제가 가능합니다. 결제가 완료되면 자동으로 앱에 노출됩니다." />
          <FaqItem q="광고 기간을 연장할 수 있나요?" a="네, 가능합니다. '알짜광고' 메뉴에서 해당 광고를 수정하여 종료일을 변경해주세요. 연장 기간에 대한 추가 요금이 발생합니다." />
          <FaqItem q="등록한 정보는 언제 앱에 반영되나요?" a="이웃상가는 등록 즉시 반영됩니다. 알짜광고와 실속쇼핑은 결제 완료 후 즉시 노출됩니다." />
          <FaqItem q="환불 규정은 어떻게 되나요?" a="광고 시작일 이전 취소 시 전액 환불됩니다. 시작 후 취소 시 잔여 기간에 대해 일할 계산하여 환불합니다. 환불 요청은 관리사무소로 연락주세요." />
          <FaqItem q="이미지는 몇 장까지 올릴 수 있나요?" a="알짜광고는 최대 5장, 실속쇼핑은 상품당 1장의 이미지를 업로드할 수 있습니다. 이미지 크기는 5MB 이하를 권장합니다." />
          <FaqItem q="계정을 삭제하고 싶어요" a="관리사무소(031-000-0000)로 연락주시면 계정 삭제를 도와드립니다. 삭제 시 등록된 모든 정보가 함께 삭제됩니다." />
        </div>
      </div>
    </div>
  );
};

const FaqItem: React.FC<{ q: string; a: string }> = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition">
        <span className="text-sm font-bold text-gray-800 pr-4">Q. {q}</span>
        <ChevronDownIcon className={`w-5 h-5 text-gray-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-5 pb-4 -mt-1">
          <p className="text-sm text-gray-500 leading-relaxed pl-4 border-l-2 border-blue-300">A. {a}</p>
        </div>
      )}
    </div>
  );
};
