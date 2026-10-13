import React, { useState } from 'react';
import { useDealership } from '../../context/DealershipContext';
import { createLead } from '../../services/dataService';
import { X, CheckCircle2, Lock } from 'lucide-react';

export const RequestPriceModal: React.FC = () => {
  const { activePriceRequestVehicle, setActivePriceRequestVehicle, addToast } = useDealership();
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!activePriceRequestVehicle) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim()) {
      addToast('Please enter your name and phone number', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      createLead({
        type: 'enquiry',
        status: 'New',
        customerName: customerName.trim(),
        phone: phone.trim(),
        preferredContact: 'WhatsApp',
        vehicleId: activePriceRequestVehicle.id,
        vehicleTitle: `${activePriceRequestVehicle.year} ${activePriceRequestVehicle.make} ${activePriceRequestVehicle.model}`,
        vehicleStockNo: activePriceRequestVehicle.stockNo,
        message: 'Requested price quotation directly via quick form.',
        sourceUrl: `/vehicle/${activePriceRequestVehicle.slug}`
      });

      setIsSuccess(true);
      addToast('Price quotation requested successfully', 'success');
    } catch (err) {
      console.error(err);
      addToast('Failed to request price. Please reach out via WhatsApp.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setActivePriceRequestVehicle(null);
    setIsSuccess(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white border border-gray-200 rounded-[4px] p-6 text-gray-900 shadow-2xl">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 p-1 rounded"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="text-center py-4">
            <CheckCircle2 className="w-10 h-10 text-[#0E7A33] mx-auto mb-2" />
            <h3 className="font-heading text-xl font-bold uppercase text-gray-900">Price Sent to Sales Desk</h3>
            <p className="text-xs text-gray-600 mt-1 mb-4">
              Our team will WhatsApp the current USD price and availability for the{' '}
              {activePriceRequestVehicle.year} {activePriceRequestVehicle.make} {activePriceRequestVehicle.model} immediately.
            </p>
            <button
              onClick={handleClose}
              className="px-5 py-2 bg-[#C6A15B] text-gray-950 text-xs font-bold rounded-[2px] hover:bg-[#A8843F] hover:text-white"
            >
              Close
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 text-[#C6A15B] text-xs font-bold uppercase mb-1">
              <Lock className="w-3.5 h-3.5" />
              <span>Direct Quotation</span>
            </div>
            <h2 className="font-heading text-2xl font-bold uppercase text-gray-900">Request Price</h2>
            <p className="text-xs text-gray-500 mb-4">
              {activePriceRequestVehicle.year} {activePriceRequestVehicle.make} {activePriceRequestVehicle.model} ({activePriceRequestVehicle.stockNo})
            </p>

            <form onSubmit={handleSubmit} className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Your Name*</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  placeholder="e.g. Tendai"
                  className="w-full bg-white border border-gray-300 rounded-[2px] px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#C6A15B]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">WhatsApp / Phone (+263)*</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="e.g. 077 123 4567"
                  className="w-full bg-white border border-gray-300 rounded-[2px] px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#C6A15B]"
                />
              </div>

              <p className="text-[11px] text-gray-500">
                We value your time: no sales spam, just the exact USD pricing and spec sheet sent to your WhatsApp.
              </p>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-[2px] bg-[#C6A15B] text-gray-950 font-heading text-base font-bold uppercase tracking-wider hover:bg-[#A8843F] hover:text-white transition-colors shadow-xs"
              >
                {isSubmitting ? 'Requesting...' : 'Get Price on WhatsApp'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
