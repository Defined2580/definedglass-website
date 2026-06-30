'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  getLead,
  saveLead,
  deleteLead,
  getLeadActivities,
  saveActivity,
  getLeadReminders,
  saveReminder,
  completeReminder,
  deleteReminder,
  generateId,
} from '@/lib/crm/storage'
import type { Lead, Activity, Reminder, LeadStatus, ProjectType, LeadSource, Priority } from '@/lib/crm/types'
import {
  STATUS_LABELS,
  STATUS_COLORS,
  PROJECT_LABELS,
  SOURCE_LABELS,
  TEAM_MEMBERS,
} from '@/lib/crm/types'

const ACTIVITY_ICONS: Record<string, { icon: string; color: string }> = {
  call: { icon: '📞', color: 'bg-green-50 text-green-600' },
  email: { icon: '✉️', color: 'bg-blue-50 text-blue-600' },
  text: { icon: '💬', color: 'bg-purple-50 text-purple-600' },
  note: { icon: '📝', color: 'bg-yellow-50 text-yellow-600' },
  visit: { icon: '🏠', color: 'bg-teal-50 text-teal-600' },
  quote: { icon: '📋', color: 'bg-orange-50 text-orange-600' },
  measurement: { icon: '📐', color: 'bg-pink-50 text-pink-600' },
}

const ACTIVITY_LABELS: Record<string, string> = {
  call: 'Phone Call',
  email: 'Email',
  text: 'Text/SMS',
  note: 'Note',
  visit: 'Site Visit',
  quote: 'Quote Sent',
  measurement: 'Measurement',
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit',
  })
}

function daysSince(iso: string): number {
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86400000)
}

