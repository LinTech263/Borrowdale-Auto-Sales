import React, { useState } from 'react';
import { useDealership } from '../../context/DealershipContext';
import { SiteContent } from '../../types';
import { Save, Plus, Trash2, Edit3, Sparkles } from 'lucide-react';

export const AdminContentPage: React.FC = () => {
  const { content, updateContent, addToast } = useDealership();

  const [formContent, setFormContent] = useState<SiteContent>(content);
  const [activeTab, setActiveTab] = useState<'hero' | 'faqs' | 'trust' | 'testimonials' | 'landingPages'>('hero');

  // FAQ Modal
  const [newFaqQ, setNewFaqQ] = useState('');
  const [newFaqA, setNewFaqA] = useState('');

  // Testimonial Modal
  const [newTestName, setNewTestName] = useState('');
  const [newTestVehicle, setNewTestVehicle] = useState('');
  const [newTestComment, setNewTestComment] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateContent(formContent);
  };

  const handleAddFaq = () => {
    if (!newFaqQ || !newFaqA) return;
    const updatedFaqs = [
      ...formContent.faqs,
      {
        id: `faq-${Date.now()}`,
        question: newFaqQ.trim(),
        answer: newFaqA.trim(),
        confirmWithOwnerPolicy: false
      }
    ];
    setFormContent(prev => ({ ...prev, faqs: updatedFaqs }));
    setNewFaqQ('');
    setNewFaqA('');
    addToast('FAQ added', 'info');
  };

  const handleDeleteFaq = (id: string) => {
    setFormContent(prev => ({
      ...prev,
      faqs: prev.faqs.filter(f => f.id !== id)
    }));
  };

  const handleAddTestimonial = () => {
    if (!newTestName || !newTestComment) return;
    const updated = [
      ...formContent.testimonials,
      {
        id: `test-${Date.now()}`,
        clientName: newTestName.trim(),
        vehiclePurchased: newTestVehicle.trim() || 'Verified Purchase',
        comment: newTestComment.trim(),
        date: new Date().toISOString().split('T')[0],
        consentGiven: true
      }
    ];
    setFormContent(prev => ({ ...prev, testimonials: updated }));
    setNewTestName('');
    setNewTestVehicle('');
    setNewTestComment('');
    addToast('Client review added with consent', 'info');
  };

  const handleDeleteTestimonial = (id: string) => {
    setFormContent(prev => ({
      ...prev,
      testimonials: prev.testimonials.filter(t => t.id !== id)
    }));
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#23272C]">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-[#C6A15B]">
            Public Narrative & Messaging
          </span>
          <h1 className="font-heading text-3xl font-black uppercase text-[#F5F2EB]">
            Content Manager
          </h1>
        </div>

        <button
          onClick={handleSave}
          className="px-6 py-2.5 bg-[#C6A15B] text-[#0A0A0B] font-heading text-sm font-bold uppercase tracking-wider rounded-[2px] hover:bg-[#A8843F] flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>Save All Changes</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#23272C] gap-2 overflow-x-auto text-xs">
        {[
          { id: 'hero', label: 'Hero Copy & A/B' },
          { id: 'trust', label: 'Trust Bar Proof Points' },
          { id: 'faqs', label: 'FAQs & Policies' },
          { id: 'testimonials', label: 'Client Reviews' },
          { id: 'landingPages', label: 'Local Landing Pages Copy' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`py-2 px-4 rounded-[2px] uppercase font-bold tracking-wider transition-colors border-b-2 ${
              activeTab === tab.id
                ? 'border-[#C6A15B] text-[#F5F2EB] bg-[#16181B]'
                : 'border-transparent text-[#9AA0A8] hover:text-[#F5F2EB]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Hero Tab */}
      {activeTab === 'hero' && (
        <div className="card-luxury p-6 sm:p-8 space-y-5">
          <h2 className="font-heading text-xl font-bold uppercase text-[#F5F2EB] pb-2 border-b border-[#23272C]">
            Hero Copy & A/B Testing
          </h2>

          <div className="p-4 bg-[#0A0A0B] border border-[#23272C] rounded space-y-3">
            <span className="text-xs font-semibold uppercase text-[#C6A15B] block">
              Active H1 Headline Option
            </span>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="heroH1Option"
                  checked={formContent.heroHeadingOption === 'A'}
                  onChange={() => setFormContent(prev => ({ ...prev, heroHeadingOption: 'A' }))}
                  className="accent-[#C6A15B]"
                />
                <span className="text-xs text-[#F5F2EB]">Option A: Serious Cars for Serious Drivers.</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="heroH1Option"
                  checked={formContent.heroHeadingOption === 'B'}
                  onChange={() => setFormContent(prev => ({ ...prev, heroHeadingOption: 'B' }))}
                  className="accent-[#C6A15B]"
                />
                <span className="text-xs text-[#F5F2EB]">Option B: Borrowdale's Address for Premium Cars.</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[#9AA0A8] font-semibold mb-1">Headline Option A</label>
              <input
                type="text"
                value={formContent.heroH1_A}
                onChange={e => setFormContent(prev => ({ ...prev, heroH1_A: e.target.value }))}
                className="w-full bg-[#0A0A0B] border border-[#23272C] rounded-[2px] px-3 py-2 text-sm text-[#F5F2EB]"
              />
            </div>
            <div>
              <label className="block text-[#9AA0A8] font-semibold mb-1">Headline Option B</label>
              <input
                type="text"
                value={formContent.heroH1_B}
                onChange={e => setFormContent(prev => ({ ...prev, heroH1_B: e.target.value }))}
                className="w-full bg-[#0A0A0B] border border-[#23272C] rounded-[2px] px-3 py-2 text-sm text-[#F5F2EB]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[#9AA0A8] font-semibold mb-1">Accent Tagline (Italic Serif)</label>
              <input
                type="text"
                value={formContent.heroTagline}
                onChange={e => setFormContent(prev => ({ ...prev, heroTagline: e.target.value }))}
                className="w-full bg-[#0A0A0B] border border-[#23272C] rounded-[2px] px-3 py-2 text-sm text-[#F5F2EB]"
              />
            </div>
            <div>
              <label className="block text-[#9AA0A8] font-semibold mb-1">Sub-Headline Copy</label>
              <textarea
                rows={2}
                value={formContent.heroSub}
                onChange={e => setFormContent(prev => ({ ...prev, heroSub: e.target.value }))}
                className="w-full bg-[#0A0A0B] border border-[#23272C] rounded-[2px] p-2 text-xs text-[#F5F2EB]"
              />
            </div>
          </div>
        </div>
      )}

      {/* Trust Bar Tab */}
      {activeTab === 'trust' && (
        <div className="card-luxury p-6 sm:p-8 space-y-4">
          <h2 className="font-heading text-xl font-bold uppercase text-[#F5F2EB] pb-2 border-b border-[#23272C]">
            Trust Bar Proof Points (4 Items)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {formContent.trustBar.map((item, idx) => (
              <div key={idx} className="p-4 bg-[#0A0A0B] border border-[#23272C] rounded space-y-2">
                <label className="block font-semibold text-[#C6A15B]">Proof Point #{idx + 1}</label>
                <input
                  type="text"
                  value={item.title}
                  onChange={e => {
                    const next = [...formContent.trustBar];
                    next[idx].title = e.target.value;
                    setFormContent(prev => ({ ...prev, trustBar: next }));
                  }}
                  className="w-full bg-[#16181B] border border-[#23272C] rounded px-2.5 py-1.5 text-xs text-[#F5F2EB]"
                />
                <input
                  type="text"
                  value={item.subtitle}
                  onChange={e => {
                    const next = [...formContent.trustBar];
                    next[idx].subtitle = e.target.value;
                    setFormContent(prev => ({ ...prev, trustBar: next }));
                  }}
                  className="w-full bg-[#16181B] border border-[#23272C] rounded px-2.5 py-1.5 text-xs text-[#9AA0A8]"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FAQs Tab */}
      {activeTab === 'faqs' && (
        <div className="card-luxury p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-[#23272C]">
            <h2 className="font-heading text-xl font-bold uppercase text-[#F5F2EB]">
              Frequently Asked Questions ({formContent.faqs.length})
            </h2>
          </div>

          <div className="space-y-3">
            {formContent.faqs.map((faq, index) => (
              <div key={faq.id} className="p-4 bg-[#0A0A0B] border border-[#23272C] rounded space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#C6A15B] uppercase font-mono">Q{index + 1}</span>
                  <button
                    type="button"
                    onClick={() => handleDeleteFaq(faq.id)}
                    className="text-[#B3261E] hover:underline"
                  >
                    Delete
                  </button>
                </div>
                <input
                  type="text"
                  value={faq.question}
                  onChange={e => {
                    const next = [...formContent.faqs];
                    next[index].question = e.target.value;
                    setFormContent(prev => ({ ...prev, faqs: next }));
                  }}
                  className="w-full bg-[#16181B] border border-[#23272C] rounded px-2.5 py-1.5 font-bold text-[#F5F2EB]"
                />
                <textarea
                  rows={2}
                  value={faq.answer}
                  onChange={e => {
                    const next = [...formContent.faqs];
                    next[index].answer = e.target.value;
                    setFormContent(prev => ({ ...prev, faqs: next }));
                  }}
                  className="w-full bg-[#16181B] border border-[#23272C] rounded p-2 text-xs text-[#9AA0A8]"
                />
              </div>
            ))}
          </div>

          {/* Add FAQ form */}
          <div className="p-4 bg-[#121417] border border-[#23272C] rounded space-y-2 text-xs">
            <span className="font-bold uppercase text-[#C6A15B] block">+ Add New Question</span>
            <input
              type="text"
              placeholder="Question..."
              value={newFaqQ}
              onChange={e => setNewFaqQ(e.target.value)}
              className="w-full bg-[#0A0A0B] border border-[#23272C] rounded px-3 py-1.5 text-xs text-[#F5F2EB]"
            />
            <textarea
              rows={2}
              placeholder="Plain-spoken answer..."
              value={newFaqA}
              onChange={e => setNewFaqA(e.target.value)}
              className="w-full bg-[#0A0A0B] border border-[#23272C] rounded p-2 text-xs text-[#F5F2EB]"
            />
            <button
              type="button"
              onClick={handleAddFaq}
              className="px-4 py-1.5 bg-[#C6A15B] text-[#0A0A0B] font-bold rounded text-xs"
            >
              Add Question
            </button>
          </div>
        </div>
      )}

      {/* Testimonials Tab */}
      {activeTab === 'testimonials' && (
        <div className="card-luxury p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-[#23272C]">
            <div>
              <h2 className="font-heading text-xl font-bold uppercase text-[#F5F2EB]">
                Client Reviews (Admin Managed)
              </h2>
              <p className="text-xs text-[#9AA0A8]">
                Note: Per non-negotiable rules, never auto-generate reviews. Only add genuine reviews with client consent.
              </p>
            </div>
          </div>

          {formContent.testimonials.length === 0 ? (
            <div className="p-6 bg-[#0A0A0B] border border-[#23272C] rounded text-center text-xs text-[#9AA0A8]">
              No reviews published. The testimonial section is currently hidden from the public website to maintain authenticity.
            </div>
          ) : (
            <div className="space-y-3">
              {formContent.testimonials.map(t => (
                <div key={t.id} className="p-4 bg-[#0A0A0B] border border-[#23272C] rounded flex justify-between items-start gap-3 text-xs">
                  <div>
                    <strong className="text-[#F5F2EB] block">{t.clientName} ({t.vehiclePurchased})</strong>
                    <p className="text-[#9AA0A8] italic mt-1">"{t.comment}"</p>
                  </div>
                  <button
                    onClick={() => handleDeleteTestimonial(t.id)}
                    className="text-[#B3261E] hover:underline shrink-0"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add Review */}
          <div className="p-4 bg-[#121417] border border-[#23272C] rounded space-y-3 text-xs">
            <span className="font-bold uppercase text-[#C6A15B] block">+ Add Real Client Review</span>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Client Name (e.g. T. Mutasa)"
                value={newTestName}
                onChange={e => setNewTestName(e.target.value)}
                className="bg-[#0A0A0B] border border-[#23272C] rounded px-3 py-1.5 text-xs text-[#F5F2EB]"
              />
              <input
                type="text"
                placeholder="Vehicle (e.g. 2022 Hilux Legend RS)"
                value={newTestVehicle}
                onChange={e => setNewTestVehicle(e.target.value)}
                className="bg-[#0A0A0B] border border-[#23272C] rounded px-3 py-1.5 text-xs text-[#F5F2EB]"
              />
            </div>
            <textarea
              rows={2}
              placeholder="Client words..."
              value={newTestComment}
              onChange={e => setNewTestComment(e.target.value)}
              className="w-full bg-[#0A0A0B] border border-[#23272C] rounded p-2 text-xs text-[#F5F2EB]"
            />
            <button
              type="button"
              onClick={handleAddTestimonial}
              className="px-4 py-1.5 bg-[#C6A15B] text-[#0A0A0B] font-bold rounded text-xs"
            >
              Add Review
            </button>
          </div>
        </div>
      )}

      {/* Local Landing Pages Copy Tab */}
      {activeTab === 'landingPages' && (
        <div className="card-luxury p-6 sm:p-8 space-y-6">
          <h2 className="font-heading text-xl font-bold uppercase text-[#F5F2EB] pb-2 border-b border-[#23272C]">
            Curated Local Landing Pages SEO Copy
          </h2>

          <div className="space-y-6">
            {Object.entries(formContent.landingPagesCopy).map(([key, item]) => (
              <div key={key} className="p-4 bg-[#0A0A0B] border border-[#23272C] rounded space-y-2 text-xs">
                <span className="font-mono text-[#C6A15B] font-bold block uppercase">
                  /{key}
                </span>
                <input
                  type="text"
                  value={item.title}
                  onChange={e => {
                    const next = { ...formContent.landingPagesCopy };
                    next[key].title = e.target.value;
                    setFormContent(prev => ({ ...prev, landingPagesCopy: next }));
                  }}
                  className="w-full bg-[#16181B] border border-[#23272C] rounded px-3 py-1.5 text-xs font-bold text-[#F5F2EB]"
                  placeholder="Meta Title"
                />
                <input
                  type="text"
                  value={item.h1}
                  onChange={e => {
                    const next = { ...formContent.landingPagesCopy };
                    next[key].h1 = e.target.value;
                    setFormContent(prev => ({ ...prev, landingPagesCopy: next }));
                  }}
                  className="w-full bg-[#16181B] border border-[#23272C] rounded px-3 py-1.5 text-xs text-[#F5F2EB]"
                  placeholder="H1 Headline"
                />
                <textarea
                  rows={2}
                  value={item.metaDesc}
                  onChange={e => {
                    const next = { ...formContent.landingPagesCopy };
                    next[key].metaDesc = e.target.value;
                    setFormContent(prev => ({ ...prev, landingPagesCopy: next }));
                  }}
                  className="w-full bg-[#16181B] border border-[#23272C] rounded p-2 text-xs text-[#9AA0A8]"
                  placeholder="Meta Description"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
