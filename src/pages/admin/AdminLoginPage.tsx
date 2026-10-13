import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDealership } from '../../context/DealershipContext';
import { BrandLogo } from '../../components/ui/BrandLogo';
import { Shield, KeyRound, ArrowRight, UserCheck } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const { loginAdmin } = useDealership();
  const navigate = useNavigate();

  const [email, setEmail] = useState('principal@borrowdaleautosales.co.zw');
  const [password, setPassword] = useState('••••••••••••');
  const [selectedRole, setSelectedRole] = useState<'owner' | 'sales_staff'>('owner');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginAdmin(email, selectedRole);
    navigate('/admin/dashboard');
  };

  const handleQuickLogin = (role: 'owner' | 'sales_staff') => {
    loginAdmin(
      role === 'owner' ? 'principal@borrowdaleautosales.co.zw' : 'sales@borrowdaleautosales.co.zw',
      role
    );
    navigate('/admin/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#F5F2EB] flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md card-luxury p-8 border-[#23272C] space-y-6">
        <div className="text-center">
          <BrandLogo variant="wordmark" linkToHome={false} />
          <div className="mt-4 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#16181B] border border-[#23272C] text-[11px] font-mono text-[#C6A15B]">
            <Shield className="w-3.5 h-3.5" />
            <span>Authorized Personnel Only</span>
          </div>
          <h1 className="font-heading text-2xl font-bold uppercase mt-2">
            Dealership Portal Access
          </h1>
        </div>

        {/* Quick Demo Login Presets */}
        <div className="p-3 bg-[#0A0A0B] border border-[#23272C] rounded-[2px] space-y-2">
          <span className="text-[10px] font-mono uppercase text-[#9AA0A8] block">
            Select Access Role:
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('owner')}
              className="py-2.5 px-3 rounded-[2px] bg-[#C6A15B] text-[#0A0A0B] text-xs font-bold uppercase flex flex-col items-center hover:bg-[#A8843F] transition-colors"
            >
              <span>Owner / Principal</span>
              <span className="text-[9px] font-normal opacity-85">Full Margin & Cost</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('sales_staff')}
              className="py-2.5 px-3 rounded-[2px] bg-[#16181B] border border-[#23272C] text-[#F5F2EB] text-xs font-bold uppercase flex flex-col items-center hover:border-[#C6A15B] transition-colors"
            >
              <span>Sales Staff</span>
              <span className="text-[9px] font-normal text-[#9AA0A8]">Private Cost Hidden</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-[#9AA0A8] mb-1 font-semibold uppercase">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-[#0A0A0B] border border-[#23272C] rounded-[2px] px-3 py-2 text-sm text-[#F5F2EB]"
            />
          </div>

          <div>
            <label className="block text-[#9AA0A8] mb-1 font-semibold uppercase">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-[#0A0A0B] border border-[#23272C] rounded-[2px] px-3 py-2 text-sm text-[#F5F2EB]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-[2px] bg-[#C6A15B] text-[#0A0A0B] font-heading text-base font-bold uppercase tracking-wider hover:bg-[#A8843F] transition-colors flex items-center justify-center gap-2"
          >
            <KeyRound className="w-4 h-4" />
            <span>Sign In to Dashboard</span>
          </button>
        </form>
      </div>
    </div>
  );
};
