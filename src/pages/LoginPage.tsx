import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useToast } from '../components/Toast';

interface Props {
  onLogin: (name: string, isNew: boolean, email: string) => void;
}

/** 전화번호 포맷 (010-0000-0000) */
const formatPhone = (v: string) => {
  const n = v.replace(/\D/g, '').slice(0, 11);
  if (n.length <= 3) return n;
  if (n.length <= 7) return `${n.slice(0, 3)}-${n.slice(3)}`;
  return `${n.slice(0, 3)}-${n.slice(3, 7)}-${n.slice(7)}`;
};

const rawPhone = (v: string) => v.replace(/\D/g, '');

const PW_RULES = [
  { test: (v: string) => v.length >= 8, label: '8자 이상' },
  { test: (v: string) => /[A-Z]/.test(v), label: '영문 대문자' },
  { test: (v: string) => /[a-z]/.test(v), label: '영문 소문자' },
  { test: (v: string) => /\d/.test(v), label: '숫자' },
  { test: (v: string) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(v), label: '특수문자' },
];
const validatePassword = (pw: string) => PW_RULES.every(r => r.test(pw));

const PasswordStrength: React.FC<{ value: string }> = ({ value }) => {
  const checks = PW_RULES.map(r => ({ ...r, pass: r.test(value) }));
  const strength = checks.filter(c => c.pass).length;
  if (!value) return null;
  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1">
        {[1,2,3,4,5].map(i => (
          <div key={i} className={`h-1 flex-1 rounded-full transition ${
            i <= strength ? strength <= 2 ? 'bg-red-400' : strength <= 3 ? 'bg-yellow-400' : 'bg-emerald-400' : 'bg-gray-200'
          }`} />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-0.5">
        {checks.map(c => (
          <span key={c.label} className={`text-xs ${c.pass ? 'text-emerald-500' : 'text-gray-400'}`}>
            {c.pass ? '✓' : '○'} {c.label}
          </span>
        ))}
      </div>
    </div>
  );
};

const CheckIcon = () => (
  <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);

export const LoginPage: React.FC<Props> = ({ onLogin }) => {
  const toast = useToast();
  const [mode, setMode] = useState<'login' | 'signup' | 'find'>('login');

  // Login fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Signup fields
  const [userName, setUserName] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [phone, setPhone] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeMarketing, setAgreeMarketing] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState<'terms' | 'privacy' | null>(null);
  const [timer, setTimer] = useState(0);

  // Find account fields
  const [findTab, setFindTab] = useState<'id' | 'pw'>('id');
  // 아이디 찾기
  const [findIdName, setFindIdName] = useState('');
  const [findIdPhone, setFindIdPhone] = useState('');
  const [findIdCode, setFindIdCode] = useState('');
  const [findIdCodeSent, setFindIdCodeSent] = useState(false);
  const [findIdVerified, setFindIdVerified] = useState(false);
  const [findIdTimer, setFindIdTimer] = useState(0);
  const [foundEmail, setFoundEmail] = useState<string | null>(null);
  // 비밀번호 찾기
  const [findPwEmail, setFindPwEmail] = useState('');
  const [findPwName, setFindPwName] = useState('');
  const [findPwPhone, setFindPwPhone] = useState('');
  const [findPwCode, setFindPwCode] = useState('');
  const [findPwCodeSent, setFindPwCodeSent] = useState(false);
  const [findPwVerified, setFindPwVerified] = useState(false);
  const [findPwTimer, setFindPwTimer] = useState(0);
  const [pwResetDone, setPwResetDone] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [pwResetStep, setPwResetStep] = useState<'verify' | 'reset'>('verify');

  // Timer countdowns
  useEffect(() => {
    if (timer <= 0) return;
    const id = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(id);
  }, [timer]);
  useEffect(() => {
    if (findIdTimer <= 0) return;
    const id = setInterval(() => setFindIdTimer(t => t - 1), 1000);
    return () => clearInterval(id);
  }, [findIdTimer]);
  useEffect(() => {
    if (findPwTimer <= 0) return;
    const id = setInterval(() => setFindPwTimer(t => t - 1), 1000);
    return () => clearInterval(id);
  }, [findPwTimer]);

  const fmtTimer = useCallback((t: number) => {
    const m = Math.floor(t / 60);
    const s = t % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }, []);

  // ── 회원가입 인증 ──
  const sendCode = () => {
    const p = rawPhone(phone);
    if (!/^01[016789]\d{7,8}$/.test(p)) { toast('올바른 휴대폰 번호를 입력해주세요', 'error'); return; }
    setCodeSent(true); setVerified(false); setVerifyCode(''); setTimer(300);
    toast('인증번호가 발송되었습니다');
  };
  const checkCode = () => {
    if (verifyCode.length !== 6) { toast('6자리 인증번호를 입력해주세요', 'error'); return; }
    setVerified(true); setTimer(0);
    toast('본인인증이 완료되었습니다');
  };

  // ── 아이디 찾기 인증 ──
  const sendFindIdCode = () => {
    if (!findIdName.trim()) { toast('이름을 입력해주세요', 'error'); return; }
    const p = rawPhone(findIdPhone);
    if (!/^01[016789]\d{7,8}$/.test(p)) { toast('올바른 휴대폰 번호를 입력해주세요', 'error'); return; }
    setFindIdCodeSent(true); setFindIdVerified(false); setFindIdCode(''); setFindIdTimer(300);
    toast('인증번호가 발송되었습니다');
  };
  const checkFindIdCode = () => {
    if (findIdCode.length !== 6) { toast('6자리 인증번호를 입력해주세요', 'error'); return; }
    setFindIdVerified(true); setFindIdTimer(0);
    toast('본인인증이 완료되었습니다');
  };
  const handleFindId = (e: React.FormEvent) => {
    e.preventDefault();
    if (!findIdVerified) { toast('휴대폰 본인인증을 완료해주세요', 'error'); return; }
    // Mock: return a masked email
    setFoundEmail('user@example.com');
    toast('계정을 찾았습니다');
  };

  // ── 비밀번호 찾기 인증 ──
  const sendFindPwCode = () => {
    if (!findPwEmail.trim()) { toast('이메일을 입력해주세요', 'error'); return; }
    if (!findPwName.trim()) { toast('이름을 입력해주세요', 'error'); return; }
    const p = rawPhone(findPwPhone);
    if (!/^01[016789]\d{7,8}$/.test(p)) { toast('올바른 휴대폰 번호를 입력해주세요', 'error'); return; }
    setFindPwCodeSent(true); setFindPwVerified(false); setFindPwCode(''); setFindPwTimer(300);
    toast('인증번호가 발송되었습니다');
  };
  const checkFindPwCode = () => {
    if (findPwCode.length !== 6) { toast('6자리 인증번호를 입력해주세요', 'error'); return; }
    setFindPwVerified(true); setFindPwTimer(0);
    toast('본인인증이 완료되었습니다');
  };
  const handleFindPwVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!findPwVerified) { toast('휴대폰 본인인증을 완료해주세요', 'error'); return; }
    setPwResetStep('reset');
    toast('본인인증이 완료되었습니다. 새 비밀번호를 설정해주세요');
  };
  const handleFindPwReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword.trim()) { toast('새 비밀번호를 입력해주세요', 'error'); return; }
    if (!validatePassword(newPassword)) { toast('비밀번호 조건을 모두 충족해주세요', 'error'); return; }
    if (newPassword !== newPasswordConfirm) { toast('비밀번호가 일치하지 않습니다', 'error'); return; }
    setPwResetDone(true);
    toast('비밀번호가 변경되었습니다');
  };

  // ── 로그인 / 회원가입 submit ──
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'signup') {
      if (!userName.trim()) { toast('이름을 입력해주세요', 'error'); return; }
      if (!rawPhone(phone)) { toast('연락처를 입력해주세요', 'error'); return; }
      if (!verified) { toast('휴대폰 본인인증을 완료해주세요', 'error'); return; }
      if (!email.trim()) { toast('이메일을 입력해주세요', 'error'); return; }
      if (!password.trim()) { toast('비밀번호를 입력해주세요', 'error'); return; }
      if (!validatePassword(password)) { toast('비밀번호 조건을 모두 충족해주세요', 'error'); return; }
      if (password !== passwordConfirm) { toast('비밀번호가 일치하지 않습니다', 'error'); return; }
      if (!agreeTerms) { toast('이용약관에 동의해주세요', 'error'); return; }
      if (!agreePrivacy) { toast('개인정보 수집·이용에 동의해주세요', 'error'); return; }
      onLogin(userName, true, email);
    } else {
      if (!email.trim() || !password.trim()) { toast('이메일과 비밀번호를 입력해주세요', 'error'); return; }
      onLogin(email.split('@')[0] || '사장님', false, email);
    }
  };

  const goLogin = () => {
    setMode('login');
    setFoundEmail(null);
    setPwResetDone(false);
    setFindIdCodeSent(false); setFindIdVerified(false); setFindIdTimer(0);
    setFindPwCodeSent(false); setFindPwVerified(false); setFindPwTimer(0);
    setPwResetStep('verify'); setNewPassword(''); setNewPasswordConfirm('');
  };

  // ── Phone + Code 입력 공통 컴포넌트 ──
  const PhoneVerifyBlock: React.FC<{
    phone: string; setPhone: (v: string) => void;
    code: string; setCode: (v: string) => void;
    codeSent: boolean; verified: boolean; tmr: number;
    onSend: () => void; onCheck: () => void;
  }> = ({ phone: ph, setPhone: setPh, code: cd, setCode: setCd, codeSent: cs, verified: vf, tmr, onSend, onCheck }) => (
    <>
      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1.5">휴대폰 번호</label>
        <div className="flex gap-2">
          <input
            value={ph}
            onChange={e => setPh(formatPhone(e.target.value))}
            placeholder="010-0000-0000"
            disabled={vf}
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-50 disabled:text-gray-400"
          />
          <button
            type="button" onClick={onSend} disabled={vf}
            className={`px-4 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap transition ${
              vf ? 'bg-emerald-100 text-emerald-600 cursor-default'
                : cs ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {vf ? '인증완료' : cs ? '재발송' : '인증번호 발송'}
          </button>
        </div>
      </div>
      {cs && !vf && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                value={cd} onChange={e => setCd(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="인증번호 6자리" maxLength={6}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none pr-16"
              />
              {tmr > 0 && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-red-500">{fmtTimer(tmr)}</span>}
            </div>
            <button type="button" onClick={onCheck} disabled={tmr <= 0}
              className="px-4 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition disabled:bg-gray-200 disabled:text-gray-400"
            >확인</button>
          </div>
          {tmr <= 0 && <p className="text-xs text-red-500">인증 시간이 만료되었습니다. 재발송해주세요.</p>}
        </div>
      )}
      {vf && (
        <div className="flex items-center gap-2 bg-emerald-50 rounded-lg px-3 py-2.5">
          <CheckIcon />
          <span className="text-sm text-emerald-700 font-medium">본인인증이 완료되었습니다</span>
        </div>
      )}
    </>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">EYEVACS</h1>
          <p className="text-blue-200 text-sm mt-1">우리동네 사장님 센터</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">

          {/* ════════ 아이디/비밀번호 찾기 ════════ */}
          {mode === 'find' ? (
            <>
              <div className="px-6 pt-6 pb-2">
                <h3 className="text-lg font-extrabold text-gray-900">계정 찾기</h3>
                <p className="text-sm text-gray-500 mt-1">휴대폰 인증으로 아이디 또는 비밀번호를 찾습니다</p>
              </div>

              {/* 아이디/비밀번호 찾기 탭 */}
              <div className="flex mx-6 mt-3 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => { setFindTab('id'); setFoundEmail(null); }}
                  className={`flex-1 py-2 rounded-md text-sm font-semibold transition ${findTab === 'id' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}
                >
                  아이디 찾기
                </button>
                <button
                  onClick={() => { setFindTab('pw'); setPwResetDone(false); }}
                  className={`flex-1 py-2 rounded-md text-sm font-semibold transition ${findTab === 'pw' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}
                >
                  비밀번호 찾기
                </button>
              </div>

              {/* ── 아이디 찾기 ── */}
              {findTab === 'id' && (
                foundEmail ? (
                  <div className="p-6 text-center">
                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>
                    </div>
                    <p className="text-sm font-semibold text-gray-700 mb-1">가입된 계정을 찾았습니다</p>
                    <div className="bg-gray-50 rounded-lg px-4 py-3 mt-3 mb-4">
                      <p className="text-lg font-bold text-gray-900">{foundEmail}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={goLogin} className="flex-1 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition">
                        로그인하기
                      </button>
                      <button onClick={() => { setFindTab('pw'); setFoundEmail(null); setPwResetDone(false); }} className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-500 hover:bg-gray-50 transition">
                        비밀번호 찾기
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleFindId} className="p-6 space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1.5">이름</label>
                      <input value={findIdName} onChange={e => setFindIdName(e.target.value)} placeholder="가입 시 등록한 이름"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                    </div>
                    <PhoneVerifyBlock
                      phone={findIdPhone} setPhone={setFindIdPhone}
                      code={findIdCode} setCode={setFindIdCode}
                      codeSent={findIdCodeSent} verified={findIdVerified} tmr={findIdTimer}
                      onSend={sendFindIdCode} onCheck={checkFindIdCode}
                    />
                    <button type="submit" disabled={!findIdVerified}
                      className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition disabled:bg-gray-200 disabled:text-gray-400">
                      아이디 찾기
                    </button>
                    <button type="button" onClick={goLogin} className="w-full text-sm text-gray-500 hover:text-gray-700 transition">
                      로그인으로 돌아가기
                    </button>
                  </form>
                )
              )}

              {/* ── 비밀번호 찾기 ── */}
              {findTab === 'pw' && (
                pwResetDone ? (
                  <div className="p-6 text-center">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <p className="text-sm font-semibold text-gray-700">비밀번호가 변경되었습니다</p>
                    <p className="text-xs text-gray-500 mt-1">새 비밀번호로 로그인해주세요.</p>
                    <button onClick={goLogin} className="mt-5 px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition">
                      로그인으로 돌아가기
                    </button>
                  </div>
                ) : pwResetStep === 'reset' ? (
                  <form onSubmit={handleFindPwReset} className="p-6 space-y-4">
                    <div className="flex items-center gap-2 bg-emerald-50 rounded-lg px-3 py-2.5 mb-1">
                      <CheckIcon />
                      <span className="text-sm text-emerald-700 font-medium">본인인증 완료 — 새 비밀번호를 설정하세요</span>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1.5">새 비밀번호 <span className="text-gray-300 font-normal">(8자 이상, 대/소문자, 숫자, 특수문자)</span></label>
                      <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="새 비밀번호 입력"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                      <PasswordStrength value={newPassword} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1.5">새 비밀번호 확인</label>
                      <input type="password" value={newPasswordConfirm} onChange={e => setNewPasswordConfirm(e.target.value)} placeholder="비밀번호를 다시 입력해주세요"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                      {newPasswordConfirm && newPassword !== newPasswordConfirm && (
                        <p className="text-xs text-red-500 mt-1">비밀번호가 일치하지 않습니다</p>
                      )}
                    </div>
                    <button type="submit"
                      className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition">
                      비밀번호 변경
                    </button>
                    <button type="button" onClick={goLogin} className="w-full text-sm text-gray-500 hover:text-gray-700 transition">
                      로그인으로 돌아가기
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleFindPwVerify} className="p-6 space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1.5">이메일</label>
                      <input type="email" value={findPwEmail} onChange={e => setFindPwEmail(e.target.value)} placeholder="가입 시 사용한 이메일"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1.5">이름</label>
                      <input value={findPwName} onChange={e => setFindPwName(e.target.value)} placeholder="가입 시 등록한 이름"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                    </div>
                    <PhoneVerifyBlock
                      phone={findPwPhone} setPhone={setFindPwPhone}
                      code={findPwCode} setCode={setFindPwCode}
                      codeSent={findPwCodeSent} verified={findPwVerified} tmr={findPwTimer}
                      onSend={sendFindPwCode} onCheck={checkFindPwCode}
                    />
                    <button type="submit" disabled={!findPwVerified}
                      className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition disabled:bg-gray-200 disabled:text-gray-400">
                      다음
                    </button>
                    <button type="button" onClick={goLogin} className="w-full text-sm text-gray-500 hover:text-gray-700 transition">
                      로그인으로 돌아가기
                    </button>
                  </form>
                )
              )}
            </>
          ) : (
            /* ════════ 로그인 ════════ */
            <>
              <div className="px-6 pt-6 pb-2">
                <h3 className="text-lg font-extrabold text-gray-900">로그인</h3>
                <p className="text-sm text-gray-500 mt-1">이메일과 비밀번호를 입력하세요</p>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 mb-1.5">
                    이메일
                    <span className="relative group">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-gray-300 hover:text-blue-500 cursor-help transition" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" /></svg>
                      <span className="absolute top-1/2 -translate-y-1/2 left-full ml-2 w-56 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition pointer-events-none text-center leading-relaxed shadow-lg z-50">
                        admin@gmail.com으로 로그인 시<br/>어드민 모드를 확인할 수 있습니다
                        <span className="absolute top-1/2 -translate-y-1/2 right-full border-4 border-transparent border-r-gray-800" />
                      </span>
                    </span>
                  </label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="example@email.com"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">비밀번호</label>
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>
                <button type="submit" className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition">
                  로그인
                </button>
              </form>

              <div className="px-6 pb-5 space-y-2 text-center">
                <div className="flex items-center justify-center gap-2">
                  <button onClick={() => { setMode('find'); setFindTab('id'); }} className="text-xs text-gray-400 hover:text-blue-600 transition">
                    아이디 찾기
                  </button>
                  <span className="text-xs text-gray-300">|</span>
                  <button onClick={() => { setMode('find'); setFindTab('pw'); }} className="text-xs text-gray-400 hover:text-blue-600 transition">
                    비밀번호 찾기
                  </button>
                </div>
                <p className="text-xs text-gray-400">
                  아직 계정이 없으신가요?{' '}
                  <button onClick={() => setMode('signup')} className="text-blue-600 font-medium hover:underline">회원가입</button>
                </p>
              </div>
            </>

          )}
        </div>

        {/* ════════ 약관/개인정보 미리보기 모달 ════════ */}
        {showTermsModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowTermsModal(null)} />
            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                <h3 className="text-base font-bold text-gray-900">
                  {showTermsModal === 'terms' ? '이용약관' : '개인정보 수집·이용 동의'}
                </h3>
                <button onClick={() => setShowTermsModal(null)} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <div className="p-6 text-xs text-gray-600 leading-relaxed space-y-3">
                {showTermsModal === 'terms' ? (
                  <>
                    <p className="font-semibold">제1조 (목적)</p>
                    <p>본 약관은 주식회사 EYEVACS가 제공하는 우리동네 사장님 센터 서비스의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항을 규정합니다.</p>
                    <p className="font-semibold">제2조 (서비스 내용)</p>
                    <p>가게 정보 등록, 알짜광고·실속쇼핑 등록 및 관리, 광고 성과 통계 제공</p>
                    <p className="font-semibold">제3조 (유료 서비스)</p>
                    <p>알짜광고 및 실속쇼핑은 유료이며, 결제 후 게시됩니다. 회원 탈퇴 시 진행 중인 유료 서비스는 즉시 중단됩니다.</p>
                    <p className="text-gray-400 mt-4">전문은 서비스 내 이용약관 페이지에서 확인할 수 있습니다.</p>
                  </>
                ) : (
                  <>
                    <p className="font-semibold">수집 항목</p>
                    <p>[필수] 이름, 이메일, 휴대폰번호, 비밀번호(암호화)</p>
                    <p>[선택] 가게명, 가게 주소, 사업자등록번호, 가게 사진</p>
                    <p className="font-semibold">수집·이용 목적</p>
                    <p>회원 가입 및 서비스 이용, 본인 확인, 고지사항 전달, 가게 등록 및 광고 서비스 제공</p>
                    <p className="font-semibold">보유 기간</p>
                    <p>회원 탈퇴 시까지 (단, 관련 법령에 따라 결제 기록 5년, 접속 로그 3개월 보관)</p>
                    <p className="text-gray-400 mt-4">전문은 서비스 내 개인정보처리방침 페이지에서 확인할 수 있습니다.</p>
                  </>
                )}
              </div>
              <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-3">
                <button onClick={() => setShowTermsModal(null)} className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition">
                  확인
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ════════ 회원가입 모달 ════════ */}
        {mode === 'signup' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={() => setMode('login')} />
            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="px-6 pt-6 pb-2 flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-extrabold text-gray-900">회원가입</h3>
                  <p className="text-sm text-gray-500 mt-1">가게 정보를 등록하려면 먼저 가입하세요</p>
                </div>
                <button onClick={() => setMode('login')} className="text-gray-400 hover:text-gray-600 transition p-1">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">이름 *</label>
                  <input value={userName} onChange={e => setUserName(e.target.value)} placeholder="홍길동"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>
                <PhoneVerifyBlock
                  phone={phone} setPhone={(v) => { setPhone(v); if (verified) { setVerified(false); setCodeSent(false); } }}
                  code={verifyCode} setCode={setVerifyCode}
                  codeSent={codeSent} verified={verified} tmr={timer}
                  onSend={sendCode} onCheck={checkCode}
                />
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">이메일 *</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="example@email.com"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">비밀번호 <span className="text-gray-300 font-normal">(8자 이상, 대/소문자, 숫자, 특수문자)</span></label>
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                  <PasswordStrength value={password} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">비밀번호 확인 *</label>
                  <input type="password" value={passwordConfirm} onChange={e => setPasswordConfirm(e.target.value)} placeholder="비밀번호를 다시 입력해주세요"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                  {passwordConfirm && password !== passwordConfirm && (
                    <p className="text-xs text-red-500 mt-1">비밀번호가 일치하지 않습니다</p>
                  )}
                </div>
                {/* 약관 동의 */}
                <div className="border border-gray-200 rounded-lg p-4 space-y-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreeTerms && agreePrivacy && agreeMarketing}
                      onChange={e => { setAgreeTerms(e.target.checked); setAgreePrivacy(e.target.checked); setAgreeMarketing(e.target.checked); }}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-bold text-gray-900">전체 동의</span>
                  </label>
                  <div className="border-t border-gray-100 pt-3 space-y-2.5 ml-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={agreeTerms} onChange={e => setAgreeTerms(e.target.checked)}
                        className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="text-xs text-gray-600">[필수] 이용약관 동의</span>
                      <button type="button" onClick={() => setShowTermsModal('terms')} className="text-xs text-blue-500 hover:underline ml-auto">보기</button>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={agreePrivacy} onChange={e => setAgreePrivacy(e.target.checked)}
                        className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="text-xs text-gray-600">[필수] 개인정보 수집·이용 동의</span>
                      <button type="button" onClick={() => setShowTermsModal('privacy')} className="text-xs text-blue-500 hover:underline ml-auto">보기</button>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={agreeMarketing} onChange={e => setAgreeMarketing(e.target.checked)}
                        className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="text-xs text-gray-600">[선택] 마케팅 정보 수신 동의</span>
                    </label>
                  </div>
                </div>

                <div className="pt-2">
                  <button type="submit" className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition">
                    가입하기
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <p className="text-center text-xs text-blue-200 mt-6">
          아파트 단지 인근 상가를 무료로 등록하고<br />입주민에게 홍보하세요
        </p>
      </div>
    </div>
  );
};
