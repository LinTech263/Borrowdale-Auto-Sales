import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Vehicle, Category, SiteSettings, SiteContent, Guide, UserRole } from '../types';
import {
  getPublicVehicles,
  getCategories,
  getSiteSettings,
  getSiteContent,
  getGuides,
  getFavouriteIds,
  toggleFavourite as toggleFavService,
  getCompareIds,
  toggleCompare as toggleCompService,
  saveSiteSettings as saveSettingsService,
  saveSiteContent as saveContentService
} from '../services/dataService';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'error';
  message: string;
}

interface DealershipContextType {
  vehicles: Vehicle[];
  categories: Category[];
  settings: SiteSettings;
  content: SiteContent;
  guides: Guide[];
  favourites: string[];
  compareList: string[];
  currencyDisplay: 'USD' | 'ZiG';
  setCurrencyDisplay: (curr: 'USD' | 'ZiG') => void;
  formatPrice: (usd: number, showSecondaryIfEnabled?: boolean) => string;
  toggleFavourite: (id: string) => boolean;
  toggleCompare: (id: string) => boolean;
  clearCompare: () => void;
  refreshData: () => void;
  updateSettings: (newSettings: SiteSettings) => void;
  updateContent: (newContent: SiteContent) => void;
  // Auth state
  adminUser: UserRole | null;
  loginAdmin: (email: string, role: 'owner' | 'sales_staff') => void;
  logoutAdmin: () => void;
  // Modals state
  activeOfferVehicle: Vehicle | null;
  setActiveOfferVehicle: (v: Vehicle | null) => void;
  activeViewingVehicle: Vehicle | null;
  setActiveViewingVehicle: (v: Vehicle | null) => void;
  activePriceRequestVehicle: Vehicle | null;
  setActivePriceRequestVehicle: (v: Vehicle | null) => void;
  // Toasts
  toasts: ToastMessage[];
  addToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
}

const DealershipContext = createContext<DealershipContextType | undefined>(undefined);

export const DealershipProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(getSiteSettings());
  const [content, setContent] = useState<SiteContent>(getSiteContent());
  const [guides, setGuides] = useState<Guide[]>([]);
  const [favourites, setFavourites] = useState<string[]>([]);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [currencyDisplay, setCurrencyDisplay] = useState<'USD' | 'ZiG'>('USD');
  const [adminUser, setAdminUser] = useState<UserRole | null>(() => {
    const saved = localStorage.getItem('bas_admin_auth');
    return saved ? JSON.parse(saved) : null;
  });
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Modals
  const [activeOfferVehicle, setActiveOfferVehicle] = useState<Vehicle | null>(null);
  const [activeViewingVehicle, setActiveViewingVehicle] = useState<Vehicle | null>(null);
  const [activePriceRequestVehicle, setActivePriceRequestVehicle] = useState<Vehicle | null>(null);

  const refreshData = () => {
    setVehicles(getPublicVehicles());
    setCategories(getCategories());
    setSettings(getSiteSettings());
    setContent(getSiteContent());
    setGuides(getGuides());
    setFavourites(getFavouriteIds());
    setCompareList(getCompareIds());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const addToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const toggleFavourite = (id: string): boolean => {
    const added = toggleFavService(id);
    setFavourites(getFavouriteIds());
    addToast(added ? 'Vehicle saved to your favourites' : 'Removed from favourites', 'info');
    return added;
  };

  const toggleCompare = (id: string): boolean => {
    const res = toggleCompService(id);
    setCompareList(res.list);
    if (res.added) {
      addToast('Added to vehicle comparison (up to 3)', 'info');
    } else {
      if (getCompareIds().includes(id)) {
        addToast('Comparison limit reached (max 3 vehicles)', 'error');
      } else {
        addToast('Removed from vehicle comparison', 'info');
      }
    }
    return res.added;
  };

  const clearCompare = () => {
    localStorage.removeItem('bas_compare_v1');
    setCompareList([]);
    addToast('Comparison list cleared', 'info');
  };

  const updateSettings = (newSettings: SiteSettings) => {
    saveSettingsService(newSettings);
    setSettings(newSettings);
    addToast('Dealership settings saved successfully', 'success');
  };

  const updateContent = (newContent: SiteContent) => {
    saveContentService(newContent);
    setContent(newContent);
    addToast('Website copy and content updated', 'success');
  };

  const loginAdmin = (email: string, role: 'owner' | 'sales_staff') => {
    const user: UserRole = {
      email,
      role,
      name: role === 'owner' ? 'Dealership Principal' : 'Sales Consultant'
    };
    setAdminUser(user);
    localStorage.setItem('bas_admin_auth', JSON.stringify(user));
    addToast(`Logged in as ${user.name} (${role === 'owner' ? 'Owner Privileges' : 'Sales Staff'})`, 'success');
  };

  const logoutAdmin = () => {
    setAdminUser(null);
    localStorage.removeItem('bas_admin_auth');
    addToast('Logged out of admin portal', 'info');
  };

  const formatPrice = (usd: number, showSecondaryIfEnabled = true): string => {
    const usdFormatted = `US$${usd.toLocaleString('en-US')}`;
    if (
      showSecondaryIfEnabled &&
      settings.currency.secondaryEnabled &&
      settings.currency.usdToZigRate > 0
    ) {
      const zigVal = Math.round(usd * settings.currency.usdToZigRate);
      if (currencyDisplay === 'ZiG') {
        return `ZiG ${zigVal.toLocaleString('en-US')} (approx. ${usdFormatted})`;
      }
      return `${usdFormatted} (approx. ZiG ${zigVal.toLocaleString('en-US')})`;
    }
    return usdFormatted;
  };

  return (
    <DealershipContext.Provider
      value={{
        vehicles,
        categories,
        settings,
        content,
        guides,
        favourites,
        compareList,
        currencyDisplay,
        setCurrencyDisplay,
        formatPrice,
        toggleFavourite,
        toggleCompare,
        clearCompare,
        refreshData,
        updateSettings,
        updateContent,
        adminUser,
        loginAdmin,
        logoutAdmin,
        activeOfferVehicle,
        setActiveOfferVehicle,
        activeViewingVehicle,
        setActiveViewingVehicle,
        activePriceRequestVehicle,
        setActivePriceRequestVehicle,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </DealershipContext.Provider>
  );
};

export const useDealership = () => {
  const context = useContext(DealershipContext);
  if (!context) {
    throw new Error('useDealership must be used within DealershipProvider');
  }
  return context;
};
