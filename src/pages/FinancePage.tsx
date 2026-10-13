import React, { useState } from 'react';
import { useDealership } from '../context/DealershipContext';
import { SeoHead } from '../components/ui/SeoHead';
import { createLead } from '../services/dataService';
import { Calculator, CheckCircle2, ArrowRight } from 'lucide-react';

export const FinancePage: React.FC = () => {
  const { addToast } = useDealership();

  // Calculator State
  const [vehiclePrice, setVehiclePrice] = useState(65000);
  const [depositPercent, setDepositPercent] = useState(25);
  const [termMonths, setTermMonths] = useState(36);
  const [interestRate] = useState(12);

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [bank, setBank] = useState('');
  const [targetCar, setTargetCar] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Calculations
  const depositAmount = (vehiclePrice * depositPercent) / 100;
  const loanPrincipal = Math.max(0, vehiclePrice - depositAmount);
  const monthlyRate = interestRate / 100 / 12;
  const monthlyPayment = monthlyRate > 0
    ? (loanPrincipal * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
      (Math.pow(1 + monthlyRate, termMonths) - 1)
    : loanPrincipal / termMonths;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      addToast('Please complete name and phone number', 'error');
      return;
    }

    createLead({
      type: 'finance',
      status: 'New',
      customerName: name.trim(),
      phone: phone.trim(),
      preferredContact: 'WhatsApp',
      message: `Finance Enquiry: Target Car: ${targetCar || 'General'}. Preferred Bank/Facility: ${bank || 'Advice required'}. Budget: US$${vehiclePrice.toLocaleString('en-US')}. ${message}`,
      sourceUrl: '/finance'
    });

    setSubmitted(true);
    addToast('Finance enquiry transmitted to dealership desk', 'success');
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <SeoHead
        title="Vehicle Finance Guidance & Calculator | Borrowdale Auto Sales"
        description="Calculate estimated monthly car loan repayments in Harare. Learn about vehicle asset financing and corporate bank facilities in Zimbabwe."
        canonicalUrl="https://borrowdaleautosales.co.zw/finance"
      />

      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#C6A15B]">
            Structured Financing
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-black uppercase mt-1 mb-3 text-gray-900">
            Vehicle Finance & Facilities
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 max-w-xl mx-auto">
            We work with leading Zimbabwean commercial banks and corporate credit facilities to support vehicle acquisitions.
          </p>
        </div>

        {/* 3 Step Process */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          {[
            {
              step: '01',
              title: 'Select Your Vehicle',
              desc: 'Choose your desired vehicle from our Borrowdale inventory and obtain an official pro-forma invoice and vehicle spec sheet.'
            },
            {
              step: '02',
              title: 'Bank Application',
              desc: 'Submit our pro-forma invoice together with your corporate or individual financial statements to your banking facility.'
            },
            {
              step: '03',
              title: 'Clearance & Handover',
              desc: 'Upon facility disbursement or letter of undertaking, we finalize ZIMRA documentation and hand over the keys.'
            }
          ].map(s => (
            <div key={s.step} className="bg-slate-50 border border-gray-200 rounded-[3px] p-6 relative shadow-xs">
              <span className="font-mono text-xs font-bold text-[#C6A15B]">{s.step}</span>
              <h3 className="font-heading text-2xl font-bold uppercase mt-2 mb-2 text-gray-900">
                {s.title}
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                {s.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Calculator and Enquiry Split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Interactive Calculator */}
          <div className="bg-white border border-gray-200 rounded-[4px] p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex items-center gap-2 text-[#C6A15B]">
              <Calculator className="w-5 h-5" />
              <h3 className="font-heading text-xl font-bold uppercase text-gray-900">
                Payment Estimator
              </h3>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-700 mb-1 font-semibold uppercase">
                  Vehicle Price: US${vehiclePrice.toLocaleString('en-US')}
                </label>
                <input
                  type="range"
                  min={15000}
                  max={200000}
                  step={5000}
                  value={vehiclePrice}
                  onChange={e => setVehiclePrice(Number(e.target.value))}
                  className="w-full accent-[#C6A15B]"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1 font-semibold uppercase">
                  Deposit: {depositPercent}% (US${Math.round(depositAmount).toLocaleString('en-US')})
                </label>
                <input
                  type="range"
                  min={10}
                  max={60}
                  step={5}
                  value={depositPercent}
                  onChange={e => setDepositPercent(Number(e.target.value))}
                  className="w-full accent-[#C6A15B]"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1 font-semibold uppercase">
                  Term: {termMonths} Months
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[12, 24, 36, 48].map(m => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setTermMonths(m)}
                      className={`py-2 text-xs font-mono font-bold rounded-[2px] border ${
                        termMonths === m ? 'bg-[#C6A15B] text-gray-950 border-[#C6A15B]' : 'bg-slate-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {m} Mo
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-5 bg-slate-50 border border-gray-200 rounded-[2px] text-center mt-4">
                <span className="text-[11px] font-bold uppercase text-gray-500 block">
                  Estimated Monthly Installment
                </span>
                <strong className="font-heading text-4xl font-black text-[#C6A15B] mt-1 block">
                  US${Math.round(monthlyPayment).toLocaleString('en-US')} / mo
                </strong>
                <span className="text-[10px] text-gray-500 block mt-1">
                  *Illustrative computation based on {interestRate}% indicative interest. Terms subject to formal bank credit committee approval.
                </span>
              </div>
            </div>
          </div>

          {/* Finance Consultation Form */}
          <div className="bg-white border border-gray-200 rounded-[4px] p-6 sm:p-8 shadow-sm">
            <h3 className="font-heading text-2xl font-bold uppercase text-gray-900 mb-1">
              Request A Pro-Forma Invoice
            </h3>
            <p className="text-xs text-gray-600 mb-6">
              Need paperwork to initiate your bank loan or corporate asset lease? Tell us your target car.
            </p>

            {submitted ? (
              <div className="p-6 bg-[#0E7A33]/10 border border-[#0E7A33] rounded text-center text-xs text-gray-900">
                <CheckCircle2 className="w-10 h-10 text-[#0E7A33] mx-auto mb-2" />
                <h4 className="font-heading text-xl font-bold uppercase text-gray-900">Enquiry Transmitted</h4>
                <p className="text-gray-600 mt-1 mb-4">
                  Our sales coordinator will prepare the vehicle documentation and reach out via WhatsApp.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-5 py-2 bg-[#C6A15B] text-gray-950 font-bold text-xs uppercase rounded-[2px]"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Your Full Name*</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tendai"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-[2px] px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#C6A15B]"
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
                    className="w-full bg-white border border-gray-300 rounded-[2px] px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#C6A15B]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Car You Want</label>
                    <input
                      type="text"
                      placeholder="e.g. Land Cruiser 300 or Fortuner"
                      value={targetCar}
                      onChange={e => setTargetCar(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-[2px] px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#C6A15B]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Your Preferred Bank</label>
                    <input
                      type="text"
                      placeholder="e.g. Stanbic, CBZ, CABS, BancABC"
                      value={bank}
                      onChange={e => setBank(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-[2px] px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#C6A15B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Additional Requirements</label>
                  <textarea
                    rows={2}
                    placeholder="Company purchase, lease facility, etc."
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-[2px] px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#C6A15B]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-[2px] bg-[#C6A15B] text-gray-950 font-heading text-base font-bold uppercase tracking-wider hover:bg-[#A8843F] hover:text-white transition-colors flex items-center justify-center gap-2 shadow-xs"
                >
                  <span>Request Pro-Forma Invoice</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
