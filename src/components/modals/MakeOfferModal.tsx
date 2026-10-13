import React, { useState } from 'react';
import { useDealership } from '../../context/DealershipContext';
import { createLead } from '../../services/dataService';
import { X, CheckCircle2, ShieldCheck, ArrowRight, DollarSign } from 'lucide-react';
import confetti from 'canvas-confetti';

export const MakeOfferModal: React.FC = () => {
  const { activeOfferVehicle, setActiveOfferVehicle, formatPrice, addToast } = useDealership();

  const [offerAmount, setOfferAmount] = useState<number | ''>(
    activeOfferVehicle ? Math.round(activeOfferVehicle.price * 0.95) : ''
  );
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [preferredContact, setPreferredContact] = useState<'WhatsApp' | 'Call' | 'Email'>('WhatsApp');
  const [bestTimeToContact, setBestTimeToContact] = useState<'Morning' | 'Afternoon' | 'Anytime'>('Anytime');
  const [hasTradeIn, setHasTradeIn] = useState(false);
  const [tradeInMake, setTradeInMake] = useState('');
  const [tradeInModel, setTradeInModel] = useState('');
  const [tradeInYear, setTradeInYear] = useState('');
  const [tradeInMileage, setTradeInMileage] = useState('');
  const [needsFinance, setNeedsFinance] = useState(false);
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState(''); // Anti-spam bot trap

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!activeOfferVehicle) return null;

  const handleClose = () => {
    setActiveOfferVehicle(null);
    setIsSuccess(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Anti-spam honeypot verification
    if (honeypot) {
      handleClose();
      return;
    }

    if (!offerAmount || !customerName.trim() || !phone.trim()) {
      addToast('Please provide your name, phone number, and offer amount.', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      createLead({
        type: 'make_offer',
        status: 'New',
        customerName: customerName.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        preferredContact,
        bestTimeToContact,
        vehicleId: activeOfferVehicle.id,
        vehicleTitle: `${activeOfferVehicle.year} ${activeOfferVehicle.make} ${activeOfferVehicle.model}`,
        vehicleStockNo: activeOfferVehicle.stockNo,
        vehicleAskingPrice: activeOfferVehicle.price,
        offerAmount: Number(offerAmount),
        hasTradeIn,
        tradeInDetails: hasTradeIn && tradeInMake.trim()
          ? {
              make: tradeInMake.trim(),
              model: tradeInModel.trim() || 'Vehicle',
              year: Number(tradeInYear) || 2020,
              mileage: Number(tradeInMileage) || 0,
              condition: 'Good',
            }
          : undefined,
        needsFinance,
        message: message.trim() || undefined,
        sourceUrl: window.location.pathname,
      });

      setIsSubmitting(false);
      setIsSuccess(true);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
      addToast('Offer successfully transmitted to dealership principal!', 'success');
    } catch {
      setIsSubmitting(false);
      addToast('Could not submit offer. Please WhatsApp us directly.', 'error');
    }
  };

  const delta = typeof offerAmount === 'number' ? offerAmount - activeOfferVehicle.price : 0;
  const deltaPercent = typeof offerAmount === 'number' && activeOfferVehicle.price > 0
    ? ((delta / activeOfferVehicle.price) * 100).toFixed(1)
    : '0';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white border border-gray-200 rounded-[4px] shadow-2xl p-6 md:p-8 my-8 text-gray-900">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 p-1 rounded transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#0E7A33]/15 border border-[#0E7A33] flex items-center justify-center text-[#0E7A33]">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="font-heading text-2xl md:text-3xl font-bold uppercase mb-2 text-gray-900">
              Offer Received
            </h2>
            <p className="text-sm text-gray-600 mb-6 max-w-md mx-auto leading-relaxed">
              Received. A senior member of our Borrowdale team will contact you shortly on {preferredContact} to discuss your offer of{' '}
              <strong className="text-gray-900">US${Number(offerAmount).toLocaleString('en-US')}</strong> on the{' '}
              {activeOfferVehicle.year} {activeOfferVehicle.make} {activeOfferVehicle.model}.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleClose}
                className="px-6 py-2.5 rounded-[2px] bg-[#C6A15B] text-gray-950 font-semibold text-sm hover:bg-[#A8843F] hover:text-white transition-colors"
              >
                Back to Vehicle
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="mb-6 border-b border-gray-200 pb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#C6A15B]">
                Make an Offer
              </span>
              <h2 className="font-heading text-2xl md:text-3xl font-bold uppercase mt-0.5 text-gray-900">
                {activeOfferVehicle.year} {activeOfferVehicle.make} {activeOfferVehicle.model}
              </h2>
              <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500">
                <span>Stock: <strong className="text-gray-900 font-mono">{activeOfferVehicle.stockNo}</strong></span>
                <span>•</span>
                <span>Asking Price: <strong className="text-[#C6A15B] font-mono">{formatPrice(activeOfferVehicle.price, false)}</strong></span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              {/* Honeypot field (hidden from humans) */}
              <input
                type="text"
                name="website_company_address"
                value={honeypot}
                onChange={e => setHoneypot(e.target.value)}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
              />

              {/* Offer Amount Field */}
              <div className="p-3.5 rounded bg-slate-50 border border-gray-200">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
                  Your Proposed Offer (US$)*
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C6A15B] font-bold">US$</span>
                  <input
                    type="number"
                    required
                    min={1000}
                    step={100}
                    value={offerAmount}
                    onChange={e => setOfferAmount(e.target.value ? Number(e.target.value) : '')}
                    placeholder="e.g. 132000"
                    className="w-full bg-white border border-gray-300 rounded-[2px] pl-12 pr-4 py-2.5 text-lg font-bold text-gray-900 focus:outline-none focus:border-[#C6A15B]"
                  />
                </div>
                {typeof offerAmount === 'number' && offerAmount > 0 && (
                  <div className="mt-2 text-xs flex items-center justify-between text-gray-600">
                    <span>Difference from asking:</span>
                    <span className={delta < 0 ? 'text-[#EA580C] font-semibold' : 'text-[#0E7A33] font-semibold'}>
                      {delta < 0 ? `-${Math.abs(delta).toLocaleString('en-US')} (${deltaPercent}%)` : `+${delta.toLocaleString('en-US')} (${deltaPercent}%)`}
                    </span>
                  </div>
                )}
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Your Full Name*
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    placeholder="e.g. Tendai Moyo"
                    className="w-full bg-white border border-gray-300 rounded-[2px] px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#C6A15B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Phone / WhatsApp (+263)*
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="e.g. 077 234 5678"
                    className="w-full bg-white border border-gray-300 rounded-[2px] px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#C6A15B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="name@example.co.zw"
                    className="w-full bg-white border border-gray-300 rounded-[2px] px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#C6A15B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Preferred Contact Channel
                  </label>
                  <div className="grid grid-cols-3 gap-1">
                    {(['WhatsApp', 'Call', 'Email'] as const).map(method => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setPreferredContact(method)}
                        className={`py-2 text-xs font-medium rounded-[2px] border transition-colors ${
                          preferredContact === method
                            ? 'bg-[#C6A15B] border-[#C6A15B] text-gray-950 font-semibold'
                            : 'bg-white border-gray-300 text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Trade-in Toggle */}
              <div className="pt-2 border-t border-gray-200">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={hasTradeIn}
                    onChange={e => setHasTradeIn(e.target.checked)}
                    className="w-4 h-4 rounded text-[#C6A15B] focus:ring-[#C6A15B]"
                  />
                  <span className="text-xs font-medium text-gray-800">
                    I want to trade in a vehicle against this purchase
                  </span>
                </label>

                {hasTradeIn && (
                  <div className="mt-3 p-3 bg-slate-50 border border-gray-200 rounded space-y-2.5">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#C6A15B]">
                      Trade-In Vehicle Details
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Make (e.g. Toyota)"
                        value={tradeInMake}
                        onChange={e => setTradeInMake(e.target.value)}
                        className="bg-white border border-gray-300 rounded-[2px] px-2.5 py-1.5 text-xs text-gray-900"
                      />
                      <input
                        type="text"
                        placeholder="Model (e.g. Hilux GD-6)"
                        value={tradeInModel}
                        onChange={e => setTradeInModel(e.target.value)}
                        className="bg-white border border-gray-300 rounded-[2px] px-2.5 py-1.5 text-xs text-gray-900"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        placeholder="Year (e.g. 2019)"
                        value={tradeInYear}
                        onChange={e => setTradeInYear(e.target.value)}
                        className="bg-white border border-gray-300 rounded-[2px] px-2.5 py-1.5 text-xs text-gray-900"
                      />
                      <input
                        type="number"
                        placeholder="Approx. Mileage (km)"
                        value={tradeInMileage}
                        onChange={e => setTradeInMileage(e.target.value)}
                        className="bg-white border border-gray-300 rounded-[2px] px-2.5 py-1.5 text-xs text-gray-900"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Finance Toggle */}
              <div>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={needsFinance}
                    onChange={e => setNeedsFinance(e.target.checked)}
                    className="w-4 h-4 rounded text-[#C6A15B] focus:ring-[#C6A15B]"
                  />
                  <span className="text-xs font-medium text-gray-800">
                    I may require bank or corporate financing assistance
                  </span>
                </label>
              </div>

              {/* Note / Message */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Additional Notes or Terms (Optional)
                </label>
                <textarea
                  rows={2}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="e.g. Available for inspection in Borrowdale this Thursday; cash settlement."
                  className="w-full bg-white border border-gray-300 rounded-[2px] px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#C6A15B]"
                />
              </div>

              {/* Disclaimer */}
              <div className="flex items-center gap-2 text-[11px] text-gray-500 bg-slate-50 p-2.5 rounded border border-gray-200">
                <ShieldCheck className="w-4 h-4 text-[#C6A15B] shrink-0" />
                <span>
                  Offers are non-binding. We respect your privacy and will contact you directly to discuss terms.
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-[2px] bg-[#C6A15B] text-gray-950 font-heading text-lg font-bold uppercase tracking-wider hover:bg-[#A8843F] hover:text-white transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                {isSubmitting ? (
                  <span>Submitting Offer...</span>
                ) : (
                  <>
                    <span>Submit Offer to Dealership</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
