import React, { useState, useMemo } from 'react';
import { useToast } from '../components/Toast';
import { KeyRound } from 'lucide-react';

interface Props {
  onBack: () => void;
  isAdmin?: boolean;
}

const PW_RULES = [
  { test: (v: string) => v.length >= 8, label: '8자 이상' },
  { test: (v: string) => /[A-Z]/.test(v), label: '영문 대문자' },
  { test: (v: string) => /[a-z]/.test(v), label: '영문 소문자' },
  { test: (v: string) => /\d/.test(v), label: '숫자' },
  { test: (v: string) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(v), label: '특수문자' },
];

const validatePassword = (pw: string) => PW_RULES.every(r => r.test(pw));

export const ChangePasswordPage: React.FC<Props> = ({ onBack, isAdmin }) => {
  const toast = useToast();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');

  const pwChecks = useMemo(() => PW_RULES.map(r => ({ ...r, pass: r.test(next) })), [next]);
  const strength = useMemo(() => pwChecks.filter(c => c.pass).length, [pwChecks]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!current.trim()) { toast('현재 비밀번호를 입력해주세요', 'error'); return; }
    if (!validatePassword(next)) { toast('비밀번호 조건을 모두 충족해주세요', 'error'); return; }
    if (next !== confirm) { toast('새 비밀번호가 일치하지 않습니다', 'error'); return; }
    toast('비밀번호가 변경되었습니다');
    onBack();
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold pl-1 text-stone-900">비밀번호 변경</h2>
        <p className="text-sm text-stone-500 mt-1">안전한 비밀번호로 변경해주세요</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
        <div className="mb-5">
          <KeyRound className="w-6 h-6 text-[#7f2929]" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-500 mb-1.5">현재 비밀번호</label>
            <input
              type="password"
              value={current}
              onChange={e => setCurrent(e.target.value)}
              placeholder="현재 비밀번호 입력"
              className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#7f2929] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-stone-500 mb-1.5">새 비밀번호</label>
            <input
              type="password"
              value={next}
              onChange={e => setNext(e.target.value)}
              placeholder="8자 이상, 대/소문자, 숫자, 특수문자 포함"
              className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#7f2929] focus:outline-none"
            />
            {next && (
              <div className="mt-2 space-y-1.5">
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition ${
                      i <= strength
                        ? strength <= 2 ? 'bg-red-400' : strength <= 3 ? 'bg-yellow-400' : 'bg-emerald-400'
                        : 'bg-stone-200'
                    }`} />
                  ))}
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                  {pwChecks.map(c => (
                    <span key={c.label} className={`text-xs ${c.pass ? 'text-emerald-500' : 'text-stone-400'}`}>
                      {c.pass ? '✓' : '○'} {c.label}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div>
            <label className="block text-xs font-semibold text-stone-500 mb-1.5">새 비밀번호 확인</label>
            <input
              type="password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              placeholder="새 비밀번호 다시 입력"
              className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#7f2929] focus:outline-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onBack} className="flex-1 py-3 rounded-lg border border-stone-200 text-sm font-medium text-stone-500 hover:bg-stone-50 transition">
              취소
            </button>
            <button type="submit" className="flex-1 py-3 rounded-lg bg-[#222] hover:bg-[#333] text-white text-sm font-semibold transition">
              변경하기
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
};
