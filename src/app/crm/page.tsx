'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
  getLeads,
  getOverdueLeads,
  getRecentActivities,
  getReminders,
  getWonThisMonth,
  completeReminder,
} from '@/lib/crm/storage'
import type { Lead, Reminder } from '@/lib/crm/types'
import { STATUS_LABELS, STATUS_COLORS, PROJECT_LABELS } from '@/lib/crm/types'

const ACTIVITY_ICONS: Record<string, string> = {
  call: '📞',
  email: '✉️',
  text: '💬',
  note: '📝',
  visit: '🏠',
  quote: '📋',
  measurement: '📐',
}

function daysSince(iso: string): number {
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86400000)
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function formatCurrency(n: number): string {
  return n >= 1000 ? `$${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k` : `$${n}`
}

export default function CRMDashboard() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [overdueLeads, setOverdueLeads] = useState<Lead[]>([])
  const [todayReminders, setTodayReminders] = useState<Reminder[]>([])
  const [overdueReminders, setOverdueReminders] = useState<Reminder[]>([])
  const [recentActivity, setRecentActivity] = useState<ReturnType<typeof getRecentActivities>>([])
  const [wonMonth, setWonMonth] = useState<Lead[]>([])

  function load() {
    const allLeads = getLeads()
    const today = new Date().toISOString().split('T')[0]
    const reminders = getReminders().filter((r) => !r.completed)

    setLeads(allLeads)
    setOverdueLeads(getOverdueLeads())
    setTodayReminders(reminders.filter((r) => r.dueDate === today))
    setOverdueReminders(reminders.filter((r) => r.dueDate < today))
    setRecentActivity(getRecentActivities(10))
    setWonMonth(getWonThisMonth())
  }

  useEffect(() => { load() }, [])

  const activeLeads = leads.filter((l) => l.status !== 'won' && l.status !== 'lost')
  const pipelineValue = activeLeads.reduce((s, l) => s + l.estimatedValue, 0)
  const wonValue = wonMonth.reduce((s, l) => s + l.estimatedValue, 0)

  const stageCounts = leads.reduce((acc, l) => {
    acc[l.status] = (acc[l.status] ?? 0) + 1
    return acc
  }, {} as Record<string, number>)

  const handleComplete = (id: string) => {
    completeReminder(id)
    load()
  }

  const urgentReminders = [...overdueReminders, ...todayReminders]

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-dark font-heading">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
        <Link
          href="/crm/leads/new"
          className="bg-teal text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-teal-dark transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Lead
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Active Leads',
            value: activeLeads.length,
            sub: `${leads.filter((l) => l.status === 'new').length} new this period`,
            color: 'text-teal',
            bg: 'bg-teal/10',
            icon: (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            ),
          },
          {
            label: 'Pipeline Value',
            value: `$${pipelineValue.toLocaleString()}`,
            sub: 'across active deals',
            color: 'text-brand-blue',
            bg: 'bg-blue-50',
            icon: (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ),
          },
          {
            label: 'Overdue Follow-Ups',
            value: overdueReminders.length + overdueLeads.length,
            sub: 'need your attention',
            color: overdueReminders.length > 0 ? 'text-red-600' : 'text-gray-400',
            bg: overdueReminders.length > 0 ? 'bg-red-50' : 'bg-gray-50',
            icon: (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ),
          },
          {
            label: 'Won This Month',
            value: wonValue > 0 ? `$${wonValue.toLocaleString()}` : wonMonth.length,
            sub: `${wonMonth.length} deal${wonMonth.length !== 1 ? 's' : ''} closed`,
            color: 'text-green-600',
            bg: 'bg-green-50',
            icon: (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            ),
          },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{stat.label}</p>
                <p className={`text-2xl font-bold mt-1 font-heading ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-gray-400 mt-1">{stat.sub}</p>
              </div>
              <div className={`${stat.bg} ${stat.color} p-2.5 rounded-lg`}>{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Urgent Reminders */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-brand-dark flex items-center gap-2">
              <span className="text-red-500">🔔</span>
              {urgentReminders.length > 0
                ? `Action Required (${urgentReminders.length})`
                : "Today's Tasks"}
            </h2>
            <Link href="/crm/reminders" className="text-xs text-teal hover:text-teal-dark font-medium">
              View all →
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {urgentReminders.length === 0 ? (
              <div className="px-5 py-10 text-center text-gray-400">
                <svg className="w-10 h-10 mx-auto mb-2 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm font-medium">All caught up!</p>
                <p className="text-xs mt-1">No overdue or today&apos;s reminders</p>
              </div>
            ) : (
              urgentReminders.slice(0, 6).map((r) => {
                const isOverdue = r.dueDate < new Date().toISOString().split('T')[0]
                return (
                  <div key={r.id} className="px-5 py-3.5 flex items-start gap-3 hover:bg-gray-50 transition-colors">
                    <div className={`mt-0.5 flex-shrink-0 w-2 h-2 rounded-full ${isOverdue ? 'bg-red-500' : 'bg-orange-400'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-brand-dark">{r.title}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <Link href={`/crm/leads/${r.leadId}`} className="text-xs text-teal hover:underline">
                          {r.leadName}
                        </Link>
                        <span className="text-xs text-gray-400">→ {r.assignedTo}</span>
                        {isOverdue && (
                          <span className="text-xs font-semibold text-red-500">
                            Overdue {Math.floor((Date.now() - new Date(r.dueDate).getTime()) / 86400000)}d
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleComplete(r.id)}
                      className="flex-shrink-0 text-xs bg-green-50 text-green-700 hover:bg-green-100 px-2 py-1 rounded-md font-medium transition-colors"
                    >
                      Done
                    </button>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Pipeline Snapshot */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-brand-dark">Pipeline</h2>
            <Link href="/crm/pipeline" className="text-xs text-teal hover:text-teal-dark font-medium">
              View →
            </Link>
          </div>
          <div className="px-5 py-4 space-y-3">
            {(['new', 'consultation', 'quoted', 'followup', 'won'] as const).map((status) => {
              const count = stageCounts[status] ?? 0
              const value = leads
                .filter((l) => l.status === status)
                .reduce((s, l) => s + l.estimatedValue, 0)
              return (
                <div key={status}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-600">{STATUS_LABELS[status]}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">{count}</span>
                      {value > 0 && (
                        <span className="text-xs font-semibold text-teal">{formatCurrency(value)}</span>
                      )}
                    </div>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        status === 'won'
                          ? 'bg-green-500'
                          : status === 'new'
                          ? 'bg-blue-400'
                          : status === 'consultation'
                          ? 'bg-yellow-400'
                          : status === 'quoted'
                          ? 'bg-purple-500'
                          : 'bg-orange-400'
                      }`}
                      style={{ width: `${Math.min(100, (count / Math.max(1, activeLeads.length)) * 100)}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Needs Attention + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Overdue Leads */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-brand-dark">Leads Going Cold</h2>
            <Link href="/crm/leads" className="text-xs text-teal hover:text-teal-dark font-medium">
              All leads →
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {overdueLeads.length === 0 ? (
              <div className="px-5 py-8 text-center text-gray-400 text-sm">
                No leads going cold — great work!
              </div>
            ) : (
              overdueLeads.slice(0, 5).map((lead) => (
                <Link
                  key={lead.id}
                  href={`/crm/leads/${lead.id}`}
                  className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-orange-600">
                      {lead.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-brand-dark truncate">{lead.name}</p>
                    <p className="text-xs text-gray-400">
                      {PROJECT_LABELS[lead.projectType]} · {daysSince(lead.updatedAt)}d since contact
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[lead.status]}`}>
                    {STATUS_LABELS[lead.status]}
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-brand-dark">Recent Activity</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {recentActivity.length === 0 ? (
              <div className="px-5 py-8 text-center text-gray-400 text-sm">No activity yet</div>
            ) : (
              recentActivity.slice(0, 6).map((a) => (
                <div key={a.id} className="px-5 py-3 flex items-start gap-3">
                  <span className="text-base flex-shrink-0 mt-0.5">{ACTIVITY_ICONS[a.type] ?? '📌'}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-brand-dark line-clamp-1">{a.description}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Link href={`/crm/leads/${a.leadId}`} className="text-xs text-teal hover:underline truncate">
                        {a.leadName}
                      </Link>
                      <span className="text-xs text-gray-400">· {a.createdBy} · {formatDate(a.createdAt)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Pro Tips Banner */}
      <div className="bg-gradient-to-r from-[#111c1c] to-[#1e3530] rounded-xl p-5 text-white">
        <h3 className="font-semibold text-sm text-teal-light uppercase tracking-wide mb-3">Sales Playbook Tips</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          {[
            { icon: '⚡', tip: 'Speed to lead wins deals. Call new inquiries within 2 hours — your close rate triples.' },
            { icon: '📸', tip: 'Text photos of similar completed projects when following up. Visuals close deals faster.' },
            { icon: '🗓️', tip: 'Always end every call with a specific next step: "I\'ll call you Thursday at 2pm — does that work?"' },
          ].map((t, i) => (
            <div key={i} className="flex items-start gap-3 bg-white/5 rounded-lg p-3">
              <span className="text-xl">{t.icon}</span>
              <p className="text-gray-300 text-xs leading-relaxed">{t.tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
