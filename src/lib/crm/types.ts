export type LeadStatus = 'new' | 'consultation' | 'quoted' | 'followup' | 'won' | 'lost'
export type ProjectType =
  | 'shower-doors'
  | 'mirrors'
  | 'office'
  | 'exterior'
  | 'railings'
  | 'backsplash'
  | 'other'
export type ActivityType = 'call' | 'email' | 'note' | 'visit' | 'quote' | 'text' | 'measurement'
export type LeadSource =
  | 'website'
  | 'referral'
  | 'social'
  | 'walk-in'
  | 'phone'
  | 'contractor'
  | 'repeat'
  | 'other'
export type Priority = 'high' | 'medium' | 'low'

export interface Lead {
  id: string
  name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  source: LeadSource
  projectType: ProjectType
  projectDetails: string
  estimatedValue: number
  status: LeadStatus
  assignedTo: string
  priority: Priority
  createdAt: string
  updatedAt: string
  nextFollowUp: string | null
  tags: string[]
  lostReason?: string
}

export interface Activity {
  id: string
  leadId: string
  type: ActivityType
  description: string
  createdAt: string
  createdBy: string
}

export interface Reminder {
  id: string
  leadId: string
  leadName: string
  title: string
  dueDate: string
  assignedTo: string
  completed: boolean
  createdAt: string
}

export const TEAM_MEMBERS = ['EJ', 'Mike', 'Sarah', 'All Team'] as const
export type TeamMember = (typeof TEAM_MEMBERS)[number]

export const STATUS_LABELS: Record<LeadStatus, string> = {
  new: 'New Inquiry',
  consultation: 'Consultation',
  quoted: 'Quote Sent',
  followup: 'Follow-Up',
  won: 'Won',
  lost: 'Lost',
}

export const STATUS_COLORS: Record<LeadStatus, string> = {
  new: 'bg-blue-100 text-blue-800',
  consultation: 'bg-yellow-100 text-yellow-800',
  quoted: 'bg-purple-100 text-purple-800',
  followup: 'bg-orange-100 text-orange-800',
  won: 'bg-green-100 text-green-800',
  lost: 'bg-gray-100 text-gray-500',
}

export const PROJECT_LABELS: Record<ProjectType, string> = {
  'shower-doors': 'Shower Doors',
  mirrors: 'Mirrors',
  office: 'Office/Commercial',
  exterior: 'Exterior Glass',
  railings: 'Railings',
  backsplash: 'Backsplash',
  other: 'Other',
}

export const SOURCE_LABELS: Record<LeadSource, string> = {
  website: 'Website',
  referral: 'Referral',
  social: 'Social Media',
  'walk-in': 'Walk-In',
  phone: 'Phone Call',
  contractor: 'Contractor',
  repeat: 'Repeat Customer',
  other: 'Other',
}
