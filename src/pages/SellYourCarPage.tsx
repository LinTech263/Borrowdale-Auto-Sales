import React, { useState } from 'react';
import { useDealership } from '../context/DealershipContext';
import { SeoHead } from '../components/ui/SeoHead';
import { createLead } from '../services/dataService';
import { ArrowRight, CheckCircle2, ShieldCheck, Upload, MessageCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export const SellYourCarPage: React.FC = () => {
  const { settings, addToast } = useDealership();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [preferredContact, setPreferredContact] = useState<'WhatsApp' | 'Call' | 'Email'>('WhatsApp');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [mileage, setMileage] = useState('');
  const [condition, setCondition] = useState('Excellent');
  const [askingValuation, setAskingValuation] = useState('');
  const [wantsToBuyFromUs, setWantsToBuyFromUs] = useState(true);
  const [desiredNextCar, setDesiredNextCar] = useState('');
  const [message, setMessage] = useState('');
  const [photosCount, setPhotosCount] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cleanWhatsApp = settings.whatsappPlaceholder.replace(/[^\d]/g, '') || '263770000000';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !make || !model) {
      addToast('Please complete all required fields (*)', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      createLead({
        type: 'trade_in',
        status: 'New',
        customerName: name.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        preferredContact,
        hasTradeIn: true,
        tradeInDetails: {
          make: make.trim(),
          model: model.trim(),
          year: Number(year) || 2020,
          mileage: Number(mileage) || 50000,
          condition,
          askingValuation: Number(askingValuation) || undefined
        },
        message: `${message ? message + ' ' : ''}${wantsToBuyFromUs ? `Client interested in upgrading to: ${desiredNextCar || 'Stock vehicle'}` : 'Straight sale to dealership'}. [Uploaded ${photosCount} demo photos]`,
        sourceUrl: '/sell-your-car'
      });

      setSubmitted(true);
      confetti({ particleCount: 75, spread: 60 });
      addToast('Valuation request submitted successfully', 'success');
    } catch (err) {
      console.error(err);
      addToast('Error submitting valuation. Please reach out via WhatsApp.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <SeoHead
        title="Sell Your Car or Trade In in Harare | Borrowdale Auto Sales"
        description="Looking to sell or trade in your luxury SUV, double cab or executive car in Harare? Fast valuation response, honest USD settlement, and hassle-free change of ownership."
        canonicalUrl="https://borrowdaleautosales.co.zw/sell-your-car"
      />

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#0E7A33]">
            Trade-In & Vehicle Valuation
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-black uppercase mt-1 mb-3 text-gray-900">
            Your Car Has Value. Let's Put A Number On It.
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 max-w-xl mx-auto leading-relaxed">
            Send a few details and photos. We will respond promptly with a realistic valuation and trade-in figure on your next vehicle at our Borrowdale showroom.
          </p>
        </div>

        {submitted ? (
          <div className="bg-white border-2 border-[#0E7A33] rounded-[4px] p-8 sm:p-12 text-center max-w-xl mx-auto shadow-md">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#0E7A33]/15 border border-[#0E7A33] flex items-center justify-center text-[#0E7A33]">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="font-heading text-3xl font-bold uppercase mb-2 text-gray-900">
              Valuation Request Received
            </h2>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              Thank you, {name}. A member of our valuation desk will review the details for your {year} {make} {model} and contact you on {preferredContact} with a proposed figure.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => setSubmitted(false)}
                className="px-6 py-2.5 rounded-[2px] bg-slate-100 border border-gray-300 text-xs font-bold uppercase text-gray-800 hover:bg-gray-200"
              >
                Submit Another Vehicle
              </button>
              <a
                href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(`Hi Borrowdale Auto Sales, I just submitted valuation details for my ${year} ${make} ${model}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2.5 rounded-[2px] bg-[#0E7A33] text-white text-xs font-bold uppercase flex items-center justify-center gap-1.5 hover:bg-[#0E7A33]/90"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Follow Up on WhatsApp</span>
              </a>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-[4px] p-6 sm:p-10 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6 text-xs sm:text-sm">
              {/* Vehicle Particulars */}
              <div>
                <h3 className="font-heading text-xl font-bold uppercase text-[#C6A15B] mb-3 pb-2 border-b border-gray-200">
                  1. Your Vehicle Particulars
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Make*</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Toyota, Mercedes-Benz, Land Rover"
                      value={make}
                      onChange={e => setMake(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-[2px] px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#C6A15B]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Model & Trim*</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Hilux Legend RS, Prado TX-L, C200"
                      value={model}
                      onChange={e => setModel(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-[2px] px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#C6A15B]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Year of Manufacture*</label>
                    <input
                      type="number"
                      required
                      min={1995}
                      max={2026}
                      placeholder="e.g. 2021"
                      value={year}
                      onChange={e => setYear(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-[2px] px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#C6A15B]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Approx. Mileage (km)*</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 54000"
                      value={mileage}
                      onChange={e => setMileage(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-[2px] px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#C6A15B]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Overall Condition</label>
                    <select
                      value={condition}
                      onChange={e => setCondition(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-[2px] px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#C6A15B]"
                    >
                      <option value="Showroom Pristine">Showroom Pristine (No blemishes)</option>
                      <option value="Excellent">Excellent (Minor cosmetic stone chips)</option>
                      <option value="Good">Good (Regular road use)</option>
                      <option value="Fair">Fair (Needs mechanical / body attention)</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Your Expected or Desired Valuation (US$)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 35000"
                    value={askingValuation}
                    onChange={e => setAskingValuation(e.target.value)}
                    className="w-full sm:w-1/2 bg-white border border-gray-300 rounded-[2px] px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#C6A15B]"
                  />
                </div>
              </div>

              {/* Photo Upload Simulator */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Vehicle Photos (Up to 8: Exterior, Interior, Odometer)
                </label>
                <div
                  onClick={() => setPhotosCount(prev => Math.min(8, prev + 2))}
                  className="p-6 border-2 border-dashed border-gray-300 rounded-[2px] bg-slate-50 hover:border-[#C6A15B] cursor-pointer text-center transition-colors"
                >
                  <Upload className="w-8 h-8 text-[#C6A15B] mx-auto mb-2" />
                  <span className="text-xs font-semibold block text-gray-900">
                    {photosCount > 0 ? `${photosCount} photo(s) selected` : 'Click to attach photos or drag & drop'}
                  </span>
                  <span className="text-[11px] text-gray-500">
                    PNG, JPG, HEIC up to 15MB each
                  </span>
                </div>
                {photosCount > 0 && (
                  <button
                    type="button"
                    onClick={() => setPhotosCount(0)}
                    className="text-[11px] text-[#EA580C] hover:underline mt-1"
                  >
                    Clear selected photos
                  </button>
                )}
              </div>

              {/* Trade-In Upgrade Toggle */}
              <div className="p-4 bg-slate-50 border border-gray-200 rounded-[2px] space-y-3">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={wantsToBuyFromUs}
                    onChange={e => setWantsToBuyFromUs(e.target.checked)}
                    className="w-4 h-4 rounded text-[#C6A15B] focus:ring-[#C6A15B]"
                  />
                  <span className="text-xs font-bold text-gray-900">
                    I want to trade in and purchase another car from your floor
                  </span>
                </label>

                {wantsToBuyFromUs && (
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Which car or category are you looking to upgrade to?
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 2023 Land Cruiser 300 GR Sport or Ford Ranger Raptor"
                      value={desiredNextCar}
                      onChange={e => setDesiredNextCar(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-[2px] px-3 py-2 text-xs text-gray-900"
                    />
                  </div>
                )}
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="font-heading text-xl font-bold uppercase text-[#C6A15B] mb-3 pb-2 border-b border-gray-200">
                  2. Your Contact Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name*</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Nyasha Makoni"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-[2px] px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#C6A15B]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">WhatsApp / Phone (+263)*</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 077 123 4567"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-[2px] px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#C6A15B]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Email (Optional)</label>
                    <input
                      type="email"
                      placeholder="name@example.co.zw"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-[2px] px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#C6A15B]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Preferred Reply Channel</label>
                    <div className="grid grid-cols-3 gap-1">
                      {(['WhatsApp', 'Call', 'Email'] as const).map(ch => (
                        <button
                          key={ch}
                          type="button"
                          onClick={() => setPreferredContact(ch)}
                          className={`py-2 text-xs font-medium rounded-[2px] border ${
                            preferredContact === ch
                              ? 'bg-[#C6A15B] border-[#C6A15B] text-gray-950 font-bold'
                              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {ch}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Additional Notes or Service Records
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Stamped dealer book up to 50,000km, brand new tyres fitted last month."
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-[2px] px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#C6A15B]"
                  />
                </div>
              </div>

              {/* Reassurance */}
              <div className="flex items-center gap-2 p-3 bg-slate-50 border border-gray-200 rounded text-xs text-gray-600">
                <ShieldCheck className="w-5 h-5 text-[#0E7A33] shrink-0" />
                <span>
                  We promise a prompt and direct response from the dealership, with full paperwork guidance and rapid settlement.
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-[2px] bg-[#C6A15B] text-gray-950 font-heading text-lg font-bold uppercase tracking-wider hover:bg-[#A8843F] hover:text-white transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Request Valuation & Trade-In Figure</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
