import React from 'react';

interface Props {
  onClose: () => void;
}

export const PrivacyPage: React.FC<Props> = ({ onClose }) => (
  <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/50" onClick={onClose} />
    <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col">
      <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-xl">
        <div>
          <h3 className="text-lg font-bold text-gray-900">개인정보처리방침</h3>
          <p className="text-xs text-gray-500 mt-0.5">EYEVACS 개인정보처리방침</p>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <div className="overflow-y-auto p-6 sm:p-8 space-y-6 text-sm text-gray-700 leading-relaxed">
      <p>주식회사 EYEVACS(이하 "회사")는 개인정보보호법, 정보통신망 이용촉진 및 정보보호 등에 관한 법률 등 관련 법령에 따라 이용자의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 다음과 같이 개인정보처리방침을 수립·공개합니다.</p>

      <section>
        <h3 className="text-base font-bold text-gray-900 mb-2">1. 수집하는 개인정보 항목 및 수집 방법</h3>
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 text-xs">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-3 py-2 text-left font-semibold">구분</th>
                <th className="border border-gray-200 px-3 py-2 text-left font-semibold">수집 항목</th>
                <th className="border border-gray-200 px-3 py-2 text-left font-semibold">수집 목적</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-200 px-3 py-2 font-medium">필수</td>
                <td className="border border-gray-200 px-3 py-2">이름, 이메일, 휴대폰번호, 비밀번호(암호화)</td>
                <td className="border border-gray-200 px-3 py-2">회원 가입 및 서비스 이용, 본인 확인, 고지사항 전달</td>
              </tr>
              <tr>
                <td className="border border-gray-200 px-3 py-2 font-medium">선택</td>
                <td className="border border-gray-200 px-3 py-2">가게명, 가게 주소, 사업자등록번호, 가게 사진</td>
                <td className="border border-gray-200 px-3 py-2">가게 등록 및 광고 서비스 제공</td>
              </tr>
              <tr>
                <td className="border border-gray-200 px-3 py-2 font-medium">자동 수집</td>
                <td className="border border-gray-200 px-3 py-2">접속 IP, 브라우저 정보, 접속 일시, 서비스 이용 기록</td>
                <td className="border border-gray-200 px-3 py-2">서비스 이용 통계, 부정 이용 방지</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h3 className="text-base font-bold text-gray-900 mb-2">2. 개인정보의 보유 및 이용 기간</h3>
        <ul className="list-disc ml-5 space-y-1">
          <li><strong>회원 정보:</strong> 회원 탈퇴 시까지 (탈퇴 후 즉시 파기)</li>
          <li><strong>결제 기록:</strong> 전자상거래법에 따라 5년간 보관</li>
          <li><strong>접속 로그:</strong> 통신비밀보호법에 따라 3개월간 보관</li>
          <li><strong>소비자 불만/분쟁 처리 기록:</strong> 전자상거래법에 따라 3년간 보관</li>
        </ul>
      </section>

      <section>
        <h3 className="text-base font-bold text-gray-900 mb-2">3. 개인정보의 제3자 제공</h3>
        <p>회사는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다. 다만, 다음의 경우에는 예외로 합니다.</p>
        <ul className="list-disc ml-5 space-y-1 mt-2">
          <li>이용자가 사전에 동의한 경우</li>
          <li>법령에 의거하거나, 수사 목적으로 법령에 정해진 절차에 따라 요청이 있는 경우</li>
        </ul>
      </section>

      <section>
        <h3 className="text-base font-bold text-gray-900 mb-2">4. 개인정보의 처리 위탁</h3>
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 text-xs">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-3 py-2 text-left font-semibold">수탁업체</th>
                <th className="border border-gray-200 px-3 py-2 text-left font-semibold">위탁 업무 내용</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-200 px-3 py-2">결제 대행사(PG)</td>
                <td className="border border-gray-200 px-3 py-2">유료 서비스 결제 처리</td>
              </tr>
              <tr>
                <td className="border border-gray-200 px-3 py-2">SMS 발송 대행사</td>
                <td className="border border-gray-200 px-3 py-2">본인인증 문자 발송</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h3 className="text-base font-bold text-gray-900 mb-2">5. 개인정보의 파기</h3>
        <ul className="list-disc ml-5 space-y-1">
          <li>회원 탈퇴 시 지체 없이 파기합니다.</li>
          <li>전자적 파일: 복구 불가능한 방법으로 삭제</li>
          <li>종이 문서: 분쇄 또는 소각</li>
        </ul>
      </section>

      <section>
        <h3 className="text-base font-bold text-gray-900 mb-2">6. 이용자의 권리·의무</h3>
        <ul className="list-disc ml-5 space-y-1">
          <li>이용자는 언제든지 자신의 개인정보를 조회하거나 수정할 수 있습니다.</li>
          <li>이용자는 개인정보 수집·이용에 대한 동의를 철회(회원 탈퇴)할 수 있습니다.</li>
          <li>이용자는 개인정보의 열람, 정정, 삭제, 처리정지를 요구할 수 있습니다.</li>
        </ul>
      </section>

      <section>
        <h3 className="text-base font-bold text-gray-900 mb-2">7. 개인정보 보호를 위한 기술적·관리적 대책</h3>
        <ul className="list-disc ml-5 space-y-1">
          <li>비밀번호 암호화 저장</li>
          <li>SSL/TLS를 통한 데이터 전송 암호화</li>
          <li>개인정보 접근 권한 최소화</li>
          <li>정기적인 보안 점검</li>
        </ul>
      </section>

      <section>
        <h3 className="text-base font-bold text-gray-900 mb-2">8. 개인정보 보호책임자</h3>
        <div className="bg-gray-50 rounded-lg p-4 space-y-1">
          <p><strong>성명:</strong> [대표자명]</p>
          <p><strong>직위:</strong> 대표이사</p>
          <p><strong>이메일:</strong> privacy@eyevacs.com</p>
          <p><strong>전화:</strong> [대표번호]</p>
        </div>
      </section>

      <section>
        <h3 className="text-base font-bold text-gray-900 mb-2">9. 개인정보 침해 관련 상담·신고</h3>
        <ul className="list-disc ml-5 space-y-1">
          <li>개인정보침해 신고센터: (국번없이) 118</li>
          <li>개인정보 분쟁조정위원회: 1833-6972 (kopico.go.kr)</li>
          <li>대검찰청 사이버수사과: 1301 (spo.go.kr)</li>
          <li>경찰청 사이버수사국: 182 (police.go.kr)</li>
        </ul>
      </section>

      <div className="pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-400">시행일: 2025년 1월 1일</p>
      </div>
    </div>

    <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-3 rounded-b-xl">
      <button onClick={onClose} className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition">
        확인
      </button>
    </div>
  </div>
  </div>
);
