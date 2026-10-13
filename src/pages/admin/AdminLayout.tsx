import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useDealership } from '../../context/DealershipContext';
import { SeoHead } from '../../components/ui/SeoHead';
import { BrandLogo } from '../../components/ui/BrandLogo';
import {
  LayoutDashboard,
  Car,
  FolderTree,
  Users,
  FileEdit,
  Settings,
  LogOut,
  Shield,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Menu,
  X
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { adminUser, logoutAdmin, loginAdmin, vehicles, categories, settings } = useDealership();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [checklistDismissed, setChecklistDismissed] = useState(false);

  // If not logged in, redirect to login
  if (!adminUser) {
    navigate('/admin/login');
    return null;
  }

  const isOwner = adminUser.role === 'owner';

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Vehicles', path: '/admin/vehicles', icon: Car },
    { name: 'Categories', path: '/admin/categories', icon: FolderTree },
    { name: 'Leads CRM', path: '/admin/leads', icon: Users },
    { name: 'Content Manager', path: '/admin/content', icon: FileEdit },
    ...(isOwner ? [{ name: 'Settings & Brand', path: '/admin/settings', icon: Settings }] : []),
  ];

  // First-run checklist state
  const hasCustomPhone = settings.phonePlaceholder !== '+263 77 000 0000';
  const hasMultipleVehicles = vehicles.length > 0;
  const hasCategories = categories.length > 0;
  const checklistComplete = hasCustomPhone && hasMultipleVehicles && hasCategories;

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#F5F2EB] flex flex-col md:flex-row font-sans">
      <SeoHead
        title="Dealer Portal | Borrowdale Auto Sales"
        description="Administrative portal for Borrowdale Auto Sales."
      />

      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#16181B] border-b border-[#23272C]">
        <BrandLogo variant="compact" linkToHome={false} />
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-2 text-[#9AA0A8] hover:text-[#F5F2EB]"
        >
          {mobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 h-screen w-64 bg-[#16181B] border-r border-[#23272C] z-40 flex flex-col justify-between transition-transform duration-300 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Logo Brand */}
          <div className="p-6 border-b border-[#23272C] flex items-center justify-between">
            <BrandLogo variant="compact" linkToHome={false} />
          </div>

          {/* User Role Badge & Switcher */}
          <div className="p-4 mx-3 my-3 bg-[#0A0A0B] rounded-[2px] border border-[#23272C]">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#9AA0A8]">Current Role</span>
              <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-[2px] ${
                isOwner ? 'bg-[#C6A15B]/20 text-[#C6A15B] border border-[#C6A15B]/40' : 'bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/40'
              }`}>
                {isOwner ? 'Principal' : 'Sales Staff'}
              </span>
            </div>
            <span className="text-xs font-bold block text-[#F5F2EB] truncate">{adminUser.name}</span>
            <span className="text-[10px] text-[#9AA0A8] block truncate">{adminUser.email}</span>

            {/* Quick role toggle for previewing permissions */}
            <div className="mt-2.5 pt-2 border-t border-[#23272C] flex items-center justify-between text-[10px]">
              <span className="text-[#9AA0A8]">Switch Mode:</span>
              <button
                onClick={() => loginAdmin(adminUser.email, isOwner ? 'sales_staff' : 'owner')}
                className="text-[#C6A15B] hover:underline font-semibold"
              >
                {isOwner ? 'View as Staff' : 'View as Owner'}
              </button>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="px-3 space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const active = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-[2px] text-xs font-semibold uppercase tracking-wider transition-colors ${
                    active
                      ? 'bg-[#0A0A0B] text-[#C6A15B] border-l-2 border-[#C6A15B]'
                      : 'text-[#9AA0A8] hover:text-[#F5F2EB] hover:bg-[#0A0A0B]/60'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#23272C] space-y-2">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 text-xs text-[#9AA0A8] hover:text-[#F5F2EB] rounded hover:bg-[#0A0A0B]"
          >
            <span>Live Public Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={() => { logoutAdmin(); navigate('/admin/login'); }}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#EA580C] hover:bg-[#0A0A0B] rounded transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Setup Checklist Banner (if not dismissed and incomplete) */}
        {!checklistComplete && !checklistDismissed && (
          <div className="bg-[#16181B] border-b border-[#C6A15B]/30 px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <span className="font-heading font-bold text-sm uppercase text-[#C6A15B]">
                First-Run Setup Checklist:
              </span>
              <div className="flex items-center gap-4 text-[#9AA0A8]">
                <span className={`flex items-center gap-1 ${hasCustomPhone ? 'text-[#0E7A33]' : ''}`}>
                  <CheckCircle2 className="w-3.5 h-3.5" /> Set Real Showroom Contact
                </span>
                <span className={`flex items-center gap-1 ${hasMultipleVehicles ? 'text-[#0E7A33]' : ''}`}>
                  <CheckCircle2 className="w-3.5 h-3.5" /> Add Floor Vehicles
                </span>
              </div>
            </div>
            <button
              onClick={() => setChecklistDismissed(true)}
              className="text-[#9AA0A8] hover:text-white"
            >
              Dismiss
            </button>
          </div>
        )}

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
