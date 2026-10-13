import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDealership } from '../../context/DealershipContext';
import {
  getAdminVehicles,
  bulkUpdateVehicleStatus,
  bulkAdjustVehiclePrices,
  deleteVehicle,
  saveAdminVehicle
} from '../../services/dataService';
import { Vehicle, VehicleStatus } from '../../types';
import {
  Car,
  Plus,
  Search,
  Filter,
  CheckSquare,
  Square,
  Copy,
  Trash2,
  Edit,
  Eye,
  TrendingUp,
  TrendingDown,
  ArrowUpDown,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

export const AdminVehiclesPage: React.FC = () => {
  const { categories, formatPrice, refreshData, addToast, adminUser } = useDealership();
  const navigate = useNavigate();

  const isOwner = adminUser?.role === 'owner';
  const rawAdminVehicles = getAdminVehicles();

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Bulk price adjustment modal/input
  const [showBulkPriceModal, setShowBulkPriceModal] = useState(false);
  const [bulkPercent, setBulkPercent] = useState<number>(5);

  const filtered = useMemo(() => {
    return rawAdminVehicles.filter(({ vehicle }) => {
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const match =
          vehicle.title.toLowerCase().includes(q) ||
          vehicle.stockNo.toLowerCase().includes(q) ||
          vehicle.make.toLowerCase().includes(q) ||
          vehicle.model.toLowerCase().includes(q);
        if (!match) return false;
      }
      if (statusFilter !== 'all' && vehicle.status !== statusFilter) return false;
      if (categoryFilter !== 'all' && !vehicle.categoryIds.includes(categoryFilter)) return false;
      return true;
    });
  }, [rawAdminVehicles, searchTerm, statusFilter, categoryFilter]);

  const toggleSelectAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map(item => item.vehicle.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds(prev => (prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]));
  };

  const handleBulkStatus = (status: VehicleStatus) => {
    if (selectedIds.length === 0) return;
    bulkUpdateVehicleStatus(selectedIds, status);
    refreshData();
    addToast(`Updated status to "${status}" for ${selectedIds.length} vehicle(s)`, 'success');
    setSelectedIds([]);
  };

  const handleBulkPriceAdjustment = () => {
    if (selectedIds.length === 0 || bulkPercent === 0) return;
    bulkAdjustVehiclePrices(selectedIds, bulkPercent, adminUser?.name || 'Admin');
    refreshData();
    addToast(`Adjusted prices by ${bulkPercent}% for ${selectedIds.length} vehicle(s)`, 'success');
    setShowBulkPriceModal(false);
    setSelectedIds([]);
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete ${title}? This cannot be undone.`)) {
      deleteVehicle(id);
      refreshData();
      addToast('Vehicle removed from system', 'info');
    }
  };

  const handleDuplicate = (vehicle: Vehicle, privateData?: any) => {
    const newId = `veh-${Date.now()}`;
    const newStockNo = `BAS-${Math.floor(1000 + Math.random() * 9000)}`;
    const duplicated: Vehicle = {
      ...vehicle,
      id: newId,
      stockNo: newStockNo,
      slug: `${vehicle.slug}-copy-${Math.floor(Math.random() * 1000)}`,
      title: `${vehicle.title} (Copy)`,
      status: 'Draft',
      viewsCount: 0,
      listedDate: new Date().toISOString()
    };

    const priv = privateData ? {
      ...privateData,
      vehicleId: newId,
      vin: `${privateData.vin || ''}COPY`
    } : {
      vehicleId: newId,
      vin: '',
      costPrice: vehicle.price * 0.88,
      markupType: 'fixed' as const,
      markupValue: vehicle.price * 0.12,
      computedSellingPrice: vehicle.price,
      marginAmount: vehicle.price * 0.12,
      marginPercent: 12,
      roundingRule: 500 as const,
      priceHistory: []
    };

    saveAdminVehicle(duplicated, priv, adminUser?.name || 'Admin');
    refreshData();
    addToast(`Duplicated as ${newStockNo} (Draft)`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#23272C]">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-[#C6A15B]">
            Fleet Inventory Management
          </span>
          <h1 className="font-heading text-3xl font-black uppercase text-[#F5F2EB]">
            Vehicles ({filtered.length})
          </h1>
        </div>

        <Link
          to="/admin/vehicles/new"
          className="px-4 py-2.5 bg-[#C6A15B] text-[#0A0A0B] font-heading text-sm font-bold uppercase tracking-wider rounded-[2px] hover:bg-[#A8843F] transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Vehicle</span>
        </Link>
      </div>

      {/* Filter and Bulk Bar */}
      <div className="card-luxury p-4 space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-[#9AA0A8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search make, model, stock no..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-[#0A0A0B] border border-[#23272C] rounded-[2px] pl-9 pr-3 py-2 text-xs text-[#F5F2EB]"
            />
          </div>

          {/* Status & Category filters */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-[#0A0A0B] border border-[#23272C] text-xs text-[#F5F2EB] px-3 py-2 rounded-[2px]"
            >
              <option value="all">All Statuses</option>
              <option value="Available">Available</option>
              <option value="Reserved">Reserved</option>
              <option value="Sold">Sold</option>
              <option value="Draft">Draft</option>
            </select>

            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="bg-[#0A0A0B] border border-[#23272C] text-xs text-[#F5F2EB] px-3 py-2 rounded-[2px]"
            >
              <option value="all">All Categories</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Bulk Action Controls */}
        {selectedIds.length > 0 && (
          <div className="p-3 bg-[#0A0A0B] border border-[#C6A15B]/40 rounded flex flex-wrap items-center justify-between gap-3 text-xs animate-fade-in">
            <span className="font-semibold text-[#C6A15B]">
              {selectedIds.length} vehicle(s) selected
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleBulkStatus('Available')}
                className="px-2.5 py-1 bg-[#16181B] border border-[#23272C] rounded text-white hover:border-[#0E7A33]"
              >
                Mark Available
              </button>
              <button
                onClick={() => handleBulkStatus('Reserved')}
                className="px-2.5 py-1 bg-[#16181B] border border-[#23272C] rounded text-white hover:border-[#EA580C]"
              >
                Mark Reserved
              </button>
              <button
                onClick={() => handleBulkStatus('Sold')}
                className="px-2.5 py-1 bg-[#B3261E] rounded text-white"
              >
                Mark Sold (Retain 90d)
              </button>
              {isOwner && (
                <button
                  onClick={() => setShowBulkPriceModal(true)}
                  className="px-2.5 py-1 bg-[#C6A15B] text-[#0A0A0B] font-bold rounded"
                >
                  Adjust Price %
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Vehicles Table */}
      <div className="card-luxury overflow-x-auto">
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="bg-[#0A0A0B] border-b border-[#23272C] text-[#9AA0A8] font-semibold uppercase tracking-wider">
              <th className="p-3.5 w-10">
                <button onClick={toggleSelectAll} className="p-0.5">
                  {selectedIds.length === filtered.length && filtered.length > 0 ? (
                    <CheckSquare className="w-4 h-4 text-[#C6A15B]" />
                  ) : (
                    <Square className="w-4 h-4 text-[#9AA0A8]" />
                  )}
                </button>
              </th>
              <th className="p-3.5">Vehicle</th>
              <th className="p-3.5">Stock No</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5">Selling Price</th>
              {isOwner && <th className="p-3.5">Cost & Margin</th>}
              <th className="p-3.5">Views</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#23272C]">
            {filtered.map(({ vehicle, privateData }) => {
              const isSelected = selectedIds.includes(vehicle.id);
              return (
                <tr
                  key={vehicle.id}
                  className={`hover:bg-[#16181B]/80 transition-colors ${
                    isSelected ? 'bg-[#16181B]' : ''
                  }`}
                >
                  <td className="p-3.5">
                    <button onClick={() => toggleSelectOne(vehicle.id)}>
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-[#C6A15B]" />
                      ) : (
                        <Square className="w-4 h-4 text-[#9AA0A8]" />
                      )}
                    </button>
                  </td>

                  {/* Thumbnail & Title */}
                  <td className="p-3.5">
                    <div className="flex items-center gap-3">
                      <img
                        src={vehicle.coverImage}
                        alt={vehicle.title}
                        className="w-14 h-10 object-cover rounded bg-[#121417] shrink-0"
                      />
                      <div>
                        <Link
                          to={`/admin/vehicles/edit/${vehicle.id}`}
                          className="font-bold text-sm text-[#F5F2EB] hover:text-[#C6A15B] transition-colors block"
                        >
                          {vehicle.year} {vehicle.make} {vehicle.model}
                        </Link>
                        <span className="text-[11px] text-[#9AA0A8]">{vehicle.trim}</span>
                        {vehicle.isDemo && (
                          <span className="ml-2 text-[9px] px-1 bg-[#0A0A0B] text-[#C6A15B] border border-[#C6A15B]/30 rounded">
                            DEMO
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Stock No */}
                  <td className="p-3.5 font-mono text-[#9AA0A8]">
                    {vehicle.stockNo}
                  </td>

                  {/* Status */}
                  <td className="p-3.5">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-[2px] ${
                        vehicle.status === 'Available'
                          ? 'bg-[#0E7A33]/20 text-[#0E7A33] border border-[#0E7A33]/30'
                          : vehicle.status === 'Sold'
                          ? 'bg-[#B3261E]/20 text-[#B3261E] border border-[#B3261E]/30'
                          : vehicle.status === 'Reserved'
                          ? 'bg-[#EA580C]/20 text-[#EA580C] border border-[#EA580C]/30'
                          : 'bg-[#9AA0A8]/20 text-[#9AA0A8]'
                      }`}
                    >
                      {vehicle.status}
                    </span>
                  </td>

                  {/* Selling Price */}
                  <td className="p-3.5 font-heading text-base font-bold text-[#F5F2EB]">
                    {formatPrice(vehicle.price, false)}
                  </td>

                  {/* Cost & Margin (Owner Only) */}
                  {isOwner && (
                    <td className="p-3.5">
                      {privateData ? (
                        <div className="font-mono text-[11px]">
                          <span className="text-[#9AA0A8] block">
                            Cost: US${privateData.costPrice.toLocaleString('en-US')}
                          </span>
                          <span className="text-[#0E7A33] font-bold block">
                            Margin: +{privateData.marginPercent}% (US${privateData.marginAmount.toLocaleString('en-US')})
                          </span>
                        </div>
                      ) : (
                        <span className="text-[#9AA0A8]">—</span>
                      )}
                    </td>
                  )}

                  {/* Views */}
                  <td className="p-3.5 text-xs text-[#9AA0A8] font-mono">
                    {vehicle.viewsCount || 0}
                  </td>

                  {/* Actions */}
                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        to={`/vehicle/${vehicle.slug}`}
                        target="_blank"
                        className="p-1.5 text-[#9AA0A8] hover:text-[#F5F2EB] rounded hover:bg-[#0A0A0B]"
                        title="View Public Listing"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => handleDuplicate(vehicle, privateData)}
                        className="p-1.5 text-[#9AA0A8] hover:text-[#C6A15B] rounded hover:bg-[#0A0A0B]"
                        title="Duplicate Listing"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <Link
                        to={`/admin/vehicles/edit/${vehicle.id}`}
                        className="p-1.5 text-[#9AA0A8] hover:text-[#C6A15B] rounded hover:bg-[#0A0A0B]"
                        title="Edit Vehicle"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(vehicle.id, vehicle.title)}
                        className="p-1.5 text-[#9AA0A8] hover:text-[#B3261E] rounded hover:bg-[#0A0A0B]"
                        title="Delete Vehicle"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Bulk Price Adjustment Modal */}
      {showBulkPriceModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="card-luxury p-6 max-w-sm w-full space-y-4">
            <h3 className="font-heading text-xl font-bold uppercase text-[#F5F2EB]">
              Adjust Selling Prices ({selectedIds.length} cars)
            </h3>
            <p className="text-xs text-[#9AA0A8]">
              Apply an immediate price adjustment percentage across selected vehicles.
            </p>
            <div>
              <label className="block text-xs font-semibold text-[#9AA0A8] mb-1">
                Adjustment Percentage (+ or - %)
              </label>
              <input
                type="number"
                step={1}
                value={bulkPercent}
                onChange={e => setBulkPercent(Number(e.target.value))}
                className="w-full bg-[#0A0A0B] border border-[#23272C] rounded-[2px] px-3 py-2 text-sm text-[#F5F2EB]"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowBulkPriceModal(false)}
                className="flex-1 py-2 bg-[#0A0A0B] border border-[#23272C] text-xs font-bold rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkPriceAdjustment}
                className="flex-1 py-2 bg-[#C6A15B] text-[#0A0A0B] text-xs font-bold rounded"
              >
                Apply Adjustment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
