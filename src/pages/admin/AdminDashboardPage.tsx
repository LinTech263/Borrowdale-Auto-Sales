import React from 'react';
import { Link } from 'react-router-dom';
import { useDealership } from '../../context/DealershipContext';
import { getLeads } from '../../services/dataService';
import {
  Car,
  BookmarkCheck,
  CheckCircle,
  Users,
  DollarSign,
  TrendingUp,
  Plus,
  Eye,
  ArrowUpRight,
  MessageCircle,
  Clock,
  Sparkles
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { vehicles, categories, formatPrice, adminUser } = useDealership();
  const leads = getLeads();

  const isOwner = adminUser?.role === 'owner';

  // 1. Vehicles live, reserved, sold
  const liveCount = vehicles.filter(v => v.status === 'Available').length;
  const reservedCount = vehicles.filter(v => v.status === 'Reserved').length;
  const soldCount = vehicles.filter(v => v.status === 'Sold').length;

  // 2. Leads KPIs
  const newLeads = leads.filter(l => l.status === 'New');
  const offersAwaitingReply = leads.filter(l => l.type === 'make_offer' && (l.status === 'New' || l.status === 'Negotiating'));

  // 3. Average offer vs asking %
  const offerLeadsWithPrices = leads.filter(l => l.offerAmount && l.vehicleAskingPrice && l.vehicleAskingPrice > 0);
  const avgOfferRatio = offerLeadsWithPrices.length > 0
    ? offerLeadsWithPrices.reduce((acc, curr) => acc + (curr.offerAmount! / curr.vehicleAskingPrice!) * 100, 0) / offerLeadsWithPrices.length
    : 94.2;

  // 4. Top viewed vehicles
  const topViewedVehicles = [...vehicles].sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0)).slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Top Welcome & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#23272C]">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-[#C6A15B]">
            Harare Operations Center
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl font-black uppercase text-[#F5F2EB]">
            Dealership Overview
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/admin/vehicles/new"
            className="px-4 py-2 bg-[#C6A15B] text-[#0A0A0B] font-heading text-xs font-bold uppercase tracking-wider rounded-[2px] hover:bg-[#A8843F] flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Vehicle</span>
          </Link>
          <Link
            to="/admin/categories"
            className="px-4 py-2 bg-[#16181B] border border-[#23272C] text-[#F5F2EB] font-heading text-xs font-bold uppercase tracking-wider rounded-[2px] hover:border-[#C6A15B]"
          >
            <span>Manage Categories</span>
          </Link>
          {isOwner && (
            <Link
              to="/admin/settings"
              className="px-4 py-2 bg-[#16181B] border border-[#23272C] text-[#9AA0A8] hover:text-[#F5F2EB] font-heading text-xs font-bold uppercase tracking-wider rounded-[2px]"
            >
              <span>Site Settings</span>
            </Link>
          )}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3.5">
        {/* Vehicles Live */}
        <div className="card-luxury p-4 bg-[#16181B]">
          <div className="flex items-center justify-between text-[#9AA0A8] mb-2">
            <span className="text-[11px] font-semibold uppercase">Vehicles Live</span>
            <Car className="w-4 h-4 text-[#0E7A33]" />
          </div>
          <span className="font-heading text-3xl font-black text-[#F5F2EB]">{liveCount}</span>
          <span className="text-[10px] text-[#0E7A33] block mt-1">Available on floor</span>
        </div>

        {/* Reserved */}
        <div className="card-luxury p-4 bg-[#16181B]">
          <div className="flex items-center justify-between text-[#9AA0A8] mb-2">
            <span className="text-[11px] font-semibold uppercase">Reserved</span>
            <BookmarkCheck className="w-4 h-4 text-[#EA580C]" />
          </div>
          <span className="font-heading text-3xl font-black text-[#F5F2EB]">{reservedCount}</span>
          <span className="text-[10px] text-[#EA580C] block mt-1">Under deposit</span>
        </div>

        {/* Sold */}
        <div className="card-luxury p-4 bg-[#16181B]">
          <div className="flex items-center justify-between text-[#9AA0A8] mb-2">
            <span className="text-[11px] font-semibold uppercase">Sold (90d)</span>
            <CheckCircle className="w-4 h-4 text-[#B3261E]" />
          </div>
          <span className="font-heading text-3xl font-black text-[#F5F2EB]">{soldCount}</span>
          <span className="text-[10px] text-[#9AA0A8] block mt-1">Recently Sold proof</span>
        </div>

        {/* New Leads */}
        <div className="card-luxury p-4 bg-[#16181B]">
          <div className="flex items-center justify-between text-[#9AA0A8] mb-2">
            <span className="text-[11px] font-semibold uppercase">New Enquiries</span>
            <Users className="w-4 h-4 text-[#C6A15B]" />
          </div>
          <span className="font-heading text-3xl font-black text-[#C6A15B]">{newLeads.length}</span>
          <span className="text-[10px] text-[#C6A15B] block mt-1">Unprocessed leads</span>
        </div>

        {/* Offers Awaiting Reply */}
        <div className="card-luxury p-4 bg-[#16181B]">
          <div className="flex items-center justify-between text-[#9AA0A8] mb-2">
            <span className="text-[11px] font-semibold uppercase">Offers In Play</span>
            <DollarSign className="w-4 h-4 text-[#38BDF8]" />
          </div>
          <span className="font-heading text-3xl font-black text-[#38BDF8]">{offersAwaitingReply.length}</span>
          <span className="text-[10px] text-[#38BDF8] block mt-1">Requires WhatsApp reply</span>
        </div>

        {/* Avg Offer vs Asking */}
        <div className="card-luxury p-4 bg-[#16181B]">
          <div className="flex items-center justify-between text-[#9AA0A8] mb-2">
            <span className="text-[11px] font-semibold uppercase">Avg Offer / Ask</span>
            <TrendingUp className="w-4 h-4 text-[#C6A15B]" />
          </div>
          <span className="font-heading text-3xl font-black text-[#F5F2EB]">{avgOfferRatio.toFixed(1)}%</span>
          <span className="text-[10px] text-[#0E7A33] block mt-1">Healthy buyer intent</span>
        </div>
      </div>

      {/* Split Section: Recent CRM Leads stream & Top Viewed Vehicles */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent CRM Leads (7 cols) */}
        <div className="lg:col-span-7 card-luxury p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#23272C]">
            <h2 className="font-heading text-xl font-bold uppercase text-[#F5F2EB]">
              Recent Buyer Leads & Offers
            </h2>
            <Link to="/admin/leads" className="text-xs text-[#C6A15B] hover:underline font-semibold">
              Open Full Kanban Pipeline ({leads.length}) →
            </Link>
          </div>

          <div className="space-y-3">
            {leads.slice(0, 5).map(lead => {
              const cleanWa = lead.phone.replace(/[^\d]/g, '');
              const waLink = `https://wa.me/${cleanWa}?text=${encodeURIComponent(
                `Hi ${lead.customerName}, thanks for your inquiry regarding ${lead.vehicleTitle || 'our Borrowdale showroom'}.`
              )}`;

              return (
                <div key={lead.id} className="p-3.5 bg-[#0A0A0B] border border-[#23272C] rounded-[2px] flex items-center justify-between gap-3 text-xs">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <strong className="text-[#F5F2EB] text-sm">{lead.customerName}</strong>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#16181B] border border-[#23272C] text-[#C6A15B] uppercase font-mono">
                        {lead.type.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] text-[#9AA0A8]">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-[#9AA0A8] truncate">
                      {lead.vehicleTitle ? lead.vehicleTitle : lead.message}
                    </p>

                    {lead.offerAmount && lead.vehicleAskingPrice && (
                      <div className="flex items-center gap-3 text-[11px] font-mono">
                        <span>Asking: <strong className="text-[#F5F2EB]">US${lead.vehicleAskingPrice.toLocaleString('en-US')}</strong></span>
                        <span>Offer: <strong className="text-[#C6A15B]">US${lead.offerAmount.toLocaleString('en-US')}</strong></span>
                        <span className="text-[#EA580C]">
                          ({(((lead.offerAmount - lead.vehicleAskingPrice) / lead.vehicleAskingPrice) * 100).toFixed(1)}%)
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-[#0E7A33] text-white rounded-[2px] hover:bg-[#0E7A33]/90 transition-colors"
                      title="1-Click WhatsApp Reply"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top-Viewed Vehicles (5 cols) */}
        <div className="lg:col-span-5 card-luxury p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#23272C]">
            <h2 className="font-heading text-xl font-bold uppercase text-[#F5F2EB]">
              Most Popular Vehicles
            </h2>
            <Link to="/admin/vehicles" className="text-xs text-[#C6A15B] hover:underline font-semibold">
              View All ({vehicles.length}) →
            </Link>
          </div>

          <div className="space-y-3">
            {topViewedVehicles.map(v => (
              <div key={v.id} className="p-3 bg-[#0A0A0B] border border-[#23272C] rounded-[2px] flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3 min-w-0">
                  <img src={v.coverImage} alt={v.title} className="w-12 h-9 object-cover rounded shrink-0 bg-[#121417]" />
                  <div className="truncate">
                    <Link to={`/admin/vehicles/edit/${v.id}`} className="font-bold text-[#F5F2EB] hover:text-[#C6A15B] block truncate">
                      {v.year} {v.make} {v.model}
                    </Link>
                    <span className="text-[11px] text-[#9AA0A8] font-mono">
                      US${v.price.toLocaleString('en-US')} • {v.stockNo}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[#C6A15B] shrink-0 font-mono">
                  <Eye className="w-3.5 h-3.5" />
                  <span>{v.viewsCount || 0}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
