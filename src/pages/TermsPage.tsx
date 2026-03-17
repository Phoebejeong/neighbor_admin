import React from 'react';

interface Props {
  onClose: () => void;
}

export const TermsPage: React.FC<Props> = ({ onClose }) => (
  <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/50" onClick={onClose} />
    <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col">
      <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-xl">
        <div>
          <h3 className="text-lg font-bold text-gray-900">이용약관</h3>
          <p className="text-xs text-gray-500 mt-0.5">EYEVACS 서비스 이용약관</p>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <div className="overflow-y-auto p-6 sm:p-8 space-y-6 text-sm text-gray-700 leading-relaxed">
      <section>
        <h3 className="text-base font-bold text-gray-900 mb-2">제1조 (목적)</h3>
        <p>본 약관은 주식회사 EYEVACS(이하 "회사")가 제공하는 우리동네 사장님 센터 서비스(이하 "서비스")의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.</p>
      </section>

      <section>
        <h3 className="text-base font-bold text-gray-900 mb-2">제2조 (정의)</h3>
        <ol className="list-decimal ml-5 space-y-1">
          <li>"서비스"란 회사가 제공하는 아파트 단지 인근 상가 광고 및 홍보 플랫폼을 말합니다.</li>
          <li>"이용자"란 본 약관에 따라 서비스를 이용하는 자를 말합니다.</li>
          <li>"콘텐츠"란 이용자가 서비스에 등록하는 가게 정보, 광고, 상품 정보 등 일체의 정보를 말합니다.</li>
        </ol>
      </section>

      <section>
        <h3 className="text-base font-bold text-gray-900 mb-2">제3조 (약관의 효력 및 변경)</h3>
        <ol className="list-decimal ml-5 space-y-1">
          <li>본 약관은 서비스를 이용하고자 하는 모든 이용자에게 적용됩니다.</li>
          <li>회사는 관련 법령을 위배하지 않는 범위에서 약관을 변경할 수 있으며, 변경 시 적용일자 7일 전부터 공지합니다.</li>
          <li>이용자가 변경된 약관에 동의하지 않을 경우 서비스 이용을 중단하고 탈퇴할 수 있습니다.</li>
        </ol>
      </section>

      <section>
        <h3 className="text-base font-bold text-gray-900 mb-2">제4조 (서비스 이용계약의 성립)</h3>
        <ol className="list-decimal ml-5 space-y-1">
          <li>이용계약은 이용자가 본 약관에 동의하고 회원가입을 완료한 시점에 성립됩니다.</li>
          <li>회사는 다음 각 호에 해당하는 경우 가입을 거절하거나 사후에 이용계약을 해지할 수 있습니다.
            <ul className="list-disc ml-5 mt-1 space-y-0.5">
              <li>타인의 정보를 도용한 경우</li>
              <li>허위 정보를 기재한 경우</li>
              <li>관련 법령 또는 본 약관을 위반한 경우</li>
            </ul>
          </li>
        </ol>
      </section>

      <section>
        <h3 className="text-base font-bold text-gray-900 mb-2">제5조 (서비스 내용)</h3>
        <ol className="list-decimal ml-5 space-y-1">
          <li>가게 정보 등록 및 관리</li>
          <li>알짜광고 (배너형 광고) 등록 및 관리</li>
          <li>실속쇼핑 (상품/쿠폰) 등록 및 관리</li>
          <li>광고 성과 통계 제공</li>
        </ol>
      </section>

      <section>
        <h3 className="text-base font-bold text-gray-900 mb-2">제6조 (유료 서비스)</h3>
        <ol className="list-decimal ml-5 space-y-1">
          <li>알짜광고 및 실속쇼핑 등록은 유료 서비스이며, 요금은 별도 안내 페이지에 게시됩니다.</li>
          <li>결제 완료 후 광고가 게시되며, 게시 후에는 환불이 제한될 수 있습니다.</li>
          <li>회원 탈퇴 시 진행 중인 유료 서비스는 즉시 중단되며, 잔여 기간에 대한 환불은 회사 환불 정책에 따릅니다.</li>
        </ol>
      </section>

      <section>
        <h3 className="text-base font-bold text-gray-900 mb-2">제7조 (이용자의 의무)</h3>
        <ol className="list-decimal ml-5 space-y-1">
          <li>이용자는 관련 법령, 본 약관, 서비스 이용 안내 등을 준수하여야 합니다.</li>
          <li>이용자는 허위 또는 타인의 정보를 등록해서는 안 됩니다.</li>
          <li>이용자는 저작권 등 타인의 권리를 침해하는 콘텐츠를 등록해서는 안 됩니다.</li>
        </ol>
      </section>

      <section>
        <h3 className="text-base font-bold text-gray-900 mb-2">제8조 (서비스 중단)</h3>
        <p>회사는 시스템 점검, 장비 교체, 천재지변 등 불가피한 경우 서비스를 일시 중단할 수 있으며, 사전에 공지합니다.</p>
      </section>

      <section>
        <h3 className="text-base font-bold text-gray-900 mb-2">제9조 (계약 해지 및 회원 탈퇴)</h3>
        <ol className="list-decimal ml-5 space-y-1">
          <li>이용자는 언제든지 서비스 내 회원 탈퇴를 통해 이용계약을 해지할 수 있습니다.</li>
          <li>탈퇴 시 등록된 모든 데이터는 즉시 삭제되며, 복구할 수 없습니다.</li>
        </ol>
      </section>

      <section>
        <h3 className="text-base font-bold text-gray-900 mb-2">제10조 (면책)</h3>
        <ol className="list-decimal ml-5 space-y-1">
          <li>회사는 이용자가 등록한 콘텐츠의 정확성, 신뢰성에 대해 책임지지 않습니다.</li>
          <li>회사는 이용자 간 또는 이용자와 제3자 간에 발생한 분쟁에 대해 개입할 의무가 없습니다.</li>
        </ol>
      </section>

      <section>
        <h3 className="text-base font-bold text-gray-900 mb-2">제11조 (분쟁 해결)</h3>
        <p>본 약관과 관련된 분쟁은 대한민국 법률에 따르며, 관할 법원은 회사의 본점 소재지를 관할하는 법원으로 합니다.</p>
      </section>

      <div className="pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-400">시행일: 2025년 1월 1일</p>
      </div>
    </div>

    <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-3 rounded-b-xl">
      <button onClick={onClose} className="w-full py-2.5 rounded-lg bg-[#222] hover:bg-[#333] text-white text-sm font-semibold transition">
        확인
      </button>
    </div>
  </div>
  </div>
);
