import React from 'react';
import { Link } from 'react-router-dom';
import { useDealership } from '../context/DealershipContext';
import { SeoHead } from '../components/ui/SeoHead';
import { Scale, X, MessageCircle } from 'lucide-react';

export const ComparePage: React.FC = () => {
  const { vehicles, compareList, toggleCompare, clearCompare, formatPrice, settings } = useDealership();

  const comparedVehicles = vehicles.filter(v => compareList.includes(v.id));
  const cleanWhatsApp = settings.whatsappPlaceholder.replace(/[^\d]/g, '') || '263770000000';

  return (
    <div className="min-h-screen bg-white text-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <SeoHead
        title="Vehicle Comparison (Up to 3) | Borrowdale Auto Sales"
        description="Compare specifications, prices, engine outputs, and features side by side across premium vehicles at Borrowdale Auto Sales in Harare."
        canonicalUrl="https://borrowdaleautosales.co.zw/compare"
      />

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-gray-200">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#C6A15B]">
              Side-by-Side Analysis
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl font-black uppercase mt-1 text-gray-900">
              Compare Vehicles ({comparedVehicles.length}/3)
            </h1>
          </div>

          {comparedVehicles.length > 0 && (
            <button
              onClick={clearCompare}
              className="text-xs text-[#EA580C] hover:underline font-semibold"
            >
              Clear Comparison Matrix
            </button>
          )}
        </div>

        {comparedVehicles.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-[4px] p-12 text-center max-w-lg mx-auto shadow-sm">
            <Scale className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h2 className="font-heading text-2xl font-bold uppercase mb-2 text-gray-900">No Vehicles Selected</h2>
            <p className="text-xs text-gray-500 mb-6">
              Select the compare icon on any vehicle card in our inventory to evaluate up to 3 cars side by side.
            </p>
            <Link
              to="/inventory"
              className="px-6 py-2.5 bg-[#C6A15B] text-gray-950 font-heading text-sm font-bold uppercase tracking-wider rounded-[2px] hover:bg-[#A8843F] hover:text-white"
            >
              Browse Inventory
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto shadow-sm rounded border border-gray-200">
            <table className="w-full border-collapse text-xs">
              {/* Header: Photo and Title */}
              <thead>
                <tr>
                  <th className="p-4 bg-slate-50 border border-gray-200 text-left text-gray-500 font-bold uppercase w-48">
                    Specification
                  </th>
                  {comparedVehicles.map(v => (
                    <th key={v.id} className="p-4 bg-white border border-gray-200 text-left w-72">
                      <div className="relative aspect-[16/10] bg-gray-100 rounded overflow-hidden mb-3">
                        <img src={v.coverImage} alt={v.title} className="w-full h-full object-cover" />
                        <button
                          onClick={() => toggleCompare(v.id)}
                          className="absolute top-2 right-2 p-1.5 bg-black/60 text-white hover:text-[#EA580C] rounded"
                          aria-label="Remove vehicle from comparison"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <Link to={`/vehicle/${v.slug}`} className="font-heading text-lg font-bold uppercase block text-gray-900 hover:text-[#C6A15B]">
                        {v.year} {v.make} {v.model}
                      </Link>
                      <span className="text-xs text-gray-500 block mt-0.5">{v.trim}</span>
                      <strong className="font-heading text-xl font-bold text-[#C6A15B] block mt-2">
                        {formatPrice(v.price, false)}
                      </strong>
                    </th>
                  ))}
                  {/* Empty Slot if less than 3 */}
                  {Array.from({ length: 3 - comparedVehicles.length }).map((_, i) => (
                    <th key={`empty-${i}`} className="p-4 bg-slate-50 border border-gray-200 text-center w-72 text-gray-400">
                      <div className="aspect-[16/10] border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center p-4">
                        <Scale className="w-8 h-8 text-gray-300 mb-2" />
                        <span className="text-xs font-semibold uppercase">Empty Slot</span>
                        <Link to="/inventory" className="text-[11px] text-[#C6A15B] underline mt-1">
                          + Add Vehicle
                        </Link>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { label: 'Condition', key: 'condition' },
                  { label: 'Body Type', key: 'bodyType' },
                  { label: 'Mileage', render: (v: any) => `${v.mileage.toLocaleString('en-US')} km` },
                  { label: 'Engine Size', key: 'engineSize' },
                  { label: 'Fuel Type', key: 'fuel' },
                  { label: 'Transmission', key: 'transmission' },
                  { label: 'Drivetrain', key: 'drivetrain' },
                  { label: 'Exterior Color', key: 'exteriorColor' },
                  { label: 'Interior Color', key: 'interiorColor' },
                  { label: 'Seating Capacity', render: (v: any) => `${v.seats} seats` },
                  { label: 'Stock Number', key: 'stockNo' },
                  { label: 'Location', key: 'location' },
                ].map((row, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                    <td className="p-3 border border-gray-200 font-semibold text-gray-600 uppercase tracking-wider text-[11px]">
                      {row.label}
                    </td>
                    {comparedVehicles.map(v => (
                      <td key={v.id} className="p-3 border border-gray-200 text-gray-900 font-medium">
                        {row.render ? row.render(v) : (v as any)[row.key as any]}
                      </td>
                    ))}
                    {Array.from({ length: 3 - comparedVehicles.length }).map((_, i) => (
                      <td key={`empty-cell-${i}`} className="p-3 border border-gray-200 text-gray-400 text-center">
                        —
                      </td>
                    ))}
                  </tr>
                ))}
                {/* Actions row */}
                <tr className="bg-slate-50">
                  <td className="p-4 border border-gray-200 font-semibold text-gray-600 uppercase">
                    Action
                  </td>
                  {comparedVehicles.map(v => (
                    <td key={v.id} className="p-4 border border-gray-200">
                      <div className="flex flex-col gap-2">
                        <Link
                          to={`/vehicle/${v.slug}`}
                          className="py-2 px-3 text-center rounded-[2px] bg-[#C6A15B] text-gray-950 font-heading text-xs font-bold uppercase tracking-wider hover:bg-[#A8843F] hover:text-white"
                        >
                          View Details
                        </Link>
                        <a
                          href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(`Hi, I am comparing the ${v.year} ${v.make} ${v.model} (${v.stockNo}).`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-2 px-3 text-center rounded-[2px] bg-[#0E7A33] text-white font-heading text-xs font-bold uppercase flex items-center justify-center gap-1 hover:bg-[#0E7A33]/90"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    </td>
                  ))}
                  {Array.from({ length: 3 - comparedVehicles.length }).map((_, i) => (
                    <td key={`empty-action-${i}`} className="p-4 border border-gray-200"></td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
