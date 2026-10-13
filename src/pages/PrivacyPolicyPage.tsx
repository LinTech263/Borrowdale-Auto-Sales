import React from 'react';
import { useDealership } from '../context/DealershipContext';
import { SeoHead } from '../components/ui/SeoHead';
import { ShieldCheck, Mail, Phone } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  const { settings } = useDealership();

  return (
    <div className="min-h-screen bg-white text-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <SeoHead
        title="Privacy Policy | Borrowdale Auto Sales"
        description="Data privacy policy for Borrowdale Auto Sales aligned with the Cyber and Data Protection Act of Zimbabwe."
        canonicalUrl="https://borrowdaleautosales.co.zw/privacy"
      />

      <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-lg shadow-sm p-8 sm:p-12 space-y-6 text-xs sm:text-sm text-gray-600 leading-relaxed">
        <div className="border-b border-gray-200 pb-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#C6A15B]">
            Data Governance & Protection
          </span>
          <h1 className="font-heading text-3xl sm:text-5xl font-black uppercase text-gray-900 mt-1">
            Privacy Policy
          </h1>
          <p className="text-xs text-gray-500 mt-1 font-mono">
            Aligned with the Cyber and Data Protection Act [Chapter 12:07] of Zimbabwe
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="font-heading text-xl font-bold uppercase text-gray-900">
            1. Information We Collect
          </h2>
          <p>
            When you interact with {settings.legalEntityName} via our website (e.g. submitting an offer, requesting a valuation, booking a test drive, or sending a callback enquiry), we collect:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>Contact details: Full Name, WhatsApp / Phone number, and email address.</li>
            <li>Vehicle transaction details: Proposed offer amount, trade-in specifications, and desired viewing dates.</li>
            <li>Local browser session preferences: Saved favorites and comparison selections stored locally on your device.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl font-bold uppercase text-gray-900">
            2. Purpose of Processing
          </h2>
          <p>
            Your information is processed strictly for:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>Responding to your specific vehicle inquiries, offer proposals, or valuation requests.</li>
            <li>Preparing lawful agreements of sale, pro-forma invoices, and ZIMRA customs handover documents.</li>
            <li>Direct communication with you via WhatsApp, telephone, or email regarding showroom inventory.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl font-bold uppercase text-gray-900">
            3. Data Retention & Right to Erasure
          </h2>
          <p>
            Client inquiry data is retained exclusively for ongoing showroom sales discussions and statutory tax record keeping. You may request deletion or inspection of your contact records at any time by contacting our Harare sales desk.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl font-bold uppercase text-gray-900">
            4. Security Standards
          </h2>
          <p>
            We implement administrative and technical controls to safeguard your personal information against unauthorized disclosure, loss, or unauthorized alterations.
          </p>
        </section>

        <div className="pt-6 border-t border-gray-200 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#C6A15B]" />
            <span>Cyber & Data Protection Act [12:07] Compliant</span>
          </div>
          <div className="flex items-center gap-4">
            <a href={`mailto:${settings.emailPlaceholder}`} className="hover:text-[#C6A15B] flex items-center gap-1">
              <Mail className="w-3.5 h-3.5" />
              <span>{settings.emailPlaceholder}</span>
            </a>
            <a href={`tel:${settings.phonePlaceholder.replace(/[^\d+]/g, '')}`} className="hover:text-[#C6A15B] flex items-center gap-1">
              <Phone className="w-3.5 h-3.5" />
              <span>{settings.phonePlaceholder}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
