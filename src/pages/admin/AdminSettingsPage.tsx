import React, { useState } from 'react';
import { useDealership } from '../../context/DealershipContext';
import { SiteSettings } from '../../types';
import { Save, Shield, DollarSign, Palette, Phone, MapPin, Globe, Sparkles } from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const { settings, updateSettings, addToast, adminUser } = useDealership();
  const [formSettings, setFormSettings] = useState<SiteSettings>(settings);

  // Only Owner can access settings per spec
  if (adminUser?.role !== 'owner') {
    return (
      <div className="card-luxury p-8 text-center text-xs text-[#9AA0A8]">
        <Shield className="w-10 h-10 text-[#C6A15B] mx-auto mb-2" />
        <h2 className="font-heading text-xl font-bold uppercase text-[#F5F2EB]">Owner Restricted Area</h2>
        <p className="mt-1">Only the Dealership Principal has authorization to configure site branding, rates, and integrations.</p>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formSettings);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#23272C]">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-[#C6A15B]">
            System Configuration & Branding
          </span>
          <h1 className="font-heading text-3xl font-black uppercase text-[#F5F2EB]">
            Dealership Settings
          </h1>
        </div>

        <button
          onClick={handleSubmit}
          className="px-6 py-2.5 bg-[#C6A15B] text-[#0A0A0B] font-heading text-sm font-bold uppercase tracking-wider rounded-[2px] hover:bg-[#A8843F] flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>Save Settings</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 text-xs sm:text-sm">
        {/* ==================== 1. CONTACT PLACEHOLDERS (Non-invented facts) ==================== */}
        <div className="card-luxury p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#23272C] text-[#C6A15B]">
            <Phone className="w-5 h-5" />
            <h2 className="font-heading text-xl font-bold uppercase">
              Showroom Contact & Hours (Editable Facts)
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#9AA0A8] mb-1">
                Dealership Name
              </label>
              <input
                type="text"
                required
                value={formSettings.dealershipName}
                onChange={e => setFormSettings(prev => ({ ...prev, dealershipName: e.target.value }))}
                className="w-full bg-[#0A0A0B] border border-[#23272C] rounded-[2px] px-3 py-2 text-sm text-[#F5F2EB]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#9AA0A8] mb-1">
                Legal Entity Name (Zimbabwe Registered)
              </label>
              <input
                type="text"
                required
                value={formSettings.legalEntityName}
                onChange={e => setFormSettings(prev => ({ ...prev, legalEntityName: e.target.value }))}
                className="w-full bg-[#0A0A0B] border border-[#23272C] rounded-[2px] px-3 py-2 text-sm text-[#F5F2EB]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#9AA0A8] mb-1">
                [PHONE] Primary Showroom Call
              </label>
              <input
                type="text"
                required
                value={formSettings.phonePlaceholder}
                onChange={e => setFormSettings(prev => ({ ...prev, phonePlaceholder: e.target.value }))}
                className="w-full bg-[#0A0A0B] border border-[#23272C] rounded-[2px] px-3 py-2 text-xs font-mono text-[#F5F2EB]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#9AA0A8] mb-1">
                [WHATSAPP] Primary WhatsApp Desk
              </label>
              <input
                type="text"
                required
                value={formSettings.whatsappPlaceholder}
                onChange={e => setFormSettings(prev => ({ ...prev, whatsappPlaceholder: e.target.value }))}
                className="w-full bg-[#0A0A0B] border border-[#23272C] rounded-[2px] px-3 py-2 text-xs font-mono text-[#F5F2EB]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#9AA0A8] mb-1">
                [EMAIL] Official Enquiries Email
              </label>
              <input
                type="email"
                required
                value={formSettings.emailPlaceholder}
                onChange={e => setFormSettings(prev => ({ ...prev, emailPlaceholder: e.target.value }))}
                className="w-full bg-[#0A0A0B] border border-[#23272C] rounded-[2px] px-3 py-2 text-xs text-[#F5F2EB]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#9AA0A8] mb-1">
                [ADDRESS] Physical Showroom Address
              </label>
              <input
                type="text"
                required
                value={formSettings.addressPlaceholder}
                onChange={e => setFormSettings(prev => ({ ...prev, addressPlaceholder: e.target.value }))}
                className="w-full bg-[#0A0A0B] border border-[#23272C] rounded-[2px] px-3 py-2 text-xs text-[#F5F2EB]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#9AA0A8] mb-1">
                [HOURS] Operating Hours
              </label>
              <input
                type="text"
                required
                value={formSettings.hoursPlaceholder}
                onChange={e => setFormSettings(prev => ({ ...prev, hoursPlaceholder: e.target.value }))}
                className="w-full bg-[#0A0A0B] border border-[#23272C] rounded-[2px] px-3 py-2 text-xs text-[#F5F2EB]"
              />
            </div>
          </div>
        </div>

        {/* ==================== 2. CURRENCY & EXCHANGE RATE ==================== */}
        <div className="card-luxury p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#23272C] text-[#C6A15B]">
            <DollarSign className="w-5 h-5" />
            <h2 className="font-heading text-xl font-bold uppercase">
              Currency & ZiG Secondary Display
            </h2>
          </div>

          <p className="text-xs text-[#9AA0A8]">
            Prices are shown in USD by default (format: US$45,000). You can enable an optional secondary ZiG display driven by an exchange rate you configure here.
          </p>

          <div className="p-4 bg-[#0A0A0B] border border-[#23272C] rounded space-y-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formSettings.currency.secondaryEnabled}
                onChange={e =>
                  setFormSettings(prev => ({
                    ...prev,
                    currency: { ...prev.currency, secondaryEnabled: e.target.checked }
                  }))
                }
                className="accent-[#C6A15B]"
              />
              <span className="text-xs font-bold text-[#F5F2EB]">
                Enable Secondary ZiG Price Display on Public Site (Off by default)
              </span>
            </label>

            {formSettings.currency.secondaryEnabled && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#23272C]">
                <div>
                  <label className="block text-xs font-semibold text-[#9AA0A8] mb-1">
                    USD to ZiG Exchange Rate (1 USD = X ZiG)
                  </label>
                  <input
                    type="number"
                    step={0.1}
                    min={1}
                    value={formSettings.currency.usdToZigRate}
                    onChange={e =>
                      setFormSettings(prev => ({
                        ...prev,
                        currency: { ...prev.currency, usdToZigRate: Number(e.target.value) }
                      }))
                    }
                    className="w-full bg-[#16181B] border border-[#23272C] rounded px-3 py-2 text-sm font-mono font-bold text-[#F5F2EB]"
                  />
                </div>
                <div className="p-3 bg-[#16181B] border border-[#23272C] rounded flex items-center text-xs text-[#9AA0A8]">
                  <span>Example preview: US$50,000 becomes approx. <strong className="text-[#C6A15B]">ZiG {(50000 * formSettings.currency.usdToZigRate).toLocaleString('en-US')}</strong></span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ==================== 3. BRANDING & LOGO PALETTE ==================== */}
        <div className="card-luxury p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#23272C] text-[#C6A15B]">
            <Palette className="w-5 h-5" />
            <h2 className="font-heading text-xl font-bold uppercase">
              Brand Colours & Identity
            </h2>
          </div>

          <p className="text-xs text-[#9AA0A8]">
            Colors matching the uploaded Borrowdale Auto Sales identity: Zimbabwe racing green, flame orange, and luxury obsidian/brass tokens.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block text-[#9AA0A8] mb-1">Brand Green (Swoosh)</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formSettings.brandColors.brandGreen}
                  onChange={e =>
                    setFormSettings(prev => ({
                      ...prev,
                      brandColors: { ...prev.brandColors, brandGreen: e.target.value }
                    }))
                  }
                  className="w-8 h-8 rounded border border-[#23272C] bg-transparent cursor-pointer"
                />
                <span className="font-mono text-[#F5F2EB]">{formSettings.brandColors.brandGreen}</span>
              </div>
            </div>

            <div>
              <label className="block text-[#9AA0A8] mb-1">Brand Orange (Swoosh)</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formSettings.brandColors.brandOrange}
                  onChange={e =>
                    setFormSettings(prev => ({
                      ...prev,
                      brandColors: { ...prev.brandColors, brandOrange: e.target.value }
                    }))
                  }
                  className="w-8 h-8 rounded border border-[#23272C] bg-transparent cursor-pointer"
                />
                <span className="font-mono text-[#F5F2EB]">{formSettings.brandColors.brandOrange}</span>
              </div>
            </div>

            <div>
              <label className="block text-[#9AA0A8] mb-1">Brass Accent</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formSettings.brandColors.brass}
                  onChange={e =>
                    setFormSettings(prev => ({
                      ...prev,
                      brandColors: { ...prev.brandColors, brass: e.target.value }
                    }))
                  }
                  className="w-8 h-8 rounded border border-[#23272C] bg-transparent cursor-pointer"
                />
                <span className="font-mono text-[#F5F2EB]">{formSettings.brandColors.brass}</span>
              </div>
            </div>

            <div>
              <label className="block text-[#9AA0A8] mb-1">Obsidian Background</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formSettings.brandColors.obsidian}
                  onChange={e =>
                    setFormSettings(prev => ({
                      ...prev,
                      brandColors: { ...prev.brandColors, obsidian: e.target.value }
                    }))
                  }
                  className="w-8 h-8 rounded border border-[#23272C] bg-transparent cursor-pointer"
                />
                <span className="font-mono text-[#F5F2EB]">{formSettings.brandColors.obsidian}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ==================== 4. INTEGRATIONS & ANALYTICS ==================== */}
        <div className="card-luxury p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#23272C] text-[#C6A15B]">
            <Globe className="w-5 h-5" />
            <h2 className="font-heading text-xl font-bold uppercase">
              Social Links & Analytics Tags
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#9AA0A8] mb-1">Facebook Page URL</label>
              <input
                type="url"
                value={formSettings.facebookUrl}
                onChange={e => setFormSettings(prev => ({ ...prev, facebookUrl: e.target.value }))}
                className="w-full bg-[#0A0A0B] border border-[#23272C] rounded-[2px] px-3 py-2 text-xs text-[#F5F2EB]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#9AA0A8] mb-1">Instagram URL</label>
              <input
                type="url"
                value={formSettings.instagramUrl}
                onChange={e => setFormSettings(prev => ({ ...prev, instagramUrl: e.target.value }))}
                className="w-full bg-[#0A0A0B] border border-[#23272C] rounded-[2px] px-3 py-2 text-xs text-[#F5F2EB]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-[#9AA0A8] mb-1">Google Analytics 4 Measurement ID</label>
              <input
                type="text"
                placeholder="G-XXXXXXXXXX"
                value={formSettings.analytics.ga4Id}
                onChange={e =>
                  setFormSettings(prev => ({
                    ...prev,
                    analytics: { ...prev.analytics, ga4Id: e.target.value }
                  }))
                }
                className="w-full bg-[#0A0A0B] border border-[#23272C] rounded-[2px] px-3 py-2 text-xs font-mono text-[#F5F2EB]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#9AA0A8] mb-1">Meta Pixel ID</label>
              <input
                type="text"
                placeholder="Pixel ID"
                value={formSettings.analytics.metaPixelId}
                onChange={e =>
                  setFormSettings(prev => ({
                    ...prev,
                    analytics: { ...prev.analytics, metaPixelId: e.target.value }
                  }))
                }
                className="w-full bg-[#0A0A0B] border border-[#23272C] rounded-[2px] px-3 py-2 text-xs font-mono text-[#F5F2EB]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#9AA0A8] mb-1">Notification Email(s)</label>
              <input
                type="email"
                value={formSettings.notificationEmails}
                onChange={e => setFormSettings(prev => ({ ...prev, notificationEmails: e.target.value }))}
                className="w-full bg-[#0A0A0B] border border-[#23272C] rounded-[2px] px-3 py-2 text-xs text-[#F5F2EB]"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-[#23272C]">
          <button
            type="submit"
            className="px-8 py-3 bg-[#C6A15B] text-[#0A0A0B] font-heading text-base font-bold uppercase tracking-wider rounded-[2px] hover:bg-[#A8843F]"
          >
            Save Dealership Settings
          </button>
        </div>
      </form>
    </div>
  );
};
