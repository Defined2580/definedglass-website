'use client'

import Link from 'next/link'
import { useEffect, useState, useRef } from 'react'
import { getLeads, saveLead } from '@/lib/crm/storage'
import type { Lead, LeadStatus } from '@/lib/crm/types'
import { STATUS_LABELS, PROJECT_LABELS } from '@/lib/crm/types'

const STAGES: LeadStatus[] = ['new', 'consultation', 'quoted', 'followup', 'won', 'lost']

const STAGE_CONFIG: Record<LeadStatus, { color: string; headerBg: string; dot: string }> = {
  new: { color: 'border-blue-300', headerBg: 'bg-blue-50', dot: 'bg-blue-400' },
  consultation: { color: 'border-yellow-300', headerBg: 'bg-yellow-50', dot: 'bg-yellow-400' },
  quoted: { color: 'border-purple-300', headerBg: 'bg-purple-50', dot: 'bg-purple-400' },
  followup: { color: 'border-orange-300', headerBg: 'bg-orange-50', dot: 'bg-orange-400' },
  won: { color: 'border-green-300', headerBg: 'bg-green-50', dot: 'bg-green-500' },
  lost: { color: 'border-gray-200', headerBg: 'bg-gray-50', dot: 'bg-gray-400' },
}

function daysSince(iso: string): number {
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86400000)
}

