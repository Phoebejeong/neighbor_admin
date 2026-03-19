import React, { useState, useMemo } from 'react';
import { Lead, LocalShop } from '../data/types';
import {
  Phone,
  Mail,
  MapPin,
  Filter,
  UserPlus,
  CircleCheck,
  XCircle,
  MessageSquare,
  RefreshCw,
} from 'lucide-react';

interface Props {
  leads: Lead[];
  setLeads: (leads: Lead[]) => void;
  shops: LocalShop[];
}

const STATUS_MAP: Record<Lead['status'], { label: string; cls: string }> = {
  new: { label: '신규', cls: 'text-[#7f2929]' },
  contacted: { label: '연락완료', cls: 'text-amber-600' },
  interested: { label: '관심', cls: 'text-emerald-500' },
  registered: { label: '가입완료', cls: 'text-[#D4956A]' },
  rejected: { label: '거절', cls: 'text-red-500' },
};

const METHOD_ICON: Record<string, React.ReactNode> = {
  phone: <Phone className="w-3.5 h-3.5" />,
  visit: <MapPin className="w-3.5 h-3.5" />,
  email: <Mail className="w-3.5 h-3.5" />,
};

const RESULT_LABEL: Record<string, string> = {
  'no-answer': '부재중',
  callback: '재연락',
  interested: '관심',
  rejected: '거절',
};

