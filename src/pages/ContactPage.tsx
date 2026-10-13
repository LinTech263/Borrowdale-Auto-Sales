import React, { useState } from 'react';
import { useDealership } from '../context/DealershipContext';
import { SeoHead } from '../components/ui/SeoHead';
import { createLead } from '../services/dataService';
import { MapPin, Phone, Mail, Clock, MessageCircle, Send, CheckCircle2 } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { settings, addToast } = useDealership();

  // Active Tab: Enquiry vs Callback
  const [activeTab, setActiveTab] = useState<'enquiry' | 'callback'>('enquiry');

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [preferredTime, setPreferredTime] = useState('Morning (09:00 - 12:00)');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cleanPhone = settings.phonePlaceholder.replace(/[^\d+]/g, '') || '+263770000000';
  const cleanWhatsApp = settings.whatsappPlaceholder.replace(/[^\d]/g, '') || '263770000000';
  const whatsappUrl = `https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
    'Hi Borrowdale Auto Sales, I am reaching out from your website contact page.'
  )}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      addToast('Please enter your name and phone number', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      createLead({
        type: activeTab === 'callback' ? 'callback' : 'enquiry',
        status: 'New',
        customerName: name.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        preferredContact: 'WhatsApp',
        bestTimeToContact: activeTab === 'callback' ? preferredTime : undefined,
        message: message.trim() || (activeTab === 'callback' ? `Requested callback around ${preferredTime}` : 'General contact enquiry'),
        sourceUrl: '/contact'
      });

      setSubmitted(true);
      addToast(activeTab === 'callback' ? 'Callback request booked' : 'Enquiry sent successfully', 'success');
    } catch (err) {
      console.error(err);
      addToast('Error sending message. Please use WhatsApp.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <SeoHead
        title="Contact Borrowdale Auto Sales | Borrowdale, Harare, Zimbabwe"
        description="Visit our luxury car showroom in Borrowdale, Harare. Call, WhatsApp, or request an appointment to inspect premium vehicles in private."
        canonicalUrl="https://borrowdaleautosales.co.zw/contact"
      />

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#C6A15B]">
            Get In Touch
          </span>
          <h1 className="font-heading text-4xl sm:text-6xl font-black uppercase mt-1 mb-3 text-gray-900">
            Contact Our Borrowdale Desk
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 max-w-xl mx-auto">
            We are accessible, responsive, and always happy to discuss vehicles, valuations, or sourcing.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Contact Details & Map (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-gray-200 rounded-[4px] p-6 sm:p-8 space-y-5 shadow-sm">
              <h2 className="font-heading text-2xl font-bold uppercase text-gray-900">
                Showroom Information
              </h2>

              <ul className="space-y-4 text-xs sm:text-sm">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#C6A15B] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-gray-900">Physical Address</strong>
                    <span className="text-gray-600">{settings.addressPlaceholder}</span>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[#C6A15B] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-gray-900">Direct Line</strong>
                    <a href={`tel:${cleanPhone}`} className="text-gray-600 hover:text-[#C6A15B] font-mono">
                      {settings.phonePlaceholder}
                    </a>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <MessageCircle className="w-5 h-5 text-[#0E7A33] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-gray-900">WhatsApp Sales Desk</strong>
                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-[#0E7A33] font-mono">
                      {settings.whatsappPlaceholder} (Instant reply)
                    </a>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-[#C6A15B] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-gray-900">Email Desk</strong>
                    <a href={`mailto:${settings.emailPlaceholder}`} className="text-gray-600 hover:text-[#C6A15B]">
                      {settings.emailPlaceholder}
                    </a>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#C6A15B] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-gray-900">Operating Hours</strong>
                    <span className="text-gray-600 leading-relaxed">{settings.hoursPlaceholder}</span>
                  </div>
                </li>
              </ul>

              <div className="pt-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-[2px] bg-[#0E7A33] text-white font-heading text-base font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#0E7A33]/90 transition-colors shadow-sm"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Start WhatsApp Conversation</span>
                </a>
              </div>
            </div>

            {/* Embedded Location Map */}
            <div className="aspect-[16/10] rounded overflow-hidden border border-gray-200 bg-gray-100 shadow-sm">
              <iframe
                title="Dealership Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15194.887265267253!2d31.077222!3d-17.755416!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1931a4f009df344f%3A0x6b1f237efb8e235a!2sSam%20Levy&#39;s%20Village!5e0!3m2!1sen!2szw!4v1700000000000!5m2!1sen!2szw"
                className="w-full h-full border-0 contrast-105"
                loading="lazy"
              />
            </div>
          </div>

          {/* Contact Forms Tabs (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-gray-200 rounded-[4px] p-6 sm:p-8 shadow-sm">
              {/* Tabs */}
              <div className="flex border-b border-gray-200 mb-6">
                <button
                  type="button"
                  onClick={() => { setActiveTab('enquiry'); setSubmitted(false); }}
                  className={`pb-3 px-4 font-heading text-lg font-bold uppercase tracking-wider transition-colors border-b-2 ${
                    activeTab === 'enquiry'
                      ? 'border-[#C6A15B] text-gray-900 font-extrabold'
                      : 'border-transparent text-gray-500 hover:text-gray-900'
                  }`}
                >
                  General Enquiry
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveTab('callback'); setSubmitted(false); }}
                  className={`pb-3 px-4 font-heading text-lg font-bold uppercase tracking-wider transition-colors border-b-2 ${
                    activeTab === 'callback'
                      ? 'border-[#C6A15B] text-gray-900 font-extrabold'
                      : 'border-transparent text-gray-500 hover:text-gray-900'
                  }`}
                >
                  Request A Callback
                </button>
              </div>

              {submitted ? (
                <div className="p-8 bg-[#0E7A33]/10 border border-[#0E7A33] rounded text-center text-xs text-gray-900">
                  <CheckCircle2 className="w-12 h-12 text-[#0E7A33] mx-auto mb-3" />
                  <h3 className="font-heading text-2xl font-bold uppercase mb-1 text-gray-900">
                    {activeTab === 'callback' ? 'Callback Scheduled' : 'Message Transmitted'}
                  </h3>
                  <p className="text-gray-600 text-sm max-w-md mx-auto mb-6 leading-relaxed">
                    Thank you, {name}. A member of our Borrowdale sales desk will contact you via WhatsApp shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-2 bg-[#C6A15B] text-gray-950 text-xs font-bold uppercase rounded-[2px] hover:bg-[#A8843F] hover:text-white"
                  >
                    Send Another Note
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Your Full Name*</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Simba Zhou"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-[2px] px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#C6A15B]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  </div>

                  {activeTab === 'callback' && (
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Preferred Callback Time
                      </label>
                      <select
                        value={preferredTime}
                        onChange={e => setPreferredTime(e.target.value)}
                        className="w-full bg-white border border-gray-300 rounded-[2px] px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#C6A15B]"
                      >
                        <option value="Morning (08:30 - 11:30)">Morning (08:30 - 11:30)</option>
                        <option value="Midday (11:30 - 14:00)">Midday (11:30 - 14:00)</option>
                        <option value="Afternoon (14:00 - 17:00)">Afternoon (14:00 - 17:00)</option>
                        <option value="Saturday Morning">Saturday Morning</option>
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      {activeTab === 'callback' ? 'Reason for Call / Vehicle of Interest' : 'Your Message / Inquiry'}
                    </label>
                    <textarea
                      rows={4}
                      placeholder={activeTab === 'callback' ? 'e.g. Wanting to ask about the 2023 LC300 and trade-in terms.' : 'How can our Borrowdale team assist you?'}
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-[2px] px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#C6A15B]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-[2px] bg-[#C6A15B] text-gray-950 font-heading text-lg font-bold uppercase tracking-wider hover:bg-[#A8843F] hover:text-white transition-colors flex items-center justify-center gap-2 shadow-xs"
                  >
                    <Send className="w-4 h-4" />
                    <span>{activeTab === 'callback' ? 'Schedule Showroom Callback' : 'Send Message To Dealership'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
