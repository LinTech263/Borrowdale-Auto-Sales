import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { DealershipProvider } from './context/DealershipContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { FloatingWhatsApp } from './components/layout/FloatingWhatsApp';
import { ToastContainer } from './components/ui/ToastContainer';
import { CookieBanner } from './components/layout/CookieBanner';
import { MakeOfferModal } from './components/modals/MakeOfferModal';
import { BookViewingModal } from './components/modals/BookViewingModal';
import { RequestPriceModal } from './components/modals/RequestPriceModal';

// Public Pages
import { HomePage } from './pages/HomePage';
import { InventoryPage } from './pages/InventoryPage';
import { VehicleDetailPage } from './pages/VehicleDetailPage';
import { SellYourCarPage } from './pages/SellYourCarPage';
import { FinancePage } from './pages/FinancePage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { FaqPage } from './pages/FaqPage';
import { GuidesPage } from './pages/GuidesPage';
import { GuideDetailPage } from './pages/GuideDetailPage';
import { ComparePage } from './pages/ComparePage';
import { FavouritesPage } from './pages/FavouritesPage';
import { LocalLandingPage } from './pages/LocalLandingPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Admin Pages
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminVehiclesPage } from './pages/admin/AdminVehiclesPage';
import { AdminVehicleEditPage } from './pages/admin/AdminVehicleEditPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminLeadsPage } from './pages/admin/AdminLeadsPage';
import { AdminContentPage } from './pages/admin/AdminContentPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

// Scroll to top helper on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Wrapper for public layout with Navbar & Footer
function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1">{children}</div>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}

export default function App() {
  return (
    <DealershipProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Public Website Routes */}
          <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
          <Route path="/inventory" element={<PublicLayout><InventoryPage /></PublicLayout>} />
          <Route path="/inventory/:categorySlug" element={<PublicLayout><InventoryPage /></PublicLayout>} />
          <Route path="/cars/:make" element={<PublicLayout><InventoryPage /></PublicLayout>} />
          <Route path="/vehicle/:slug" element={<PublicLayout><VehicleDetailPage /></PublicLayout>} />
          <Route path="/sell-your-car" element={<PublicLayout><SellYourCarPage /></PublicLayout>} />
          <Route path="/finance" element={<PublicLayout><FinancePage /></PublicLayout>} />
          <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
          <Route path="/contact" element={<PublicLayout><ContactPage /></PublicLayout>} />
          <Route path="/faq" element={<PublicLayout><FaqPage /></PublicLayout>} />
          <Route path="/guides" element={<PublicLayout><GuidesPage /></PublicLayout>} />
          <Route path="/guides/:slug" element={<PublicLayout><GuideDetailPage /></PublicLayout>} />
          <Route path="/compare" element={<PublicLayout><ComparePage /></PublicLayout>} />
          <Route path="/favourites" element={<PublicLayout><FavouritesPage /></PublicLayout>} />
          <Route path="/privacy" element={<PublicLayout><PrivacyPolicyPage /></PublicLayout>} />
          <Route path="/terms" element={<PublicLayout><TermsPage /></PublicLayout>} />

          {/* Curated Local Landing Pages for Harare SEO */}
          <Route path="/used-cars-borrowdale-harare" element={<PublicLayout><LocalLandingPage /></PublicLayout>} />
          <Route path="/luxury-cars-for-sale-harare" element={<PublicLayout><LocalLandingPage /></PublicLayout>} />
          <Route path="/suvs-for-sale-harare" element={<PublicLayout><LocalLandingPage /></PublicLayout>} />
          <Route path="/double-cabs-for-sale-zimbabwe" element={<PublicLayout><LocalLandingPage /></PublicLayout>} />
          <Route path="/mercedes-benz-for-sale-zimbabwe" element={<PublicLayout><LocalLandingPage /></PublicLayout>} />

          {/* Admin Portal Routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="vehicles" element={<AdminVehiclesPage />} />
            <Route path="vehicles/new" element={<AdminVehicleEditPage />} />
            <Route path="vehicles/edit/:id" element={<AdminVehicleEditPage />} />
            <Route path="categories" element={<AdminCategoriesPage />} />
            <Route path="leads" element={<AdminLeadsPage />} />
            <Route path="content" element={<AdminContentPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Route>

          {/* 404 Route */}
          <Route path="*" element={<PublicLayout><NotFoundPage /></PublicLayout>} />
        </Routes>

        {/* Global Modals & Notifications */}
        <MakeOfferModal />
        <BookViewingModal />
        <RequestPriceModal />
        <ToastContainer />
        <CookieBanner />
      </BrowserRouter>
    </DealershipProvider>
  );
}
