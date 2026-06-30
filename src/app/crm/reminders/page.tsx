'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getReminders, completeReminder, deleteReminder, getLeads, saveReminder, generateId } from '@/lib/crm/storage'
import type { Reminder } from '@/lib/crm/types'
import { TEAM_MEMBERS } from '@/lib/crm/types'

function formatDate(d: string): string {
  return new Date(d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

function daysUntil(d: string): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const due = new Date(d)
  due.setHours(0, 0, 0, 0)
  return Math.round((due.getTime() - today.getTime()) / 86400000)
}

export default function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [showComplete, setShowComplete] = useState(false)
  const [filterAssigned, setFilterAssigned] = useState<string>('all')
  const [showForm, setShowForm] = useState(false)
  const [leads, setLeads] = useState<{ id: string; name: string }[]>([])
  const [form, setForm] = useState({ leadId: '', title: '', dueDate: '', assignedTo: 'EJ' })

  function load() {
    setReminders(getReminders())
    setLeads(
      getLeads()
        .filter((l) => l.status !== 'won' && l.status !== 'lost')
        .map((l) => ({ id: l.id, name: l.name }))
        .sort((a, b) => a.name.localeCompare(b.name))
    )
  }

  useEffect(() => { load() }, [])

  const today = new Date().toISOString().split('T')[0]

  let filtered = reminders.filter((r) => showComplete || !r.completed)
  if (filterAssigned !== 'all') filtered = filtered.filter((r) => r.assignedTo === filterAssigned)

  const overdue = filtered.filter((r) => !r.completed && r.dueDate < today)
  const todayList = filtered.filter((r) => !r.completed && r.dueDate === today)
  const upcoming = filtered.filter((r) => !r.completed && r.dueDate > today)
  const completed = filtered.filter((r) => r.completed)

  function handleComplete(id: string) {
    completeReminder(id)
    load()
  }

  function handleDelete(id: string) {
    deleteReminder(id)
    load()
  }

  function snooze(r: Reminder, days: number) {
    const d = new Date(r.dueDate)
    d.setDate(d.getDate() + days)
    saveReminder({ ...r, dueDate: d.toISOString().split('T')[0] })
    load()
  }

  function handleAddReminder(e: React.FormEvent) {
    e.preventDefault()
    const lead = leads.find((l) => l.id === form.leadId)
    saveReminder({
      id: generateId(),
      leadId: form.leadId,
      leadName: lead?.name ?? 'Unknown',
      title: form.title,
      dueDate: form.dueDate,
      assignedTo: form.assignedTo,
      completed: false,
      createdAt: new Date().toISOString(),
    })
    setForm({ leadId: '', title: '', dueDate: '', assignedTo: 'EJ' })
    setShowForm(false)
    load()
  }

  const inputClass = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal'

  function ReminderCard({ r, section }: { r: Reminder; section: 'overdue' | 'today' | 'upcoming' | 'done' }) {
    const isOverdue = section === 'overdue'
    const isToday = section === 'today'
    const diff = daysUntil(r.dueDate)

    return (
      <div
        className={`flex items-start gap-3 p-4 rounded-xl border transition-all ${
          isOverdue
            ? 'bg-red-50 border-red-200'
            : isToday
            ? 'bg-amber-50 border-amber-200'
            : section === 'done'
            ? 'bg-gray-50 border-gray-100 opacity-60'
            : 'bg-white border-gray-100'
        }`}
      >
        <div className={`mt-0.5 flex-shrink-0 w-2.5 h-2.5 rounded-full ${
          isOverdue ? 'bg-red-500' : isToday ? 'bg-amber-400' : section === 'done' ? 'bg-gray-300' : 'bg-teal'
        }`} />

        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium ${section === 'done' ? 'line-through text-gray-400' : 'text-brand-dark'}`}>
            {r.title}
          </p>
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            <Link href={`/crm/leads/${r.leadId}`} className="text-xs text-teal hover:underline">
              {r.leadName}
            </Link>
            <span className="text-xs text-gray-400">→ {r.assignedTo}</span>
            <span className={`text-xs font-medium ${
              isOverdue ? 'text-red-600' : isToday ? 'text-amber-600' : 'text-gray-400'
            }`}>
              {isOverdue
                ? `${Math.abs(diff)}d overdue`
                : isToday
                ? 'Today'
                : diff === 1
                ? 'Tomorrow'
                : `In ${diff} days · ${formatDate(r.dueDate)}`}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          {section !== 'done' && (
            <>
              {isOverdue && (
                <div className="relative group">
                  <button className="text-xs text-gray-400 hover:text-brand-dark border border-gray-200 px-2 py-1 rounded bg-white">
                    Snooze
                  </button>
                  <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 hidden group-hover:block min-w-max">
                    {[1, 2, 3, 7].map((d) => (
                      <button
                        key={d}
                        onClick={() => snooze(r, d)}
                        className="block w-full text-left px-3 py-2 text-xs hover:bg-gray-50 text-gray-700"
                      >
                        +{d} day{d > 1 ? 's' : ''}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <button
                onClick={() => handleComplete(r.id)}
                className="text-xs bg-green-100 text-green-700 hover:bg-green-200 px-2.5 py-1 rounded-lg font-medium"
              >
                Done ✓
              </button>
            </>
          )}
          <button
            onClick={() => handleDelete(r.id)}
            className="text-gray-300 hover:text-red-400 text-lg leading-none px-1"
            title="Delete"
          >
            ×
          </button>
        </div>
      </div>
    )
  }

  function Section({ title, items, color, section }: {
    title: string
    items: Reminder[]
    color: string
    section: 'overdue' | 'today' | 'upcoming' | 'done'
  }) {
    if (items.length === 0) return null
    return (
      <div>
        <div className={`flex items-center gap-2 mb-3 ${color}`}>
          <h2 className="font-bold text-sm uppercase tracking-wide">{title}</h2>
          <span className="bg-current/10 text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center">
            {items.length}
          </span>
        </div>
        <div className="space-y-2">
          {items.map((r) => (
            <ReminderCard key={r.id} r={r} section={section} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-dark font-heading">Reminders</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {overdue.length > 0 && <span className="text-red-600 font-semibold">{overdue.length} overdue · </span>}
            {todayList.length} today · {upcoming.length} upcoming
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-teal text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-teal-dark transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Reminder
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap items-center">
        <select
          value={filterAssigned}
          onChange={(e) => setFilterAssigned(e.target.value)}
          className="border border-gray-200 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal/30 bg-white"
        >
          <option value="all">All Team</option>
          {TEAM_MEMBERS.filter((m) => m !== 'All Team').map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        <label className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer">
          <input
            type="checkbox"
            checked={showComplete}
            onChange={(e) => setShowComplete(e.target.checked)}
            className="rounded"
          />
          Show completed
        </label>
      </div>

      {/* Add Reminder Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="font-bold text-brand-dark mb-4">New Reminder</h3>
            <form onSubmit={handleAddReminder} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Lead *</label>
                <select
                  required
                  value={form.leadId}
                  onChange={(e) => setForm(f => ({ ...f, leadId: e.target.value }))}
                  className={inputClass}
                >
                  <option value="">Select a lead…</option>
                  {leads.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">What to do? *</label>
                <input
                  required
                  type="text"
                  placeholder="Call to follow up on quote…"
                  value={form.title}
                  onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Due Date *</label>
                <input
                  required
                  type="date"
                  min={today}
                  value={form.dueDate}
                  onChange={(e) => setForm(f => ({ ...f, dueDate: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Assign To</label>
                <select
                  value={form.assignedTo}
                  onChange={(e) => setForm(f => ({ ...f, assignedTo: e.target.value }))}
                  className={inputClass}
                >
                  {TEAM_MEMBERS.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div className="flex gap-3">
                <button type="submit" className="flex-1 bg-teal text-white py-2 rounded-lg font-semibold text-sm hover:bg-teal-dark">
                  Set Reminder
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 border border-gray-200 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Empty state */}
      {overdue.length === 0 && todayList.length === 0 && upcoming.length === 0 && completed.length === 0 && (
        <div className="text-center py-16">
          <div className="text-5xl mb-3">🎉</div>
          <p className="font-semibold text-brand-dark">All clear!</p>
          <p className="text-sm text-gray-400 mt-1">No reminders right now. Add one from any lead page.</p>
        </div>
      )}

      {/* Reminder sections */}
      <div className="space-y-8">
        <Section title="Overdue" items={overdue} color="text-red-600" section="overdue" />
        <Section title="Today" items={todayList} color="text-amber-600" section="today" />
        <Section title="Upcoming" items={upcoming} color="text-teal" section="upcoming" />
        {showComplete && <Section title="Completed" items={completed} color="text-gray-400" section="done" />}
      </div>

      {/* Sales tips footer */}
      {(overdue.length > 0 || todayList.length > 0) && (
        <div className="bg-[#111c1c] rounded-xl p-5 text-white">
          <p className="text-xs font-bold text-teal uppercase tracking-wide mb-2">Quick Follow-Up Scripts</p>
          <div className="space-y-3 text-sm text-gray-300">
            <div>
              <p className="text-white font-semibold text-xs mb-1">📞 After a quote</p>
              <p className="text-xs">&ldquo;Hey [Name], just wanted to make sure you got our quote and see if you had any questions. We have [X] installs going in your area next week — would love to fit yours in while we&apos;re nearby.&rdquo;</p>
            </div>
            <div>
              <p className="text-white font-semibold text-xs mb-1">💬 Text for busy contacts</p>
              <p className="text-xs">&ldquo;Hi [Name], it&apos;s [Your Name] from Defined Glass. Just checking in on your [project type]. Still interested? Happy to answer any questions. 📱&rdquo;</p>
            </div>
            <div>
              <p className="text-white font-semibold text-xs mb-1">🏃 Creating urgency</p>
              <p className="text-xs">&ldquo;Our install schedule is filling up for [month] — if you want to lock in your spot, we&apos;d need to confirm by [date].&rdquo;</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
