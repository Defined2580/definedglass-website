'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { saveLead, generateId } from '@/lib/crm/storage'
import type { Lead, LeadStatus, ProjectType, LeadSource, Priority } from '@/lib/crm/types'
import { PROJECT_LABELS, SOURCE_LABELS, STATUS_LABELS, TEAM_MEMBERS } from '@/lib/crm/types'
import Link from 'next/link'

export default function NewLeadPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: 'NJ',
    source: 'website' as LeadSource,
    projectType: 'shower-doors' as ProjectType,
    projectDetails: '',
    estimatedValue: '',
    status: 'new' as LeadStatus,
    assignedTo: 'EJ',
    priority: 'medium' as Priority,
    nextFollowUp: '',
    tags: '',
  })

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const now = new Date().toISOString()
    const lead: Lead = {
      id: generateId(),
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      city: form.city.trim(),
      state: form.state,
      source: form.source,
      projectType: form.projectType,
      projectDetails: form.projectDetails.trim(),
      estimatedValue: parseFloat(form.estimatedValue) || 0,
      status: form.status,
      assignedTo: form.assignedTo,
      priority: form.priority,
      createdAt: now,
      updatedAt: now,
      nextFollowUp: form.nextFollowUp || null,
      tags: form.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    }
    saveLead(lead)
    router.push(`/crm/leads/${lead.id}`)
  }

  const inputClass =
    'w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal'
  const labelClass = 'block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5'

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/crm/leads" className="text-gray-400 hover:text-teal transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
        <h1 className="text-2xl font-bold text-brand-dark font-heading">New Lead</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contact Info */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
          <h2 className="font-semibold text-brand-dark">Contact Information</h2>
          <div>
            <label className={labelClass}>Full Name / Company *</label>
            <input
              required
              type="text"
              placeholder="John Smith or Acme Corp"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Phone *</label>
              <input
                required
                type="tel"
                placeholder="(732) 555-0000"
                value={form.phone}
                onChange={(e) => set('phone', e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input
                type="email"
                placeholder="email@example.com"
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>Address</label>
            <input
              type="text"
              placeholder="123 Main St"
              value={form.address}
              onChange={(e) => set('address', e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>City</label>
              <input
                type="text"
                placeholder="Howell"
                value={form.city}
                onChange={(e) => set('city', e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>State</label>
              <select value={form.state} onChange={(e) => set('state', e.target.value)} className={inputClass}>
                {['NJ', 'NY', 'PA', 'CT', 'DE', 'MD'].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Project Info */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
          <h2 className="font-semibold text-brand-dark">Project Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Project Type *</label>
              <select
                value={form.projectType}
                onChange={(e) => set('projectType', e.target.value)}
                className={inputClass}
              >
                {(Object.entries(PROJECT_LABELS) as [ProjectType, string][]).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>How Did They Find Us?</label>
              <select
                value={form.source}
                onChange={(e) => set('source', e.target.value)}
                className={inputClass}
              >
                {(Object.entries(SOURCE_LABELS) as [LeadSource, string][]).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className={labelClass}>Project Details</label>
            <textarea
              rows={3}
              placeholder="Describe what they need — size, hardware preference, location in the home, any specifics…"
              value={form.projectDetails}
              onChange={(e) => set('projectDetails', e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Estimated Value ($)</label>
            <input
              type="number"
              placeholder="2500"
              min="0"
              value={form.estimatedValue}
              onChange={(e) => set('estimatedValue', e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        {/* CRM Settings */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
          <h2 className="font-semibold text-brand-dark">CRM Settings</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Status</label>
              <select value={form.status} onChange={(e) => set('status', e.target.value)} className={inputClass}>
                {(Object.entries(STATUS_LABELS) as [LeadStatus, string][]).filter(([k]) => k !== 'won' && k !== 'lost').map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Priority</label>
              <select value={form.priority} onChange={(e) => set('priority', e.target.value)} className={inputClass}>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Assigned To</label>
              <select value={form.assignedTo} onChange={(e) => set('assignedTo', e.target.value)} className={inputClass}>
                {TEAM_MEMBERS.filter((m) => m !== 'All Team').map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className={labelClass}>Follow-Up Date</label>
            <input
              type="date"
              value={form.nextFollowUp}
              onChange={(e) => set('nextFollowUp', e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Tags (comma-separated)</label>
            <input
              type="text"
              placeholder="residential, referral, commercial…"
              value={form.tags}
              onChange={(e) => set('tags', e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="bg-teal text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-teal-dark transition-colors disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save Lead'}
          </button>
          <Link
            href="/crm/leads"
            className="px-6 py-2.5 rounded-lg font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
