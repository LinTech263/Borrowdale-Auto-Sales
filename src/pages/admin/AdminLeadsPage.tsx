import React, { useState, useMemo } from 'react';
import { useDealership } from '../../context/DealershipContext';
import { getLeads, updateLead, deleteLead } from '../../services/dataService';
import { Lead, LeadStatus } from '../../types';
import {
  Users,
  MessageCircle,
  Phone,
  Mail,
  DollarSign,
  Download,
  Filter,
  CheckCircle2,
  XCircle,
  Plus,
  Trash2,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';

const KANBAN_STAGES: LeadStatus[] = [
  'New',
  'Contacted',
  'Negotiating',
  'Viewing Booked',
  'Won',
  'Lost'
];

export const AdminLeadsPage: React.FC = () => {
  const { addToast } = useDealership();
  const [leads, setLeads] = useState<Lead[]>(() => getLeads());
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');

  // Filter
  const [filterType, setFilterType] = useState('all');
  const [activeLeadModal, setActiveLeadModal] = useState<Lead | null>(null);

  // Note input in modal
  const [newNote, setNewNote] = useState('');
  const [counterInput, setCounterInput] = useState<number | ''>('');

  const reloadLeads = () => {
    setLeads(getLeads());
  };

  const handleStageChange = (lead: Lead, newStatus: LeadStatus) => {
    const updated = { ...lead, status: newStatus };
    updateLead(updated);
    reloadLeads();
    addToast(`Moved ${lead.customerName} to "${newStatus}"`, 'info');
  };

  const handleAddNote = (lead: Lead) => {
    if (!newNote.trim()) return;
    const updated = {
      ...lead,
      internalNotes: [...(lead.internalNotes || []), `${new Date().toLocaleDateString()}: ${newNote.trim()}`]
    };
    updateLead(updated);
    setActiveLeadModal(updated);
    setNewNote('');
    reloadLeads();
    addToast('Note added to timeline', 'success');
  };

  const handleSetCounterOffer = (lead: Lead) => {
    if (!counterInput) return;
    const updated = {
      ...lead,
      status: 'Negotiating' as LeadStatus,
      counterOfferAmount: Number(counterInput),
      internalNotes: [...(lead.internalNotes || []), `Countered offer at US$${Number(counterInput).toLocaleString('en-US')}`]
    };
    updateLead(updated);
    setActiveLeadModal(updated);
    setCounterInput('');
    reloadLeads();
    addToast(`Counter offer of US$${Number(counterInput).toLocaleString('en-US')} logged`, 'success');
  };

  const handleDeleteLead = (id: string) => {
    if (window.confirm('Delete this lead record permanently?')) {
      deleteLead(id);
      setActiveLeadModal(null);
      reloadLeads();
      addToast('Lead deleted', 'info');
    }
  };

  // Export to CSV
  const handleExportCsv = () => {
    const headers = ['ID', 'Type', 'Status', 'Date', 'Customer', 'Phone', 'Email', 'Vehicle', 'Asking', 'Offer', 'Counter'];
    const rows = leads.map(l => [
      l.id,
      l.type,
      l.status,
      l.createdAt,
      `"${l.customerName}"`,
      `"${l.phone}"`,
      l.email || '',
      `"${l.vehicleTitle || ''}"`,
      l.vehicleAskingPrice || '',
      l.offerAmount || '',
      l.counterOfferAmount || ''
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `borrowdale_leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Leads exported to CSV', 'success');
  };

  const filteredLeads = useMemo(() => {
    if (filterType === 'all') return leads;
    return leads.filter(l => l.type === filterType);
  }, [leads, filterType]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#23272C]">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-[#C6A15B]">
            Client Relationship Management
          </span>
          <h1 className="font-heading text-3xl font-black uppercase text-[#F5F2EB]">
            Leads & Offers CRM ({leads.length})
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setViewMode(viewMode === 'kanban' ? 'list' : 'kanban')}
            className="px-3 py-2 bg-[#16181B] border border-[#23272C] text-xs font-bold uppercase rounded-[2px]"
          >
            {viewMode === 'kanban' ? 'Switch to List' : 'Switch to Kanban'}
          </button>
          <button
            onClick={handleExportCsv}
            className="px-3 py-2 bg-[#C6A15B] text-[#0A0A0B] text-xs font-bold uppercase rounded-[2px] flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter by Type */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-[#9AA0A8] uppercase font-semibold mr-1">Filter Type:</span>
        {['all', 'make_offer', 'enquiry', 'book_viewing', 'trade_in', 'finance', 'sourcing'].map(t => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`px-3 py-1.5 rounded-[2px] border ${
              filterType === t
                ? 'bg-[#C6A15B] border-[#C6A15B] text-[#0A0A0B] font-bold'
                : 'bg-[#16181B] border-[#23272C] text-[#9AA0A8]'
            }`}
          >
            {t === 'all' ? 'All Leads' : t.replace('_', ' ').toUpperCase()}
          </button>
        ))}
      </div>

      {/* Kanban Pipeline View */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3.5 overflow-x-auto pb-4">
          {KANBAN_STAGES.map(stage => {
            const stageLeads = filteredLeads.filter(l => l.status === stage);
            return (
              <div key={stage} className="bg-[#121417] border border-[#23272C] rounded-[2px] p-3 min-w-[240px] flex flex-col">
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#23272C]">
                  <span className="font-heading text-sm font-bold uppercase tracking-wider text-[#F5F2EB]">
                    {stage}
                  </span>
                  <span className="text-xs font-mono font-bold bg-[#16181B] border border-[#23272C] px-1.5 py-0.2 rounded text-[#C6A15B]">
                    {stageLeads.length}
                  </span>
                </div>

                <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[70vh]">
                  {stageLeads.map(lead => {
                    const cleanPhone = lead.phone.replace(/[^\d]/g, '');
                    const replyText = `Hi ${lead.customerName}, thanks for reaching out to Borrowdale Auto Sales regarding ${lead.vehicleTitle || 'our vehicles'}.`;
                    const waLink = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(replyText)}`;

                    const delta = lead.offerAmount && lead.vehicleAskingPrice ? lead.offerAmount - lead.vehicleAskingPrice : 0;
                    const deltaPercent = lead.offerAmount && lead.vehicleAskingPrice
                      ? ((delta / lead.vehicleAskingPrice) * 100).toFixed(1)
                      : '0';

                    return (
                      <div
                        key={lead.id}
                        onClick={() => setActiveLeadModal(lead)}
                        className="p-3 bg-[#16181B] border border-[#23272C] hover:border-[#C6A15B] rounded-[2px] cursor-pointer space-y-2 text-xs transition-all"
                      >
                        <div className="flex items-start justify-between gap-1">
                          <strong className="text-[#F5F2EB] font-bold truncate">{lead.customerName}</strong>
                          <span className="text-[9px] px-1 bg-[#0A0A0B] text-[#C6A15B] rounded uppercase font-mono">
                            {lead.preferredContact}
                          </span>
                        </div>

                        {lead.vehicleTitle && (
                          <span className="text-[11px] text-[#9AA0A8] block line-clamp-1 font-medium">
                            {lead.vehicleTitle}
                          </span>
                        )}

                        {/* Asking vs Offer Delta */}
                        {lead.offerAmount && lead.vehicleAskingPrice && (
                          <div className="p-1.5 bg-[#0A0A0B] rounded border border-[#23272C] font-mono text-[10px]">
                            <div className="flex justify-between">
                              <span className="text-[#9AA0A8]">Ask: US${lead.vehicleAskingPrice.toLocaleString('en-US')}</span>
                              <span className="text-[#C6A15B] font-bold">Offer: US${lead.offerAmount.toLocaleString('en-US')}</span>
                            </div>
                            <span className={delta < 0 ? 'text-[#EA580C] block text-right' : 'text-[#0E7A33] block text-right'}>
                              Diff: {delta < 0 ? `-${Math.abs(delta).toLocaleString('en-US')} (${deltaPercent}%)` : `+${delta.toLocaleString('en-US')}`}
                            </span>
                          </div>
                        )}

                        {lead.counterOfferAmount && (
                          <div className="text-[10px] text-[#38BDF8] font-mono">
                            Counter: US${lead.counterOfferAmount.toLocaleString('en-US')}
                          </div>
                        )}

                        {/* Fast Actions */}
                        <div className="pt-1 flex items-center justify-between">
                          <span className="text-[9px] text-[#9AA0A8]">
                            {new Date(lead.createdAt).toLocaleDateString()}
                          </span>
                          <a
                            href={waLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={e => e.stopPropagation()}
                            className="p-1 rounded bg-[#0E7A33] text-white hover:bg-[#0E7A33]/90"
                            title="1-Click WhatsApp Reply"
                          >
                            <MessageCircle className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List Inbox View */
        <div className="card-luxury overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#0A0A0B] border-b border-[#23272C] text-[#9AA0A8] uppercase font-semibold">
                <th className="p-3">Date</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Type</th>
                <th className="p-3">Vehicle</th>
                <th className="p-3">Asking vs Offer</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#23272C]">
              {filteredLeads.map(lead => (
                <tr
                  key={lead.id}
                  onClick={() => setActiveLeadModal(lead)}
                  className="hover:bg-[#16181B]/80 cursor-pointer"
                >
                  <td className="p-3 text-[#9AA0A8] font-mono">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    <strong className="text-[#F5F2EB]">{lead.customerName}</strong>
                    <span className="block text-[#9AA0A8] font-mono text-[11px]">{lead.phone}</span>
                  </td>
                  <td className="p-3 uppercase font-mono text-[#C6A15B]">
                    {lead.type.replace('_', ' ')}
                  </td>
                  <td className="p-3 text-[#9AA0A8] max-w-xs truncate">
                    {lead.vehicleTitle || 'General Enquiry'}
                  </td>
                  <td className="p-3 font-mono">
                    {lead.offerAmount ? (
                      <div>
                        <span>US${lead.offerAmount.toLocaleString('en-US')}</span>
                        {lead.vehicleAskingPrice && (
                          <span className="text-[10px] text-[#9AA0A8] block">
                            Ask: US${lead.vehicleAskingPrice.toLocaleString('en-US')}
                          </span>
                        )}
                      </div>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#0A0A0B] border border-[#23272C] text-[#F5F2EB]">
                      {lead.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={e => { e.stopPropagation(); setActiveLeadModal(lead); }}
                      className="px-2 py-1 bg-[#16181B] border border-[#23272C] rounded text-xs text-[#C6A15B]"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Lead Detail & Actions Modal */}
      {activeLeadModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="card-luxury p-6 sm:p-8 max-w-2xl w-full space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#23272C]">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#C6A15B]">
                  Lead Detail #{activeLeadModal.id}
                </span>
                <h3 className="font-heading text-2xl font-bold uppercase text-[#F5F2EB]">
                  {activeLeadModal.customerName}
                </h3>
              </div>
              <button onClick={() => setActiveLeadModal(null)} className="text-[#9AA0A8] text-sm">
                Close
              </button>
            </div>

            {/* Quick Status Stage Dropdown */}
            <div className="p-3 bg-[#0A0A0B] border border-[#23272C] rounded-[2px] flex items-center justify-between text-xs">
              <span className="text-[#9AA0A8] font-semibold uppercase">Pipeline Status:</span>
              <select
                value={activeLeadModal.status}
                onChange={e => handleStageChange(activeLeadModal, e.target.value as any)}
                className="bg-[#16181B] border border-[#23272C] text-[#C6A15B] font-bold px-3 py-1.5 rounded"
              >
                {KANBAN_STAGES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Contact & Offer Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-[#0A0A0B] rounded border border-[#23272C] space-y-2">
                <span className="font-semibold text-[#9AA0A8] uppercase block">Contact Details</span>
                <div>Phone: <strong className="text-[#F5F2EB] font-mono">{activeLeadModal.phone}</strong></div>
                {activeLeadModal.email && <div>Email: <strong className="text-[#F5F2EB]">{activeLeadModal.email}</strong></div>}
                <div>Preferred: <strong className="text-[#C6A15B]">{activeLeadModal.preferredContact}</strong></div>
                {activeLeadModal.viewingDateTime && <div>Appointment: <strong className="text-[#38BDF8]">{activeLeadModal.viewingDateTime}</strong></div>}
              </div>

              <div className="p-3 bg-[#0A0A0B] rounded border border-[#23272C] space-y-2">
                <span className="font-semibold text-[#9AA0A8] uppercase block">Vehicle Consideration</span>
                <div>Vehicle: <strong className="text-[#F5F2EB]">{activeLeadModal.vehicleTitle || 'General'}</strong></div>
                {activeLeadModal.vehicleAskingPrice && <div>Asking Price: <strong className="font-mono text-[#F5F2EB]">US${activeLeadModal.vehicleAskingPrice.toLocaleString('en-US')}</strong></div>}
                {activeLeadModal.offerAmount && (
                  <div>
                    Proposed Offer: <strong className="font-mono text-[#C6A15B]">US${activeLeadModal.offerAmount.toLocaleString('en-US')}</strong>
                  </div>
                )}
                {activeLeadModal.counterOfferAmount && (
                  <div>Counter Logged: <strong className="font-mono text-[#38BDF8]">US${activeLeadModal.counterOfferAmount.toLocaleString('en-US')}</strong></div>
                )}
              </div>
            </div>

            {/* Message Body */}
            {activeLeadModal.message && (
              <div className="p-3 bg-[#0A0A0B] border border-[#23272C] rounded text-xs">
                <span className="font-semibold text-[#9AA0A8] block mb-1">Message from Customer:</span>
                <p className="text-[#F5F2EB]">{activeLeadModal.message}</p>
              </div>
            )}

            {/* Counter Offer Logger */}
            <div className="p-3 bg-[#0A0A0B] border border-[#23272C] rounded space-y-2 text-xs">
              <span className="font-semibold text-[#C6A15B] block">Log Dealership Counter-Offer:</span>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Counter Amount (US$)"
                  value={counterInput}
                  onChange={e => setCounterInput(e.target.value ? Number(e.target.value) : '')}
                  className="bg-[#16181B] border border-[#23272C] rounded px-3 py-1.5 text-xs text-[#F5F2EB] flex-1"
                />
                <button
                  type="button"
                  onClick={() => handleSetCounterOffer(activeLeadModal)}
                  className="px-4 py-1.5 bg-[#C6A15B] text-[#0A0A0B] font-bold rounded"
                >
                  Log Counter
                </button>
              </div>
            </div>

            {/* 1-Click WhatsApp & Call Actions */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <a
                href={`https://wa.me/${activeLeadModal.phone.replace(/[^\d]/g, '')}?text=${encodeURIComponent(
                  `Hi ${activeLeadModal.customerName}, thanks for your interest in the ${activeLeadModal.vehicleTitle || 'vehicle'} at Borrowdale Auto Sales. ${activeLeadModal.counterOfferAmount ? `Regarding your offer, we can accept US$${activeLeadModal.counterOfferAmount.toLocaleString('en-US')}.` : 'When would you like to arrange viewing at our showroom?'}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-4 bg-[#0E7A33] text-white rounded text-xs font-bold uppercase flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>1-Click WhatsApp Reply</span>
              </a>

              <a
                href={`tel:${activeLeadModal.phone}`}
                className="py-2.5 px-4 bg-[#16181B] border border-[#23272C] text-[#F5F2EB] rounded text-xs font-bold uppercase flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4 text-[#C6A15B]" />
                <span>Call Client</span>
              </a>
            </div>

            {/* Internal Notes & Timeline */}
            <div className="space-y-2 pt-2 border-t border-[#23272C] text-xs">
              <span className="font-semibold text-[#9AA0A8] block">Internal Notes Timeline</span>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {(activeLeadModal.internalNotes || []).map((n, i) => (
                  <div key={i} className="p-2 bg-[#0A0A0B] border border-[#23272C] rounded text-[11px] text-[#9AA0A8]">
                    {n}
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add note (e.g. Spoke to client on phone, viewing tomorrow)..."
                  value={newNote}
                  onChange={e => setNewNote(e.target.value)}
                  className="bg-[#0A0A0B] border border-[#23272C] rounded px-3 py-1.5 text-xs text-[#F5F2EB] flex-1"
                />
                <button
                  type="button"
                  onClick={() => handleAddNote(activeLeadModal)}
                  className="px-3 py-1.5 bg-[#16181B] border border-[#23272C] text-xs font-bold rounded"
                >
                  Add
                </button>
              </div>
            </div>

            <div className="pt-2 border-t border-[#23272C] flex justify-between">
              <button
                type="button"
                onClick={() => handleDeleteLead(activeLeadModal.id)}
                className="text-[#B3261E] hover:underline text-xs flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Lead Record</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveLeadModal(null)}
                className="px-4 py-1.5 bg-[#16181B] text-xs font-bold rounded"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
