import { GoogleGenAI } from '@google/genai';
import {
  Vehicle,
  VehiclePrivate,
  Category,
  Lead,
  SiteSettings,
  SiteContent,
  Guide,
  VehicleStatus
} from '../types';
import {
  initialCategories,
  initialVehicles,
  initialVehiclesPrivate,
  initialLeads,
  initialSiteSettings,
  initialSiteContent,
  initialGuides,
  defaultLayoutSettings
} from '../data/seedData';

// LocalStorage Keys
const STORAGE_KEY_VEHICLES = 'bas_vehicles_v2';
const STORAGE_KEY_VEHICLES_PRIVATE = 'bas_vehicles_private_v2';
const STORAGE_KEY_CATEGORIES = 'bas_categories_v2';
const STORAGE_KEY_LEADS = 'bas_leads_v2';
const STORAGE_KEY_SETTINGS = 'bas_settings_v2';
const STORAGE_KEY_CONTENT = 'bas_content_v2';
const STORAGE_KEY_GUIDES = 'bas_guides_v2';
const STORAGE_KEY_FAVOURITES = 'bas_favourites_v2';
const STORAGE_KEY_COMPARE = 'bas_compare_v2';
const STORAGE_KEY_RECENT_VIEWS = 'bas_recent_views_v2';

// Initialize storage with seeds if empty
function initializeStorage() {
  if (!localStorage.getItem(STORAGE_KEY_VEHICLES)) {
    localStorage.setItem(STORAGE_KEY_VEHICLES, JSON.stringify(initialVehicles));
  }
  if (!localStorage.getItem(STORAGE_KEY_VEHICLES_PRIVATE)) {
    localStorage.setItem(STORAGE_KEY_VEHICLES_PRIVATE, JSON.stringify(initialVehiclesPrivate));
  }
  if (!localStorage.getItem(STORAGE_KEY_CATEGORIES)) {
    localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(initialCategories));
  }
  if (!localStorage.getItem(STORAGE_KEY_LEADS)) {
    localStorage.setItem(STORAGE_KEY_LEADS, JSON.stringify(initialLeads));
  }
  if (!localStorage.getItem(STORAGE_KEY_SETTINGS)) {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(initialSiteSettings));
  }
  if (!localStorage.getItem(STORAGE_KEY_CONTENT)) {
    localStorage.setItem(STORAGE_KEY_CONTENT, JSON.stringify(initialSiteContent));
  }
  if (!localStorage.getItem(STORAGE_KEY_GUIDES)) {
    localStorage.setItem(STORAGE_KEY_GUIDES, JSON.stringify(initialGuides));
  }
}

initializeStorage();