export default function PipelinePage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [dragging, setDragging] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState<LeadStatus | null>(null)
  const dragId = useRef<string | null>(null)

  useEffect(() => {
    setLeads(getLeads())
  }, [])

  function handleDragStart(e: React.DragEvent, id: string) {
    dragId.current = id
    setDragging(id)
    e.dataTransfer.effectAllowed = 'move'
  }

  function handleDragEnd() {
    setDragging(null)
    setDragOver(null)
    dragId.current = null
  }

  function handleDragOver(e: React.DragEvent, status: LeadStatus) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOver(status)
  }

  function handleDrop(e: React.DragEvent, status: LeadStatus) {
    e.preventDefault()
    const id = dragId.current
    if (!id) return
    setLeads((prev) => {
      const updated = prev.map((l) =>
        l.id === id ? { ...l, status, updatedAt: new Date().toISOString() } : l
      )
      const lead = updated.find((l) => l.id === id)
      if (lead) saveLead(lead)
      return updated
    })
    setDragging(null)
    setDragOver(null)
    dragId.current = null
  }

  function handleTouchDrop(id: string, status: LeadStatus) {
    setLeads((prev) => {
      const updated = prev.map((l) =>
        l.id === id ? { ...l, status, updatedAt: new Date().toISOString() } : l
      )
      const lead = updated.find((l) => l.id === id)
      if (lead) saveLead(lead)
      return updated
    })
  }

  const pipelineTotal = leads
    .filter((l) => l.status !== 'lost')
    .reduce((s, l) => s + l.estimatedValue, 0)

  return (
    <div className="p-6 space-y-5 h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-dark font-heading">Pipeline</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {leads.filter((l) => l.status !== 'won' && l.status !== 'lost').length} active ·{' '}
            <span className="text-teal font-semibold">${pipelineTotal.toLocaleString()}</span> total value
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

      {/* Mobile tip */}
      <p className="text-xs text-gray-400 lg:hidden">
        Tap a lead to open it, then change stage from the status buttons.
      </p>

      {/* Kanban board */}
      <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6">
        {STAGES.map((stage) => {
          const stageLeads = leads
            .filter((l) => l.status === stage)
            .sort((a, b) => {
              const ap = a.priority === 'high' ? 0 : a.priority === 'medium' ? 1 : 2
              const bp = b.priority === 'high' ? 0 : b.priority === 'medium' ? 1 : 2
              return ap - bp
            })
          const stageValue = stageLeads.reduce((s, l) => s + l.estimatedValue, 0)
          const cfg = STAGE_CONFIG[stage]
          const isDragTarget = dragOver === stage

          return (
            <div
              key={stage}
              className={`flex-shrink-0 w-64 flex flex-col rounded-xl border-2 transition-colors ${
                isDragTarget ? 'border-teal bg-teal/5' : cfg.color
              } ${stage === 'lost' ? 'opacity-75' : ''}`}
              onDragOver={(e) => handleDragOver(e, stage)}
              onDrop={(e) => handleDrop(e, stage)}
              onDragLeave={() => setDragOver(null)}
            >
              {/* Column header */}
              <div className={`px-3 py-3 rounded-t-xl ${cfg.headerBg} border-b border-inherit`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`} />
                    <span className="text-sm font-bold text-brand-dark">{STATUS_LABELS[stage]}</span>
                    <span className="text-xs bg-white/70 text-gray-500 font-semibold px-1.5 py-0.5 rounded-full">
                      {stageLeads.length}
                    </span>
                  </div>
                  {stageValue > 0 && (
                    <span className="text-xs font-bold text-teal">
                      ${stageValue >= 1000 ? `${(stageValue / 1000).toFixed(stageValue % 1000 === 0 ? 0 : 1)}k` : stageValue}
                    </span>
                  )}
                </div>
              </div>

              {/* Cards */}
              <div className="flex-1 p-2 space-y-2 overflow-y-auto max-h-[calc(100vh-260px)]">
                {stageLeads.length === 0 && (
                  <div className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                    isDragTarget ? 'border-teal bg-teal/10' : 'border-gray-200'
                  }`}>
                    <p className="text-xs text-gray-400">Drop here</p>
                  </div>
                )}
                {stageLeads.map((lead) => {
                  const age = daysSince(lead.updatedAt)
                  const isStale = age > 4 && stage !== 'won' && stage !== 'lost'
                  const followUpOverdue =
                    lead.nextFollowUp && lead.nextFollowUp < new Date().toISOString().split('T')[0]

                  return (
                    <div
                      key={lead.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, lead.id)}
                      onDragEnd={handleDragEnd}
                      className={`bg-white border rounded-lg p-3 cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md transition-all select-none ${
                        dragging === lead.id ? 'opacity-40 scale-95' : 'opacity-100'
                      } ${isStale ? 'border-orange-200' : 'border-gray-100'}`}
                    >
                      {/* Priority indicator */}
                      <div className="flex items-start justify-between mb-2">
                        <Link
                          href={`/crm/leads/${lead.id}`}
                          className="text-sm font-semibold text-brand-dark hover:text-teal transition-colors leading-tight"
                          onClick={(e) => e.stopPropagation()}
                          draggable={false}
                        >
                          {lead.name}
                        </Link>
                        <span
                          className={`ml-1 flex-shrink-0 w-2 h-2 rounded-full mt-1 ${
                            lead.priority === 'high'
                              ? 'bg-red-500'
                              : lead.priority === 'medium'
                              ? 'bg-yellow-400'
                              : 'bg-gray-300'
                          }`}
                        />
                      </div>

                      <p className="text-xs text-gray-400 mb-2">{PROJECT_LABELS[lead.projectType]}</p>

                      {lead.estimatedValue > 0 && (
                        <p className="text-sm font-bold text-teal mb-2">
                          ${lead.estimatedValue.toLocaleString()}
                        </p>
                      )}

                      <div className="flex items-center justify-between">
                        <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">
                          {lead.assignedTo}
                        </span>
                        <div className="flex items-center gap-2">
                          {followUpOverdue && (
                            <span className="text-xs text-red-500" title="Follow-up overdue">⚠</span>
                          )}
                          <span className={`text-xs ${isStale ? 'text-orange-500 font-semibold' : 'text-gray-400'}`}>
                            {age === 0 ? 'Today' : `${age}d`}
                          </span>
                        </div>
                      </div>

                      {/* Mobile stage change */}
                      <div className="mt-2 flex gap-1 lg:hidden">
                        {STAGES.filter((s) => s !== stage).map((s) => (
                          <button
                            key={s}
                            onClick={() => handleTouchDrop(lead.id, s)}
                            className="text-xs text-gray-400 hover:text-teal px-1"
                            title={`Move to ${STATUS_LABELS[s]}`}
                          >
                            →{STATUS_LABELS[s].split(' ')[0]}
                          </button>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Stage summary bar */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Stage Summary</h3>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {STAGES.map((stage) => {
            const stageLeads = leads.filter((l) => l.status === stage)
            const val = stageLeads.reduce((s, l) => s + l.estimatedValue, 0)
            const cfg = STAGE_CONFIG[stage]
            return (
              <div key={stage} className={`rounded-lg p-3 ${cfg.headerBg}`}>
                <p className="text-xs text-gray-500 font-medium">{STATUS_LABELS[stage]}</p>
                <p className="text-xl font-bold text-brand-dark mt-0.5">{stageLeads.length}</p>
                {val > 0 && (
                  <p className="text-xs text-teal font-semibold">
                    ${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
