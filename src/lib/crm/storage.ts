import type { Lead, Activity, Reminder } from './types'

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

const KEYS = {
  leads: 'dgcrm_leads',
  activities: 'dgcrm_activities',
  reminders: 'dgcrm_reminders',
  seeded: 'dgcrm_seeded',
}

function read<T>(key: string): T[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T[]) : []
  } catch {
    return []
  }
}

function write<T>(key: string, data: T[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(key, JSON.stringify(data))
}

// ── Leads ──────────────────────────────────────────────────────────────────

export function getLeads(): Lead[] {
  return read<Lead>(KEYS.leads)
}

export function getLead(id: string): Lead | undefined {
  return getLeads().find((l) => l.id === id)
}

export function saveLead(lead: Lead): void {
  const leads = getLeads()
  const idx = leads.findIndex((l) => l.id === lead.id)
  if (idx >= 0) leads[idx] = lead
  else leads.unshift(lead)
  write(KEYS.leads, leads)
}

export function deleteLead(id: string): void {
  write(KEYS.leads, getLeads().filter((l) => l.id !== id))
  write(KEYS.activities, getActivities().filter((a) => a.leadId !== id))
  write(KEYS.reminders, getReminders().filter((r) => r.leadId !== id))
}

export function updateLeadStatus(id: string, status: Lead['status']): void {
  const lead = getLead(id)
  if (!lead) return
  saveLead({ ...lead, status, updatedAt: new Date().toISOString() })
}

// ── Activities ──────────────────────────────────────────────────────────────

export function getActivities(): Activity[] {
  return read<Activity>(KEYS.activities)
}

export function getLeadActivities(leadId: string): Activity[] {
  return getActivities()
    .filter((a) => a.leadId === leadId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export function saveActivity(activity: Activity): void {
  const activities = getActivities()
  activities.unshift(activity)
  write(KEYS.activities, activities)
  // Touch lead's updatedAt
  const lead = getLead(activity.leadId)
  if (lead) saveLead({ ...lead, updatedAt: new Date().toISOString() })
}

export function getRecentActivities(limit = 20): (Activity & { leadName: string })[] {
  const leads = getLeads()
  const leadMap = Object.fromEntries(leads.map((l) => [l.id, l.name]))
  return getActivities()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, limit)
    .map((a) => ({ ...a, leadName: leadMap[a.leadId] ?? 'Unknown' }))
}

// ── Reminders ──────────────────────────────────────────────────────────────

export function getReminders(): Reminder[] {
  return read<Reminder>(KEYS.reminders)
}

export function getLeadReminders(leadId: string): Reminder[] {
  return getReminders().filter((r) => r.leadId === leadId)
}

export function saveReminder(reminder: Reminder): void {
  const reminders = getReminders()
  const idx = reminders.findIndex((r) => r.id === reminder.id)
  if (idx >= 0) reminders[idx] = reminder
  else reminders.push(reminder)
  write(KEYS.reminders, reminders)
}

export function completeReminder(id: string): void {
  const reminders = getReminders()
  const r = reminders.find((r) => r.id === id)
  if (r) {
    r.completed = true
    write(KEYS.reminders, reminders)
  }
}

export function deleteReminder(id: string): void {
  write(KEYS.reminders, getReminders().filter((r) => r.id !== id))
}

// ── Seeding ────────────────────────────────────────────────────────────────

export function isSeeded(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(KEYS.seeded) === '1'
}

export function markSeeded(): void {
  if (typeof window !== 'undefined') localStorage.setItem(KEYS.seeded, '1')
}

// ── Analytics helpers ──────────────────────────────────────────────────────

export function getPipelineValue(): Record<string, number> {
  const leads = getLeads().filter((l) => l.status !== 'lost')
  const result: Record<string, number> = {}
  for (const l of leads) {
    result[l.status] = (result[l.status] ?? 0) + l.estimatedValue
  }
  return result
}

export function getOverdueLeads(): Lead[] {
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - 4)
  const active = getLeads().filter((l) => l.status !== 'won' && l.status !== 'lost')
  return active.filter((l) => new Date(l.updatedAt) < cutoff)
}

export function getWonThisMonth(): Lead[] {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  return getLeads().filter((l) => l.status === 'won' && l.updatedAt >= start)
}
