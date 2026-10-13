import React, { useState } from 'react';
import { useDealership } from '../../context/DealershipContext';
import { createLead } from '../../services/dataService';
import { X, Calendar, CheckCircle2, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';

export const BookViewingModal: React.FC = () => {
  const { activeViewingVehicle, setActiveViewingVehicle, addToast } = useDealership();

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('Morning (09:00 - 12:00)');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!activeViewingVehicle) return null;

  const handleClose = () => {
    setActiveViewingVehicle(null);
    setIsSuccess(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim() || !phone.trim() || !date) {
      addToast('Please complete all required fields', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      createLead({
        type: 'book_viewing',
        status: 'New',
        customerName: customerName.trim(),
        phone: phone.trim(),
        preferredContact: 'WhatsApp',
        vehicleId: activeViewingVehicle.id,
        vehicleTitle: `${activeViewingVehicle.year} ${activeViewingVehicle.make} ${activeViewingVehicle.model}`,
        vehicleStockNo: activeViewingVehicle.stockNo,
        viewingDateTime: `${date} at ${preferredTime}`,
        message: message.trim() || undefined,
        sourceUrl: window.location.pathname,
      });

      setIsSubmitting(false);
      setIsSuccess(true);
      confetti({ particleCount: 70, spread: 60 });
      addToast('Viewing appointment requested! We will confirm via WhatsApp.', 'success');
    } catch {
      setIsSubmitting(false);
      addToast('Could not book appointment. Please message us directly on WhatsApp.', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white border border-gray-200 rounded-[4px] shadow-2xl p-6 md:p-8 my-8 text-gray-900">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 p-1"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#0E7A33]/15 border border-[#0E7A33] flex items-center justify-center text-[#0E7A33]">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="font-heading text-2xl font-bold uppercase mb-2 text-gray-900">
              Appointment Requested
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Thank you, {customerName}. We have reserved your viewing slot for {date} ({preferredTime}). Our concierge desk will WhatsApp you directly to confirm.
            </p>
            <button
              onClick={handleClose}
              className="px-6 py-2.5 rounded-[2px] bg-[#C6A15B] text-gray-950 font-semibold text-sm hover:bg-[#A8843F] hover:text-white"
            >
              Done
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-6 border-b border-gray-200 pb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#C6A15B]">
                Private Appointment
              </span>
              <h2 className="font-heading text-2xl font-bold uppercase mt-0.5 text-gray-900">
                Book Viewing or Test Drive
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                {activeViewingVehicle.year} {activeViewingVehicle.make} {activeViewingVehicle.model} ({activeViewingVehicle.stockNo})
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-sm">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Full Name*
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  placeholder="e.g. Nyasha Makoni"
                  className="w-full bg-white border border-gray-300 rounded-[2px] px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#C6A15B]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  WhatsApp / Phone (+263)*
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="e.g. 077 123 4567"
                  className="w-full bg-white border border-gray-300 rounded-[2px] px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#C6A15B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Preferred Date*
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-[2px] px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#C6A15B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Preferred Time
                  </label>
                  <select
                    value={preferredTime}
                    onChange={e => setPreferredTime(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-[2px] px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#C6A15B]"
                  >
                    <option value="Morning (09:00 - 12:00)">Morning (09:00 - 12:00)</option>
                    <option value="Early Afternoon (12:00 - 14:30)">Early Afternoon (12:00 - 14:30)</option>
                    <option value="Late Afternoon (14:30 - 17:00)">Late Afternoon (14:30 - 17:00)</option>
                    <option value="Saturday Morning">Saturday Morning</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Special requests, mechanic accompanying, etc."
                  className="w-full bg-white border border-gray-300 rounded-[2px] px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#C6A15B]"
                />
              </div>

              <div className="p-2.5 bg-slate-50 border border-gray-200 rounded text-xs text-gray-600 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#C6A15B] shrink-0" />
                <span>We prep and inspect the vehicle in our private Borrowdale viewing bay prior to your arrival.</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-[2px] bg-[#C6A15B] text-gray-950 font-heading text-lg font-bold uppercase tracking-wider hover:bg-[#A8843F] hover:text-white transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <Calendar className="w-4 h-4" />
                <span>{isSubmitting ? 'Booking...' : 'Confirm Appointment Request'}</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