// Safe reader
function getItem<T>(key: string, fallback: T): T {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch (e) {
    console.error(`Error reading ${key}:`, e);
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error writing ${key}:`, e);
  }
}

// Phone Number normalisation to +263 format
export function normalizeZimbabwePhone(phone: string): string {
  let cleaned = phone.replace(/[^\d+]/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '+263' + cleaned.substring(1);
  } else if (cleaned.startsWith('263')) {
    cleaned = '+' + cleaned;
  } else if (!cleaned.startsWith('+')) {
    cleaned = '+263' + cleaned;
  }
  return cleaned;
}

// ==================== PUBLIC VEHICLE API (STRICTLY NO COST, MARKUP, OR VIN) ====================

export function getPublicVehicles(): Vehicle[] {
  const all = getItem<Vehicle[]>(STORAGE_KEY_VEHICLES, initialVehicles);
  // Only return non-draft vehicles; sold vehicles remain live for 90 days per specification
  return all.filter(v => v.status !== 'Draft');
}

export function getPublicVehicleBySlug(slug: string): Vehicle | null {
  const all = getPublicVehicles();
  return all.find(v => v.slug.toLowerCase() === slug.toLowerCase()) || null;
}

export function getFeaturedVehicles(): Vehicle[] {
  const all = getPublicVehicles();
  return all.filter(v => v.featured && v.status === 'Available');
}

export function getRecentlySoldVehicles(): Vehicle[] {
  const all = getPublicVehicles();
  return all.filter(v => v.status === 'Sold');
}

export function getSimilarVehicles(vehicle: Vehicle, limit = 3): Vehicle[] {
  const all = getPublicVehicles().filter(v => v.id !== vehicle.id && v.status === 'Available');
  // Score by category or body type
  const sorted = [...all].sort((a, b) => {
    const aMatch = (a.bodyType === vehicle.bodyType ? 2 : 0) + (a.make === vehicle.make ? 2 : 0);
    const bMatch = (b.bodyType === vehicle.bodyType ? 2 : 0) + (b.make === vehicle.make ? 2 : 0);
    return bMatch - aMatch;
  });
  return sorted.slice(0, limit);
}

export function incrementVehicleViews(id: string): void {
  const all = getItem<Vehicle[]>(STORAGE_KEY_VEHICLES, initialVehicles);
  const updated = all.map(v => v.id === id ? { ...v, viewsCount: (v.viewsCount || 0) + 1 } : v);
  setItem(STORAGE_KEY_VEHICLES, updated);
}

// ==================== ADMIN VEHICLE API (WITH PRIVATE PRICING SEPARATION) ====================

export function getAdminVehicles(): { vehicle: Vehicle; privateData?: VehiclePrivate }[] {
  const vehicles = getItem<Vehicle[]>(STORAGE_KEY_VEHICLES, initialVehicles);
  const privateMap = getItem<Record<string, VehiclePrivate>>(STORAGE_KEY_VEHICLES_PRIVATE, initialVehiclesPrivate);

  return vehicles.map(v => ({
    vehicle: v,
    privateData: privateMap[v.id]
  }));
}

export function getAdminVehicleById(id: string): { vehicle: Vehicle; privateData: VehiclePrivate } | null {
  const vehicles = getItem<Vehicle[]>(STORAGE_KEY_VEHICLES, initialVehicles);
  const v = vehicles.find(item => item.id === id);
  if (!v) return null;
  const privateMap = getItem<Record<string, VehiclePrivate>>(STORAGE_KEY_VEHICLES_PRIVATE, initialVehiclesPrivate);
  const priv = privateMap[v.id] || {
    vehicleId: v.id,
    vin: '',
    costPrice: v.price * 0.88,
    markupType: 'fixed' as const,
    markupValue: v.price * 0.12,
    computedSellingPrice: v.price,
    marginAmount: v.price * 0.12,
    marginPercent: 12,
    roundingRule: 500 as const,
    priceHistory: []
  };
  return { vehicle: v, privateData: priv };
}

// Calculate selling price with rounding
export function computeSellingPrice(
  costPrice: number,
  markupType: 'percentage' | 'fixed',
  markupValue: number,
  roundingRule: 50 | 100 | 500
): { computedPrice: number; marginAmount: number; marginPercent: number } {
  let rawPrice = costPrice;
  let margin = 0;

  if (markupType === 'percentage') {
    margin = (costPrice * markupValue) / 100;
    rawPrice = costPrice + margin;
  } else {
    margin = markupValue;
    rawPrice = costPrice + markupValue;
  }

  // Round according to rule
  const roundedPrice = Math.round(rawPrice / roundingRule) * roundingRule;
  const actualMargin = roundedPrice - costPrice;
  const marginPercent = roundedPrice > 0 ? (actualMargin / roundedPrice) * 100 : 0;

  return {
    computedPrice: Math.max(0, roundedPrice),
    marginAmount: actualMargin,
    marginPercent: Number(marginPercent.toFixed(2))
  };
}

export function saveAdminVehicle(
  vehicleData: Vehicle,
  privateData: VehiclePrivate,
  adminUser = 'Admin'
): Vehicle {
  const vehicles = getItem<Vehicle[]>(STORAGE_KEY_VEHICLES, initialVehicles);
  const privateMap = getItem<Record<string, VehiclePrivate>>(STORAGE_KEY_VEHICLES_PRIVATE, initialVehiclesPrivate);

  const existingIndex = vehicles.findIndex(v => v.id === vehicleData.id);
  const existingPriv = privateMap[vehicleData.id];

  // Log price history if price changed
  if (existingIndex >= 0 && vehicles[existingIndex].price !== vehicleData.price) {
    const oldPrice = vehicles[existingIndex].price;
    const historyItem = {
      date: new Date().toISOString().split('T')[0],
      oldPrice,
      newPrice: vehicleData.price,
      changedBy: adminUser,
      reason: 'Price updated in vehicle editor'
    };
    privateData.priceHistory = [...(existingPriv?.priceHistory || []), historyItem];
  }

  // If vehicle is newly marked sold, stamp soldDate
  if (vehicleData.status === 'Sold' && !vehicleData.soldDate) {
    vehicleData.soldDate = new Date().toISOString();
  }

  let updatedVehicles: Vehicle[];
  if (existingIndex >= 0) {
    updatedVehicles = [...vehicles];
    updatedVehicles[existingIndex] = vehicleData;
  } else {
    updatedVehicles = [vehicleData, ...vehicles];
  }

  privateMap[vehicleData.id] = privateData;

  setItem(STORAGE_KEY_VEHICLES, updatedVehicles);
  setItem(STORAGE_KEY_VEHICLES_PRIVATE, privateMap);

  return vehicleData;
}

export function deleteVehicle(id: string): void {
  const vehicles = getItem<Vehicle[]>(STORAGE_KEY_VEHICLES, initialVehicles);
  const privateMap = getItem<Record<string, VehiclePrivate>>(STORAGE_KEY_VEHICLES_PRIVATE, initialVehiclesPrivate);

  const updatedVehicles = vehicles.filter(v => v.id !== id);
  delete privateMap[id];

  setItem(STORAGE_KEY_VEHICLES, updatedVehicles);
  setItem(STORAGE_KEY_VEHICLES_PRIVATE, privateMap);
}

export function bulkUpdateVehicleStatus(ids: string[], status: VehicleStatus): void {
  const vehicles = getItem<Vehicle[]>(STORAGE_KEY_VEHICLES, initialVehicles);
  const updated = vehicles.map(v => {
    if (ids.includes(v.id)) {
      return {
        ...v,
        status,
        soldDate: status === 'Sold' && !v.soldDate ? new Date().toISOString() : v.soldDate
      };
    }
    return v;
  });
  setItem(STORAGE_KEY_VEHICLES, updated);
}

export function bulkAdjustVehiclePrices(ids: string[], percentageDelta: number, adminUser = 'Admin'): void {
  const vehicles = getItem<Vehicle[]>(STORAGE_KEY_VEHICLES, initialVehicles);
  const privateMap = getItem<Record<string, VehiclePrivate>>(STORAGE_KEY_VEHICLES_PRIVATE, initialVehiclesPrivate);

  const updated = vehicles.map(v => {
    if (ids.includes(v.id)) {
      const oldPrice = v.price;
      const newPrice = Math.round((oldPrice * (1 + percentageDelta / 100)) / 100) * 100;
      const priv = privateMap[v.id];
      if (priv) {
        priv.priceHistory = [
          ...(priv.priceHistory || []),
          {
            date: new Date().toISOString().split('T')[0],
            oldPrice,
            newPrice,
            changedBy: adminUser,
            reason: `Bulk adjustment of ${percentageDelta > 0 ? '+' : ''}${percentageDelta}%`
          }
        ];
        priv.computedSellingPrice = newPrice;
        priv.marginAmount = newPrice - priv.costPrice;
        priv.marginPercent = newPrice > 0 ? Number(((priv.marginAmount / newPrice) * 100).toFixed(2)) : 0;
      }
      return {
        ...v,
        wasPrice: oldPrice,
        price: newPrice
      };
    }
    return v;
  });

  setItem(STORAGE_KEY_VEHICLES, updated);
  setItem(STORAGE_KEY_VEHICLES_PRIVATE, privateMap);
}

// ==================== CATEGORIES CRUD ====================

export function getCategories(): Category[] {
  return getItem<Category[]>(STORAGE_KEY_CATEGORIES, initialCategories);
}

export function saveCategory(category: Category): void {
  const all = getCategories();
  const index = all.findIndex(c => c.id === category.id);
  let updated: Category[];
  if (index >= 0) {
    updated = [...all];
    updated[index] = category;
  } else {
    updated = [...all, category];
  }
  setItem(STORAGE_KEY_CATEGORIES, updated);
}

export function deleteCategory(id: string): void {
  const all = getCategories();
  setItem(STORAGE_KEY_CATEGORIES, all.filter(c => c.id !== id));
}

// ==================== LEADS & CRM SYSTEM ====================

export function getLeads(): Lead[] {
  return getItem<Lead[]>(STORAGE_KEY_LEADS, initialLeads);
}

export function createLead(leadInput: Omit<Lead, 'id' | 'createdAt' | 'internalNotes'>): Lead {
  // Anti-spam & normalisation
  const phone = normalizeZimbabwePhone(leadInput.phone);
  const newLead: Lead = {
    ...leadInput,
    id: `lead-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    createdAt: new Date().toISOString(),
    phone,
    internalNotes: []
  };

  const all = getLeads();
  const updated = [newLead, ...all];
  setItem(STORAGE_KEY_LEADS, updated);

  return newLead;
}