export const AdminSalesPage: React.FC<Props> = ({ leads, setLeads, shops }) => {
  const [filter, setFilter] = useState<Lead['status'] | 'all'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() =>
    filter === 'all' ? leads : leads.filter(l => l.status === filter),
    [leads, filter]
  );

  // Funnel stats
  const counts = useMemo(() => ({
    total: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    contacted: leads.filter(l => l.status === 'contacted').length,
    interested: leads.filter(l => l.status === 'interested').length,
    registered: leads.filter(l => l.status === 'registered').length,
    rejected: leads.filter(l => l.status === 'rejected').length,
  }), [leads]);

  const conversionRate = counts.total > 0 ? Math.round((counts.registered / counts.total) * 100) : 0;
  const interestRate = counts.total > 0 ? Math.round(((counts.interested + counts.registered) / counts.total) * 100) : 0;

  const updateStatus = (id: string, status: Lead['status']) => {
    setLeads(leads.map(l => l.id === id ? { ...l, status } : l));
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold pl-1">영업 대시보드</h2>
        <p className="text-sm text-stone-500 mt-1">미가입 상가 관리 · 컨택 이력 추적</p>
      </div>

      {/* Funnel Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        <FunnelCard label="전체 리드" value={counts.total} accent="text-stone-800" />
        <FunnelCard label="신규" value={counts.new} accent="text-[#B85C38]" />
        <FunnelCard label="연락완료" value={counts.contacted} accent="text-amber-600" />
        <FunnelCard label="관심" value={counts.interested} accent="text-emerald-500" />
        <FunnelCard label="가입완료" value={counts.registered} accent="text-[#D4956A]" />
        <FunnelCard label="거절" value={counts.rejected} accent="text-red-500" />
      </div>

      {/* Conversion Rates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-stone-600">전환율 (가입완료/전체)</span>
            <span className="text-2xl font-bold text-[#D4956A]">{conversionRate}%</span>
          </div>
          <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#D4956A] rounded-full transition-all" style={{ width: `${conversionRate}%` }} />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-stone-600">관심률 (관심+가입/전체)</span>
            <span className="text-2xl font-bold text-emerald-500">{interestRate}%</span>
          </div>
          <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#B85C38] rounded-full transition-all" style={{ width: `${interestRate}%` }} />
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-4 h-4 text-stone-400 shrink-0" />
        <span className="text-xs text-stone-500 font-medium shrink-0">상태 필터</span>
        {(['all', 'new', 'contacted', 'interested', 'registered', 'rejected'] as const).map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`text-xs px-3 py-1.5 rounded-full font-medium transition whitespace-nowrap ${
              filter === s ? 'bg-stone-900 text-white' : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            {s === 'all' ? '전체' : STATUS_MAP[s].label}
          </button>
        ))}
      </div>

      {/* Lead List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-10 text-center">
            <p className="text-sm text-stone-400">해당 상태의 리드가 없습니다</p>
          </div>
        ) : (
          filtered.map(lead => {
            const st = STATUS_MAP[lead.status];
            const isExpanded = expandedId === lead.id;
            return (
              <div key={lead.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div
                  className="flex items-center gap-4 p-4 cursor-pointer hover:bg-stone-50 transition"
                  onClick={() => setExpandedId(isExpanded ? null : lead.id)}
                >
                  {/* Status badge */}
                  <span className={`text-xs font-bold ${st.cls} shrink-0`}>
                    {st.label}
                  </span>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-stone-900">{lead.shopName}</span>
                      <span className="text-xs text-stone-400">{lead.category}</span>
                    </div>
                    <p className="text-xs text-stone-500 truncate">{lead.address}</p>
                  </div>

                  {/* Owner & Contact */}
                  <div className="hidden sm:block text-right shrink-0">
                    <p className="text-sm font-medium text-stone-700">{lead.ownerName}</p>
                    <p className="text-xs text-stone-400">{lead.phone}</p>
                  </div>

                  {/* Contact count */}
                  <div className="flex items-center gap-1 shrink-0">
                    <MessageSquare className="w-4 h-4 text-stone-300" />
                    <span className="text-xs font-medium text-stone-500">{lead.contactLogs.length}</span>
                  </div>

                  {/* Chevron */}
                  <svg className={`w-4 h-4 text-stone-300 transition ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {/* Expanded Detail */}
                {isExpanded && (
                  <div className="border-t border-stone-100 px-4 py-4 bg-stone-50">
                    {/* Quick Actions */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xs text-stone-500 font-medium mr-1">상태 변경:</span>
                      {(['new', 'contacted', 'interested', 'registered', 'rejected'] as const).map(s => (
                        <button
                          key={s}
                          onClick={() => updateStatus(lead.id, s)}
                          className={`text-xs font-medium transition ${
                            lead.status === s ? `${STATUS_MAP[s].cls} font-bold` : 'text-stone-400 hover:text-stone-600'
                          }`}
                        >
                          {STATUS_MAP[s].label}
                        </button>
                      ))}
                    </div>

                    {/* Contact History */}
                    <h4 className="text-xs font-bold text-stone-600 mb-2">컨택 이력</h4>
                    {lead.contactLogs.length === 0 ? (
                      <p className="text-xs text-stone-400 py-2">아직 컨택 이력이 없습니다</p>
                    ) : (
                      <div className="space-y-2">
                        {lead.contactLogs.map((log, i) => (
                          <div key={i} className="flex items-start gap-3 bg-white rounded-lg p-3 border border-stone-100">
                            <div className="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 shrink-0 mt-0.5">
                              {METHOD_ICON[log.method]}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-stone-700">{log.date}</span>
                                <span className="text-xs text-stone-400">
                                  {log.method === 'phone' ? '전화' : log.method === 'visit' ? '방문' : '이메일'}
                                </span>
                                <span className={`text-xs font-medium ${
                                  log.result === 'interested' ? 'text-emerald-500' :
                                  log.result === 'rejected' ? 'text-red-500' :
                                  log.result === 'callback' ? 'text-amber-600' :
                                  'text-stone-500'
                                }`}>
                                  {RESULT_LABEL[log.result]}
                                </span>
                              </div>
                              <p className="text-xs text-stone-600 mt-1">{log.note}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

const FunnelCard: React.FC<{ label: string; value: number; accent: string }> = ({ label, value, accent }) => (
  <div className="bg-white rounded-lg shadow-sm p-4 text-center">
    <p className="text-xs text-stone-400 font-medium">{label}</p>
    <p className={`text-2xl font-bold mt-1 ${accent}`}>{value}</p>
  </div>
);
