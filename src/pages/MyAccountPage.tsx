import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from '../components/Toast';
import { ShieldCheckIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface Props {
  name: string;
  email: string;
  phone: string;
  onSave: (data: { name: string; phone: string }) => void;
  onBack: () => void;
  onNavigate: (page: string) => void;
  onWithdraw?: () => void;
}

const formatPhone = (v: string) => {
  const n = v.replace(/\D/g, '').slice(0, 11);
  if (n.length <= 3) return n;
  if (n.length <= 7) return `${n.slice(0, 3)}-${n.slice(3)}`;
  return `${n.slice(0, 3)}-${n.slice(3, 7)}-${n.slice(7)}`;
};
const rawPhone = (v: string) => v.replace(/\D/g, '');

export const MyAccountPage: React.FC<Props> = ({ name, email, phone, onSave, onBack, onNavigate, onWithdraw }) => {
  const toast = useToast();

  // 기본 정보
  const [formName, setFormName] = useState(name);
  const [formPhone, setFormPhone] = useState(phone);

  // 휴대폰 변경 모드
  const [phoneEditMode, setPhoneEditMode] = useState(false);
  const [phoneChanged, setPhoneChanged] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [verifyCode, setVerifyCode] = useState('');
  const [verified, setVerified] = useState(false);
  const [timer, setTimer] = useState(0);

  // 회원탈퇴
  const [showWithdrawConfirm, setShowWithdrawConfirm] = useState(false);
  const [withdrawConfirmText, setWithdrawConfirmText] = useState('');

  useEffect(() => {
    if (timer <= 0) return;
    const id = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(id);
  }, [timer]);

  const fmtTimer = useCallback((t: number) => {
    const m = Math.floor(t / 60);
    const s = t % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }, []);

  const handlePhoneChange = (v: string) => {
    const formatted = formatPhone(v);
    setFormPhone(formatted);
    const changed = rawPhone(formatted) !== rawPhone(phone);
    setPhoneChanged(changed);
    if (changed) { setVerified(false); setCodeSent(false); setVerifyCode(''); }
  };

  const sendCode = () => {
    const p = rawPhone(formPhone);
    if (!/^01[016789]\d{7,8}$/.test(p)) { toast('올바른 휴대폰 번호를 입력해주세요', 'error'); return; }
    setCodeSent(true); setVerified(false); setVerifyCode(''); setTimer(300);
    toast('인증번호가 발송되었습니다');
  };

  const checkCode = () => {
    if (verifyCode.length !== 6) { toast('6자리 인증번호를 입력해주세요', 'error'); return; }
    setVerified(true); setTimer(0);
    toast('본인인증이 완료되었습니다');
  };

  const handleSave = () => {
    if (!formName.trim()) { toast('이름을 입력해주세요', 'error'); return; }
    if (phoneChanged && !verified) { toast('변경된 번호의 본인인증을 완료해주세요', 'error'); return; }
    onSave({ name: formName.trim(), phone: formPhone.trim() });
    toast('계정 정보가 저장되었습니다');
    setPhoneEditMode(false); setPhoneChanged(false); setCodeSent(false); setVerified(false);
  };

  const handleWithdraw = () => {
    if (withdrawConfirmText !== '탈퇴합니다') { toast('"탈퇴합니다"를 정확히 입력해주세요', 'error'); return; }
    toast('회원 탈퇴가 완료되었습니다');
    setShowWithdrawConfirm(false);
    onWithdraw?.();
  };

  const hasChanges = formName !== name || phoneChanged;

  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-extrabold pl-1">내 계정</h2>
        <p className="text-sm text-gray-500 mt-1">계정 정보를 확인하고 수정할 수 있습니다</p>
      </div>

      {/* 기본 정보 섹션 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5 mb-4">
        <h3 className="text-base font-bold text-gray-900">기본 정보</h3>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1.5">이름</label>
          <input
            value={formName}
            onChange={e => setFormName(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1.5">이메일</label>
          <input
            value={email}
            disabled
            className="w-full border border-gray-100 rounded-lg px-3 py-2.5 text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
          />
          <p className="text-xs text-gray-400 mt-1">이메일은 변경할 수 없습니다</p>
        </div>

        {/* 비밀번호 */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1.5">비밀번호</label>
          <div className="flex items-center gap-2">
            <input
              value="••••••••"
              disabled
              className="flex-1 border border-gray-100 rounded-lg px-3 py-2.5 text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
            />
            <button
              type="button"
              onClick={() => onNavigate('change-password')}
              className="px-4 py-2.5 rounded-lg text-sm font-semibold text-blue-600 border border-blue-200 hover:bg-blue-50 transition whitespace-nowrap"
            >
              변경
            </button>
          </div>
        </div>

        {/* 휴대폰 번호 */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1.5">휴대폰 번호</label>
          {!phoneEditMode ? (
            <div className="flex items-center gap-2">
              <input
                value={phone ? formatPhone(phone) : '등록된 번호 없음'}
                disabled
                className="flex-1 border border-gray-100 rounded-lg px-3 py-2.5 text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
              />
              <button
                type="button"
                onClick={() => { setPhoneEditMode(true); setFormPhone(phone ? formatPhone(phone) : ''); }}
                className="px-4 py-2.5 rounded-lg text-sm font-semibold text-blue-600 border border-blue-200 hover:bg-blue-50 transition whitespace-nowrap"
              >
                변경하기
              </button>
            </div>
          ) : (
            <>
              <div className="flex gap-2">
                <input
                  value={formPhone}
                  onChange={e => handlePhoneChange(e.target.value)}
                  placeholder="010-0000-0000"
                  disabled={verified}
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-50 disabled:text-gray-400"
                  autoFocus
                />
                {!verified && (
                  <button
                    type="button" onClick={sendCode}
                    disabled={!phoneChanged}
                    className={`px-4 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap transition ${
                      codeSent ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-blue-600 text-white hover:bg-blue-700'
                    } disabled:bg-gray-200 disabled:text-gray-400`}
                  >
                    {codeSent ? '재발송' : '인증번호 발송'}
                  </button>
                )}
                {verified && (
                  <div className="flex items-center gap-1 px-3 text-emerald-600">
                    <ShieldCheckIcon className="w-5 h-5" />
                    <span className="text-xs font-semibold">인증됨</span>
                  </div>
                )}
              </div>

              {/* 인증번호 입력 */}
              {codeSent && !verified && (
                <div className="space-y-2 mt-3">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        value={verifyCode}
                        onChange={e => setVerifyCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="인증번호 6자리"
                        maxLength={6}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none pr-16"
                      />
                      {timer > 0 && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-red-500">
                          {fmtTimer(timer)}
                        </span>
                      )}
                    </div>
                    <button
                      type="button" onClick={checkCode} disabled={timer <= 0}
                      className="px-4 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition disabled:bg-gray-200 disabled:text-gray-400"
                    >
                      확인
                    </button>
                  </div>
                  {timer <= 0 && (
                    <p className="text-xs text-red-500">인증 시간이 만료되었습니다. 재발송해주세요.</p>
                  )}
                </div>
              )}

              {!verified && (
                <button
                  type="button"
                  onClick={() => { setPhoneEditMode(false); setFormPhone(phone); setPhoneChanged(false); setCodeSent(false); setVerifyCode(''); }}
                  className="text-xs text-gray-400 hover:text-gray-600 transition mt-2"
                >
                  취소
                </button>
              )}
            </>
          )}
        </div>

        {/* 저장 */}
        <div className="flex gap-3 pt-2">
          <button onClick={onBack} className="flex-1 py-3 rounded-lg border border-gray-200 text-sm font-medium text-gray-500 hover:bg-gray-50 transition">
            취소
          </button>
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className="flex-1 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition disabled:bg-gray-200 disabled:text-gray-400"
          >
            저장하기
          </button>
        </div>
      </div>

      {/* 회원 탈퇴 */}
      <div className="flex justify-end mt-6 px-1">
        <button onClick={() => setShowWithdrawConfirm(true)} className="text-xs text-gray-300 hover:text-red-500 transition">
          회원 탈퇴
        </button>
      </div>

      {/* 탈퇴 확인 모달 */}
      {showWithdrawConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowWithdrawConfirm(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                  <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
                </div>
                <h3 className="text-lg font-extrabold text-gray-900">정말 탈퇴하시겠습니까?</h3>
              </div>

              <div className="bg-red-50 rounded-lg p-4 mb-4 space-y-2">
                <p className="text-sm font-bold text-red-700">탈퇴 시 아래 내용이 모두 삭제됩니다:</p>
                <ul className="text-sm text-red-600 space-y-1.5 ml-1">
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 w-1 h-1 rounded-full bg-red-400 shrink-0" />
                    등록된 모든 가게 정보가 영구 삭제됩니다
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 w-1 h-1 rounded-full bg-red-400 shrink-0" />
                    진행중인 유료 광고 및 실속쇼핑이 즉시 중단되며, 결제한 금액은 환불되지 않습니다
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 w-1 h-1 rounded-full bg-red-400 shrink-0" />
                    광고 성과 데이터, 조회수 등 모든 통계가 삭제됩니다
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 w-1 h-1 rounded-full bg-red-400 shrink-0" />
                    삭제된 데이터는 복구할 수 없습니다
                  </li>
                </ul>
              </div>

              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                  확인을 위해 <strong className="text-red-500">탈퇴합니다</strong>를 입력해주세요
                </label>
                <input
                  value={withdrawConfirmText}
                  onChange={e => setWithdrawConfirmText(e.target.value)}
                  placeholder="탈퇴합니다"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => { setShowWithdrawConfirm(false); setWithdrawConfirmText(''); }}
                  className="flex-1 py-3 rounded-lg border border-gray-200 text-sm font-medium text-gray-500 hover:bg-gray-50 transition"
                >
                  취소
                </button>
                <button
                  onClick={handleWithdraw}
                  disabled={withdrawConfirmText !== '탈퇴합니다'}
                  className="flex-1 py-3 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition disabled:bg-gray-200 disabled:text-gray-400"
                >
                  탈퇴하기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