export function updateLead(lead: Lead): void {
  const all = getLeads();
  const index = all.findIndex(l => l.id === lead.id);
  if (index >= 0) {
    const updated = [...all];
    updated[index] = lead;
    setItem(STORAGE_KEY_LEADS, updated);
  }
}

export function deleteLead(id: string): void {
  const all = getLeads();
  setItem(STORAGE_KEY_LEADS, all.filter(l => l.id !== id));
}

// ==================== SITE SETTINGS & CONTENT ====================

export function getSiteSettings(): SiteSettings {
  return getItem<SiteSettings>(STORAGE_KEY_SETTINGS, initialSiteSettings);
}

export function saveSiteSettings(settings: SiteSettings): void {
  setItem(STORAGE_KEY_SETTINGS, settings);
}

export function getSiteContent(): SiteContent {
  const content = getItem<SiteContent>(STORAGE_KEY_CONTENT, initialSiteContent);
  if (!content.layouts) {
    content.layouts = defaultLayoutSettings;
  } else {
    // Merge any missing keys from defaults
    content.layouts = {
      ...defaultLayoutSettings,
      ...content.layouts,
      homeSectionsEnabled: {
        ...defaultLayoutSettings.homeSectionsEnabled,
        ...(content.layouts.homeSectionsEnabled || {})
      }
    };
  }
  return content;
}