export default function LeadDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const [lead, setLead] = useState<Lead | null>(null)
  const [activities, setActivities] = useState<Activity[]>([])
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [editing, setEditing] = useState(false)
  const [showActivityForm, setShowActivityForm] = useState(false)
  const [showReminderForm, setShowReminderForm] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [editForm, setEditForm] = useState<Partial<Lead>>({})
  const [actForm, setActForm] = useState({ type: 'call', description: '', createdBy: 'EJ' })
  const [remForm, setRemForm] = useState({ title: '', dueDate: '', assignedTo: 'EJ' })

  function load() {
    const l = getLead(id)
    if (!l) { router.replace('/crm/leads'); return }
    setLead(l)
    setEditForm(l)
    setActivities(getLeadActivities(id))
    setReminders(getLeadReminders(id))
  }

  useEffect(() => { load() }, [id])

  function saveEdit() {
    if (!lead) return
    const updated: Lead = { ...lead, ...editForm, updatedAt: new Date().toISOString() }
    saveLead(updated)
    setLead(updated)
    setEditing(false)
  }

  function logActivity(e: React.FormEvent) {
    e.preventDefault()
    const activity: Activity = {
      id: generateId(),
      leadId: id,
      type: actForm.type as Activity['type'],
      description: actForm.description,
      createdAt: new Date().toISOString(),
      createdBy: actForm.createdBy,
    }
    saveActivity(activity)
    setActForm({ type: 'call', description: '', createdBy: actForm.createdBy })
    setShowActivityForm(false)
    load()
  }

  function addReminder(e: React.FormEvent) {
    e.preventDefault()
    if (!lead) return
    const reminder: Reminder = {
      id: generateId(),
      leadId: id,
      leadName: lead.name,
      title: remForm.title,
      dueDate: remForm.dueDate,
      assignedTo: remForm.assignedTo,
      completed: false,
      createdAt: new Date().toISOString(),
    }
    saveReminder(reminder)
    setRemForm({ title: '', dueDate: '', assignedTo: remForm.assignedTo })
    setShowReminderForm(false)
    load()
  }

  function changeStatus(status: LeadStatus) {
    if (!lead) return
    const updated = { ...lead, status, updatedAt: new Date().toISOString() }
    saveLead(updated)
    setLead(updated)
  }

  function handleDelete() {
    deleteLead(id)
    router.push('/crm/leads')
  }

  if (!lead) return null

  const inputClass = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal'
  const labelClass = 'block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1'
  const today = new Date().toISOString().split('T')[0]
  const pendingReminders = reminders.filter((r) => !r.completed)

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Link href="/crm/leads" className="text-gray-400 hover:text-teal transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-brand-dark font-heading">{lead.name}</h1>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[lead.status]}`}>
                {STATUS_LABELS[lead.status]}
              </span>
              <span className="text-xs text-gray-400">
                Added {daysSince(lead.createdAt)}d ago · Last contact {daysSince(lead.updatedAt)}d ago
              </span>
              {lead.estimatedValue > 0 && (
                <span className="text-xs font-bold text-teal">${lead.estimatedValue.toLocaleString()}</span>
              )}
            </div>
          </div>
        </div>

        {/* Quick status change */}
        <div className="flex items-center gap-2 flex-wrap">
          {(['new', 'consultation', 'quoted', 'followup', 'won', 'lost'] as LeadStatus[]).map((s) => (
            <button
              key={s}
              onClick={() => changeStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                lead.status === s
                  ? 'bg-teal text-white'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2 flex-wrap">
        {[
          { label: '📞 Log Call', act: () => { setActForm(f => ({ ...f, type: 'call' })); setShowActivityForm(true) } },
          { label: '✉️ Log Email', act: () => { setActForm(f => ({ ...f, type: 'email' })); setShowActivityForm(true) } },
          { label: '💬 Log Text', act: () => { setActForm(f => ({ ...f, type: 'text' })); setShowActivityForm(true) } },
          { label: '📝 Add Note', act: () => { setActForm(f => ({ ...f, type: 'note' })); setShowActivityForm(true) } },
          { label: '📋 Log Quote', act: () => { setActForm(f => ({ ...f, type: 'quote' })); setShowActivityForm(true) } },
          { label: '🔔 Set Reminder', act: () => setShowReminderForm(true) },
        ].map((btn) => (
          <button
            key={btn.label}
            onClick={btn.act}
            className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 hover:border-teal transition-colors"
          >
            {btn.label}
          </button>
        ))}
        <button
          onClick={() => setEditing(!editing)}
          className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 hover:border-teal transition-colors ml-auto"
        >
          ✏️ Edit Lead
        </button>
        <button
          onClick={() => setConfirmDelete(true)}
          className="px-3 py-1.5 bg-white border border-red-200 rounded-lg text-xs font-medium text-red-500 hover:bg-red-50 transition-colors"
        >
          Delete
        </button>
      </div>

      {/* Activity Form Modal */}
      {showActivityForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="font-bold text-brand-dark mb-4">Log Activity — {lead.name}</h3>
            <form onSubmit={logActivity} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(ACTIVITY_LABELS).map(([k, v]) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setActForm((f) => ({ ...f, type: k }))}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${
                      actForm.type === k
                        ? 'bg-teal text-white border-teal'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {ACTIVITY_ICONS[k]?.icon} {v}
                  </button>
                ))}
              </div>
              <div>
                <label className={labelClass}>Notes *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="What happened? Be specific — it helps with follow-up."
                  value={actForm.description}
                  onChange={(e) => setActForm((f) => ({ ...f, description: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Logged By</label>
                <select
                  value={actForm.createdBy}
                  onChange={(e) => setActForm((f) => ({ ...f, createdBy: e.target.value }))}
                  className={inputClass}
                >
                  {TEAM_MEMBERS.filter((m) => m !== 'All Team').map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3">
                <button type="submit" className="flex-1 bg-teal text-white py-2 rounded-lg font-semibold text-sm hover:bg-teal-dark">
                  Save
                </button>
                <button type="button" onClick={() => setShowActivityForm(false)} className="flex-1 border border-gray-200 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reminder Form Modal */}
      {showReminderForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="font-bold text-brand-dark mb-4">Set Reminder — {lead.name}</h3>
            <form onSubmit={addReminder} className="space-y-4">
              <div>
                <label className={labelClass}>What to do? *</label>
                <input
                  required
                  type="text"
                  placeholder="Call to follow up on quote, schedule site visit…"
                  value={remForm.title}
                  onChange={(e) => setRemForm((f) => ({ ...f, title: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Due Date *</label>
                <input
                  required
                  type="date"
                  min={today}
                  value={remForm.dueDate}
                  onChange={(e) => setRemForm((f) => ({ ...f, dueDate: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Assign To</label>
                <select
                  value={remForm.assignedTo}
                  onChange={(e) => setRemForm((f) => ({ ...f, assignedTo: e.target.value }))}
                  className={inputClass}
                >
                  {TEAM_MEMBERS.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div className="flex gap-3">
                <button type="submit" className="flex-1 bg-teal text-white py-2 rounded-lg font-semibold text-sm hover:bg-teal-dark">
                  Set Reminder
                </button>
                <button type="button" onClick={() => setShowReminderForm(false)} className="flex-1 border border-gray-200 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 text-center">
            <h3 className="font-bold text-brand-dark mb-2">Delete {lead.name}?</h3>
            <p className="text-sm text-gray-500 mb-4">This removes the lead and all activity history. This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={handleDelete} className="flex-1 bg-red-500 text-white py-2 rounded-lg font-semibold text-sm hover:bg-red-600">
                Delete
              </button>
              <button onClick={() => setConfirmDelete(false)} className="flex-1 border border-gray-200 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Lead Info + Edit */}
        <div className="space-y-5">
          {/* Contact Card */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h2 className="font-semibold text-brand-dark mb-4">Contact</h2>
            {editing ? (
              <div className="space-y-3">
                <div>
                  <label className={labelClass}>Name</label>
                  <input value={editForm.name ?? ''} onChange={(e) => setEditForm(f => ({ ...f, name: e.target.value }))} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Phone</label>
                  <input value={editForm.phone ?? ''} onChange={(e) => setEditForm(f => ({ ...f, phone: e.target.value }))} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Email</label>
                  <input value={editForm.email ?? ''} onChange={(e) => setEditForm(f => ({ ...f, email: e.target.value }))} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Address</label>
                  <input value={editForm.address ?? ''} onChange={(e) => setEditForm(f => ({ ...f, address: e.target.value }))} className={inputClass} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className={labelClass}>City</label>
                    <input value={editForm.city ?? ''} onChange={(e) => setEditForm(f => ({ ...f, city: e.target.value }))} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>State</label>
                    <input value={editForm.state ?? ''} onChange={(e) => setEditForm(f => ({ ...f, state: e.target.value }))} className={inputClass} maxLength={2} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {[
                  { icon: '📞', label: 'Phone', val: lead.phone, href: `tel:${lead.phone.replace(/\D/g, '')}` },
                  { icon: '✉️', label: 'Email', val: lead.email, href: `mailto:${lead.email}` },
                  { icon: '📍', label: 'Location', val: [lead.address, lead.city, lead.state].filter(Boolean).join(', ') },
                ].map(({ icon, label, val, href }) =>
                  val ? (
                    <div key={label} className="flex items-start gap-2">
                      <span className="text-sm">{icon}</span>
                      <div>
                        <p className="text-xs text-gray-400">{label}</p>
                        {href ? (
                          <a href={href} className="text-sm text-teal hover:underline">{val}</a>
                        ) : (
                          <p className="text-sm text-brand-dark">{val}</p>
                        )}
                      </div>
                    </div>
                  ) : null
                )}
              </div>
            )}
          </div>

          {/* Project Card */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h2 className="font-semibold text-brand-dark mb-4">Project</h2>
            {editing ? (
              <div className="space-y-3">
                <div>
                  <label className={labelClass}>Project Type</label>
                  <select value={editForm.projectType ?? ''} onChange={(e) => setEditForm(f => ({ ...f, projectType: e.target.value as ProjectType }))} className={inputClass}>
                    {(Object.entries(PROJECT_LABELS) as [ProjectType, string][]).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Source</label>
                  <select value={editForm.source ?? ''} onChange={(e) => setEditForm(f => ({ ...f, source: e.target.value as LeadSource }))} className={inputClass}>
                    {(Object.entries(SOURCE_LABELS) as [LeadSource, string][]).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Details</label>
                  <textarea rows={3} value={editForm.projectDetails ?? ''} onChange={(e) => setEditForm(f => ({ ...f, projectDetails: e.target.value }))} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Est. Value ($)</label>
                  <input type="number" value={editForm.estimatedValue ?? ''} onChange={(e) => setEditForm(f => ({ ...f, estimatedValue: parseFloat(e.target.value) || 0 }))} className={inputClass} />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-400">Type</p>
                  <p className="text-sm font-medium text-brand-dark">{PROJECT_LABELS[lead.projectType]}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Value</p>
                  <p className="text-sm font-bold text-teal">${lead.estimatedValue.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Source</p>
                  <p className="text-sm text-brand-dark">{SOURCE_LABELS[lead.source]}</p>
                </div>
                {lead.projectDetails && (
                  <div>
                    <p className="text-xs text-gray-400">Details</p>
                    <p className="text-sm text-brand-dark leading-relaxed">{lead.projectDetails}</p>
                  </div>
                )}
                {lead.lostReason && (
                  <div className="bg-red-50 rounded-lg p-3">
                    <p className="text-xs text-red-500 font-semibold">Lost Reason</p>
                    <p className="text-sm text-red-700 mt-0.5">{lead.lostReason}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* CRM Settings Card */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h2 className="font-semibold text-brand-dark mb-4">Assignment</h2>
            {editing ? (
              <div className="space-y-3">
                <div>
                  <label className={labelClass}>Assigned To</label>
                  <select value={editForm.assignedTo ?? ''} onChange={(e) => setEditForm(f => ({ ...f, assignedTo: e.target.value }))} className={inputClass}>
                    {TEAM_MEMBERS.filter((m) => m !== 'All Team').map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Priority</label>
                  <select value={editForm.priority ?? ''} onChange={(e) => setEditForm(f => ({ ...f, priority: e.target.value as Priority }))} className={inputClass}>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Follow-Up Date</label>
                  <input type="date" value={editForm.nextFollowUp ?? ''} onChange={(e) => setEditForm(f => ({ ...f, nextFollowUp: e.target.value || null }))} className={inputClass} />
                </div>
                {lead.status === 'lost' && (
                  <div>
                    <label className={labelClass}>Lost Reason</label>
                    <input value={editForm.lostReason ?? ''} onChange={(e) => setEditForm(f => ({ ...f, lostReason: e.target.value }))} className={inputClass} placeholder="Why did we lose this?" />
                  </div>
                )}
                <div className="flex gap-2 pt-2">
                  <button onClick={saveEdit} className="flex-1 bg-teal text-white py-2 rounded-lg text-sm font-semibold hover:bg-teal-dark">
                    Save Changes
                  </button>
                  <button onClick={() => setEditing(false)} className="flex-1 border border-gray-200 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <p className="text-xs text-gray-400">Assigned To</p>
                  <span className="text-sm font-semibold text-brand-dark bg-gray-100 px-2 py-0.5 rounded-full">{lead.assignedTo}</span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-gray-400">Priority</p>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${lead.priority === 'high' ? 'bg-red-100 text-red-700' : lead.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-500'}`}>
                    {lead.priority.toUpperCase()}
                  </span>
                </div>
                {lead.nextFollowUp && (
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-400">Next Follow-Up</p>
                    <span className={`text-xs font-medium ${lead.nextFollowUp < today ? 'text-red-600' : 'text-brand-dark'}`}>
                      {lead.nextFollowUp < today && '⚠ '}
                      {new Date(lead.nextFollowUp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                )}
                {lead.tags.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Tags</p>
                    <div className="flex flex-wrap gap-1">
                      {lead.tags.map((t) => (
                        <span key={t} className="text-xs bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full">{t}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right: Activity Timeline + Reminders */}
        <div className="lg:col-span-2 space-y-5">
          {/* Reminders */}
          {pendingReminders.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <h2 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
                <span>🔔</span> Open Reminders ({pendingReminders.length})
              </h2>
              <div className="space-y-2">
                {pendingReminders.map((r) => {
                  const isOverdue = r.dueDate < today
                  return (
                    <div key={r.id} className="flex items-start gap-3 bg-white rounded-lg p-3">
                      <div className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${isOverdue ? 'bg-red-500' : 'bg-amber-400'}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-brand-dark">{r.title}</p>
                        <p className={`text-xs mt-0.5 ${isOverdue ? 'text-red-500 font-semibold' : 'text-gray-400'}`}>
                          {isOverdue ? 'Overdue · ' : ''}
                          {new Date(r.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · {r.assignedTo}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => { completeReminder(r.id); load() }} className="text-xs bg-green-100 text-green-700 hover:bg-green-200 px-2 py-1 rounded font-medium">
                          Done
                        </button>
                        <button onClick={() => { deleteReminder(r.id); load() }} className="text-xs text-gray-400 hover:text-red-500 px-1">
                          ×
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Activity Timeline */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-brand-dark">Activity Timeline</h2>
              <button
                onClick={() => setShowActivityForm(true)}
                className="text-xs bg-teal text-white px-3 py-1.5 rounded-lg font-medium hover:bg-teal-dark transition-colors"
              >
                + Log Activity
              </button>
            </div>

            {activities.length === 0 ? (
              <div className="px-5 py-12 text-center text-gray-400">
                <span className="text-4xl block mb-2">📋</span>
                <p className="text-sm font-medium">No activity yet</p>
                <p className="text-xs mt-1">Log a call, email, or note to start tracking</p>
                <button
                  onClick={() => setShowActivityForm(true)}
                  className="mt-4 text-xs bg-teal text-white px-4 py-2 rounded-lg font-medium hover:bg-teal-dark transition-colors"
                >
                  Log First Activity
                </button>
              </div>
            ) : (
              <div className="px-5 py-4 space-y-4">
                {activities.map((a, i) => {
                  const meta = ACTIVITY_ICONS[a.type] ?? { icon: '📌', color: 'bg-gray-50 text-gray-500' }
                  return (
                    <div key={a.id} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-base flex-shrink-0 ${meta.color}`}>
                          {meta.icon}
                        </div>
                        {i < activities.length - 1 && <div className="w-px flex-1 bg-gray-100 my-1" />}
                      </div>
                      <div className="flex-1 pb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-semibold text-gray-600">{ACTIVITY_LABELS[a.type] ?? a.type}</span>
                          <span className="text-xs text-gray-400">· {a.createdBy} · {formatDateTime(a.createdAt)}</span>
                        </div>
                        <p className="text-sm text-brand-dark mt-1 leading-relaxed">{a.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Completed Reminders */}
          {reminders.filter((r) => r.completed).length > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
              <div className="px-5 py-3 border-b border-gray-100">
                <h2 className="font-semibold text-gray-400 text-sm">Completed Reminders</h2>
              </div>
              <div className="divide-y divide-gray-50">
                {reminders.filter((r) => r.completed).map((r) => (
                  <div key={r.id} className="px-5 py-2.5 flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <p className="text-sm text-gray-400 line-through">{r.title}</p>
                    <span className="ml-auto text-xs text-gray-300">
                      {new Date(r.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
