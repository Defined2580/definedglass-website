'use client'

import Link from 'next/link'
import { useEffect, useState, useMemo } from 'react'
import { getLeads } from '@/lib/crm/storage'
import type { Lead, LeadStatus, ProjectType } from '@/lib/crm/types'
import { STATUS_LABELS, STATUS_COLORS, PROJECT_LABELS, SOURCE_LABELS } from '@/lib/crm/types'

function daysSince(iso: string): number {
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86400000)
}

function priorityDot(p: string) {
  return p === 'high' ? 'bg-red-500' : p === 'medium' ? 'bg-yellow-400' : 'bg-gray-300'
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all')
  const [typeFilter, setTypeFilter] = useState<ProjectType | 'all'>('all')
  const [assignedFilter, setAssignedFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'updatedAt' | 'estimatedValue' | 'createdAt'>('updatedAt')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    setLeads(getLeads())
  }, [])

  const filtered = useMemo(() => {
    let list = leads
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.phone.includes(q) ||
          l.email.toLowerCase().includes(q) ||
          l.city.toLowerCase().includes(q)
      )
    }
    if (statusFilter !== 'all') list = list.filter((l) => l.status === statusFilter)
    if (typeFilter !== 'all') list = list.filter((l) => l.projectType === typeFilter)
    if (assignedFilter !== 'all') list = list.filter((l) => l.assignedTo === assignedFilter)

    return [...list].sort((a, b) => {
      const av = a[sortBy] ?? ''
      const bv = b[sortBy] ?? ''
      const cmp = String(av).localeCompare(String(bv))
      return sortDir === 'desc' ? -cmp : cmp
    })
  }, [leads, search, statusFilter, typeFilter, assignedFilter, sortBy, sortDir])

  const teamMembers = [...new Set(leads.map((l) => l.assignedTo))]

  function toggleSort(col: typeof sortBy) {
    if (sortBy === col) setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'))
    else { setSortBy(col); setSortDir('desc') }
  }

  const SortIcon = ({ col }: { col: typeof sortBy }) => (
    <span className="ml-1 text-gray-400">
      {sortBy === col ? (sortDir === 'desc' ? '↓' : '↑') : '↕'}
    </span>
  )

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-dark font-heading">Leads</h1>
          <p className="text-gray-500 text-sm mt-0.5">{filtered.length} of {leads.length} leads</p>
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

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search name, phone, email, city…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as LeadStatus | 'all')}
            className="border border-gray-200 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal/30 bg-white"
          >
            <option value="all">All Statuses</option>
            {(Object.entries(STATUS_LABELS) as [LeadStatus, string][]).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as ProjectType | 'all')}
            className="border border-gray-200 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal/30 bg-white"
          >
            <option value="all">All Types</option>
            {(Object.entries(PROJECT_LABELS) as [ProjectType, string][]).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
          <select
            value={assignedFilter}
            onChange={(e) => setAssignedFilter(e.target.value)}
            className="border border-gray-200 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal/30 bg-white"
          >
            <option value="all">All Team</option>
            {teamMembers.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        {/* Quick status tabs */}
        <div className="flex gap-2 mt-3 flex-wrap">
          {(['all', 'new', 'consultation', 'quoted', 'followup', 'won', 'lost'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                statusFilter === s
                  ? 'bg-teal text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {s === 'all' ? 'All' : STATUS_LABELS[s]}
              <span className="ml-1 opacity-70">
                ({s === 'all' ? leads.length : leads.filter((l) => l.status === s).length})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">
                  Lead
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">
                  Project
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">
                  Status
                </th>
                <th
                  className="text-right px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide cursor-pointer hover:text-teal"
                  onClick={() => toggleSort('estimatedValue')}
                >
                  Value <SortIcon col="estimatedValue" />
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">
                  Assigned
                </th>
                <th
                  className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide cursor-pointer hover:text-teal"
                  onClick={() => toggleSort('updatedAt')}
                >
                  Last Contact <SortIcon col="updatedAt" />
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">
                  Follow-Up
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-gray-400">
                    <svg className="w-10 h-10 mx-auto mb-2 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    No leads match your filters
                  </td>
                </tr>
              ) : (
                filtered.map((lead) => {
                  const age = daysSince(lead.updatedAt)
                  const isStale = age > 4 && lead.status !== 'won' && lead.status !== 'lost'
                  const followUpOverdue =
                    lead.nextFollowUp && lead.nextFollowUp < new Date().toISOString().split('T')[0]

                  return (
                    <tr
                      key={lead.id}
                      className={`hover:bg-gray-50 transition-colors ${isStale ? 'bg-orange-50/30' : ''}`}
                    >
                      {/* Lead info */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${priorityDot(lead.priority)}`} />
                          <div>
                            <Link
                              href={`/crm/leads/${lead.id}`}
                              className="font-medium text-brand-dark hover:text-teal transition-colors"
                            >
                              {lead.name}
                            </Link>
                            <p className="text-xs text-gray-400">
                              {lead.phone} · {lead.city}, {lead.state}
                            </p>
                          </div>
                        </div>
                      </td>
                      {/* Project */}
                      <td className="px-4 py-3">
                        <p className="text-gray-700">{PROJECT_LABELS[lead.projectType]}</p>
                        <p className="text-xs text-gray-400">{SOURCE_LABELS[lead.source]}</p>
                      </td>
                      {/* Status */}
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[lead.status]}`}>
                          {STATUS_LABELS[lead.status]}
                        </span>
                      </td>
                      {/* Value */}
                      <td className="px-4 py-3 text-right">
                        <span className="font-semibold text-brand-dark">
                          ${lead.estimatedValue.toLocaleString()}
                        </span>
                      </td>
                      {/* Assigned */}
                      <td className="px-4 py-3">
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                          {lead.assignedTo}
                        </span>
                      </td>
                      {/* Last Contact */}
                      <td className="px-4 py-3">
                        <span className={`text-sm ${isStale ? 'text-orange-600 font-semibold' : 'text-gray-500'}`}>
                          {age === 0 ? 'Today' : age === 1 ? 'Yesterday' : `${age}d ago`}
                        </span>
                      </td>
                      {/* Follow-up */}
                      <td className="px-4 py-3">
                        {lead.nextFollowUp ? (
                          <span className={`text-xs ${followUpOverdue ? 'text-red-600 font-semibold' : 'text-gray-500'}`}>
                            {followUpOverdue && '⚠ '}
                            {new Date(lead.nextFollowUp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-300">—</span>
                        )}
                      </td>
                      {/* Actions */}
                      <td className="px-4 py-3">
                        <Link
                          href={`/crm/leads/${lead.id}`}
                          className="text-teal hover:text-teal-dark font-medium text-xs"
                        >
                          View →
                        </Link>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
        {/* Table footer */}
        {filtered.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between text-xs text-gray-500">
            <span>
              Total pipeline:{' '}
              <strong className="text-teal">
                ${filtered
                  .filter((l) => l.status !== 'won' && l.status !== 'lost')
                  .reduce((s, l) => s + l.estimatedValue, 0)
                  .toLocaleString()}
              </strong>
            </span>
            <span>
              {filtered.filter((l) => l.status === 'won').length} won ·{' '}
              {filtered.filter((l) => l.status === 'lost').length} lost
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