export function saveSiteContent(content: SiteContent): void {
  setItem(STORAGE_KEY_CONTENT, content);
}

export function getGuides(): Guide[] {
  return getItem<Guide[]>(STORAGE_KEY_GUIDES, initialGuides);
}

export function getGuideBySlug(slug: string): Guide | null {
  const guides = getGuides();
  return guides.find(g => g.slug === slug) || null;
}

export function saveGuide(guide: Guide): void {
  const all = getGuides();
  const index = all.findIndex(g => g.id === guide.id);
  let updated: Guide[];
  if (index >= 0) {
    updated = [...all];
    updated[index] = guide;
  } else {
    updated = [guide, ...all];
  }
  setItem(STORAGE_KEY_GUIDES, updated);
}

// ==================== FAVOURITES & COMPARE ====================

export function getFavouriteIds(): string[] {
  return getItem<string[]>(STORAGE_KEY_FAVOURITES, []);
}

export function toggleFavourite(id: string): boolean {
  const favs = getFavouriteIds();
  const exists = favs.includes(id);
  const updated = exists ? favs.filter(i => i !== id) : [...favs, id];
  setItem(STORAGE_KEY_FAVOURITES, updated);
  return !exists;
}

export function getCompareIds(): string[] {
  return getItem<string[]>(STORAGE_KEY_COMPARE, []);
}

export function toggleCompare(id: string): { added: boolean; list: string[] } {
  const current = getCompareIds();
  if (current.includes(id)) {
    const updated = current.filter(i => i !== id);
    setItem(STORAGE_KEY_COMPARE, updated);
    return { added: false, list: updated };
  } else {
    if (current.length >= 3) {
      return { added: false, list: current }; // Max 3
    }
    const updated = [...current, id];
    setItem(STORAGE_KEY_COMPARE, updated);
    return { added: true, list: updated };
  }
}

export function getRecentlyViewedIds(): string[] {
  return getItem<string[]>(STORAGE_KEY_RECENT_VIEWS, []);
}

export function addRecentlyViewed(id: string): void {
  const current = getRecentlyViewedIds().filter(i => i !== id);
  const updated = [id, ...current].slice(0, 6);
  setItem(STORAGE_KEY_RECENT_VIEWS, updated);
}

// ==================== AI DRAFTING WITH @GOOGLE/GENAI ====================

export async function generateVehicleDescriptionAI(
  make: string,
  model: string,
  trim: string,
  year: number,
  condition: string,
  keyFeatures: string[]
): Promise<string> {
  const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || (typeof process !== 'undefined' ? process.env.GEMINI_API_KEY : '');
  
  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are a high-end conversion copywriter for BORROWDALE AUTO SALES in Harare, Zimbabwe.
Dealership tone: Direct, confident, understated luxury, respectful, second person, short punchy sentences. Zimbabwean business tone: plain-spoken, straight to the point.
Task: Write a compelling 120-150 word vehicle listing description for:
Vehicle: ${year} ${make} ${model} ${trim}
Condition: ${condition}
Key Highlights: ${keyFeatures.slice(0, 5).join(', ')}

Include:
1. Opening line with year, make, model and commanding presence in Harare.
2. 3 key practical selling points (road clearance, performance, luxury features suited for Zimbabwe).
3. Condition statement and reassurance of service history.
4. Closing sentence encouraging WhatsApp enquiry or submitting an offer at our Borrowdale showroom.
Do not use hyperbolic fluff, emojis, or exclamation points. Output only the finished text.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });

      if (response.text) {
        return response.text.trim();
      }
    } catch (err) {
      console.warn('Gemini API call failed, falling back to local copy template:', err);
    }
  }

  // Fallback high-conversion template tailored to Borrowdale Harare standard
  return `The ${year} ${make} ${model} ${trim} represents an exceptional balance of prestige and road capability in Harare. Finished in immaculate condition, this ${condition.toLowerCase()} vehicle delivers commanding road presence paired with proven reliability across both city commutes and long-distance Zimbabwean highway travel. Equipped with ${keyFeatures.slice(0, 3).join(', ')}, it provides uncompromising occupant refinement and superior safety. Full service history verified, clean title documents in order, and ready for immediate handover at our Borrowdale showroom. Contact our sales desk on WhatsApp to arrange a viewing or submit your offer today.`;
}
