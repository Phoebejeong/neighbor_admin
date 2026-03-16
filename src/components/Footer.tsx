import React from 'react';

interface Props {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<Props> = ({ onNavigate }) => (
  <footer className="border-t border-gray-200 bg-white mt-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* 링크 */}
      <div className="flex gap-4 text-xs mb-4">
        <button onClick={() => onNavigate('terms')} className="text-gray-500 hover:text-gray-700 transition">
          이용약관
        </button>
        <button onClick={() => onNavigate('privacy')} className="text-gray-900 font-bold hover:text-black transition">
          개인정보처리방침
        </button>
      </div>

      {/* 사업자 정보 — 한줄로 */}
      <div className="text-xs text-gray-400 leading-relaxed">
        <p>
          <span className="font-semibold text-gray-500">주식회사 EYEVACS</span>
          <span className="mx-1.5 text-gray-300">|</span>대표이사: [대표자명]
          <span className="mx-1.5 text-gray-300">|</span>사업자등록번호: [000-00-00000]
          <span className="mx-1.5 text-gray-300">|</span>통신판매업 신고: [제0000-서울XX-0000호]
        </p>
        <p className="mt-1">
          주소: [사업장 소재지]
          <span className="mx-1.5 text-gray-300">|</span>이메일: support@eyevacs.com
          <span className="mx-1.5 text-gray-300">|</span>전화: [대표번호]
        </p>
      </div>

      <p className="text-xs text-gray-300 mt-4">&copy; {new Date().getFullYear()} EYEVACS. All rights reserved.</p>
    </div>
  </footer>
);
