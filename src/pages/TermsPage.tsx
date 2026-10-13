import React from 'react';
import { useDealership } from '../context/DealershipContext';
import { SeoHead } from '../components/ui/SeoHead';

export const TermsPage: React.FC = () => {
  const { settings } = useDealership();

  return (
    <div className="min-h-screen bg-white text-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <SeoHead
        title="Terms of Service & Vehicle Offers | Borrowdale Auto Sales"
        description="Terms and conditions governing vehicle offers, viewings, test drives, and valuations at Borrowdale Auto Sales Harare."
        canonicalUrl="https://borrowdaleautosales.co.zw/terms"
      />

      <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-lg shadow-sm p-8 sm:p-12 space-y-6 text-xs sm:text-sm text-gray-600 leading-relaxed">
        <div className="border-b border-gray-200 pb-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#C6A15B]">
            Commercial Terms & Disclaimers
          </span>
          <h1 className="font-heading text-3xl sm:text-5xl font-black uppercase text-gray-900 mt-1">
            Terms & Conditions
          </h1>
        </div>

        <section className="space-y-3">
          <h2 className="font-heading text-xl font-bold uppercase text-gray-900">
            1. Nature of Online Offers
          </h2>
          <p>
            Submission of an offer via our "Make an Offer" feature does not constitute a legally binding agreement of sale. All online offers represent expressions of buying interest intended to initiate price negotiation. A binding contract is created only upon mutual execution of a formal written Agreement of Sale and clearance of purchase funds.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl font-bold uppercase text-gray-900">
            2. Currency & Pricing
          </h2>
          <p>
            All listed vehicle prices are denominated in United States Dollars (USD) unless explicitly stated otherwise. Where illustrative secondary ZiG conversions are shown, they are computed based on indicative reference rates set by the dealership and are subject to real-time confirmation prior to invoice settlement.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl font-bold uppercase text-gray-900">
            3. Vehicle Availability & Condition
          </h2>
          <p>
            Vehicles are offered subject to prior sale. While {settings.legalEntityName} exercises every care to ensure accuracy of specifications, mileage, and features, buyers are encouraged to perform physical inspection and diagnostic tests during their appointed viewing in Borrowdale.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl font-bold uppercase text-gray-900">
            4. Trade-In Valuations
          </h2>
          <p>
            Online trade-in estimates are preliminary and subject to physical road test, undercarriage inspection, and verification of original Blue Book and ZIMRA customs documentation at our Harare showroom.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl font-bold uppercase text-gray-900">
            5. Governing Law
          </h2>
          <p>
            Transactions conducted with Borrowdale Auto Sales are governed by the Laws of Zimbabwe, subject to the jurisdiction of the High Court of Zimbabwe in Harare.
          </p>
        </section>
      </div>
    </div>
  );
};
