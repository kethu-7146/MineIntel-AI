import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { Shield, User, Building, CheckCircle2, LogOut, X, ShieldCheck, Mail, Briefcase } from 'lucide-react';

export const SAMPLE_PROFILES: UserProfile[] = [];

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onLogin: (user: UserProfile) => void;
  onLogout: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  onLogout,
}) => {
  const [nameInput, setNameInput] = useState(currentUser?.name || '');
  const [emailInput, setEmailInput] = useState(currentUser?.email || '');
  const [roleInput, setRoleInput] = useState(currentUser?.role || 'Lead Exploration Geologist');
  const [subsidiaryInput, setSubsidiaryInput] = useState(currentUser?.subsidiary || 'CMPDI HQ, Ranchi');
  const [departmentInput, setDepartmentInput] = useState(currentUser?.department || 'Geology & Exploration Division');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser) {
      setNameInput(currentUser.name);
      setEmailInput(currentUser.email);
      setRoleInput(currentUser.role);
      setSubsidiaryInput(currentUser.subsidiary);
      setDepartmentInput(currentUser.department);
    }
  }, [currentUser]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim() || !emailInput.trim()) return;

    const profile: UserProfile = {
      id: currentUser?.id || `USR-${Date.now().toString(36).toUpperCase()}`,
      name: nameInput.trim(),
      email: emailInput.trim(),
      role: roleInput.trim() || 'Technical Officer',
      subsidiary: subsidiaryInput.trim() || 'Coal India Limited',
      department: departmentInput.trim() || 'Mining Operations & Geology',
      clearanceLevel: 'Level 3 - Authorized Evaluator',
      badge: 'Certified Assessor',
      lastLogin: 'Active Session (Verified)',
      permissions: [
        'Ingest Geological & Mining Reports',
        'Execute OCR Text & Tabular Extraction',
        'Grounded Fact Verification & Q&A',
        'Discrepancy Audit & Geologist Override',
        'Generate & Sign CMPDI Synthesis Reports',
      ],
    };

    onLogin(profile);
    setSuccessMessage(`Profile updated for ${profile.name}`);
    setTimeout(() => {
      setSuccessMessage(null);
      onClose();
    }, 800);
  };

  const handleLogoutClick = () => {
    onLogout();
    setNameInput('');
    setEmailInput('');
    setSuccessMessage('Logged out successfully');
    setTimeout(() => {
      setSuccessMessage(null);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl max-w-lg w-full overflow-hidden transition-all my-8">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base tracking-tight">
                  User Account & Role Profile
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Manage your credentials and technical designation
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Active Status if logged in */}
        {currentUser && (
          <div className="bg-blue-50/70 dark:bg-blue-950/40 border-b border-blue-100 dark:border-blue-900/50 p-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                {currentUser.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-slate-900 dark:text-white">{currentUser.name}</span>
                  <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-1.5 py-0.5 rounded font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> Active Session
                  </span>
                </div>
                <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                  {currentUser.role} • <span className="font-medium text-slate-800 dark:text-slate-200">{currentUser.subsidiary}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogoutClick}
              className="flex items-center gap-1 text-xs text-rose-600 dark:text-rose-400 hover:text-rose-700 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/40 border border-rose-200 dark:border-rose-800 px-2.5 py-1.5 rounded-lg font-medium transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        )}

        {/* Success Banner */}
        {successMessage && (
          <div className="bg-emerald-50 dark:bg-emerald-950/50 border-b border-emerald-200 dark:border-emerald-800 p-3 text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* User Input Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="text-xs text-slate-600 dark:text-slate-400">
            Enter your details to associate your identity with report generation, document audits, and validation approvals:
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Full Name</span>
            </label>
            <input
              type="text"
              required
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="e.g., K. Srivaishnav"
              className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Email Address</span>
            </label>
            <input
              type="email"
              required
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="e.g., srivaishnavk@gmail.com"
              className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Role / Designation</span>
              </label>
              <input
                type="text"
                value={roleInput}
                onChange={(e) => setRoleInput(e.target.value)}
                placeholder="e.g., Lead Geologist"
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Organization / Subsidiary</span>
              </label>
              <input
                type="text"
                value={subsidiaryInput}
                onChange={(e) => setSubsidiaryInput(e.target.value)}
                placeholder="e.g., CMPDI Regional Institute"
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Department
            </label>
            <input
              type="text"
              value={departmentInput}
              onChange={(e) => setDepartmentInput(e.target.value)}
              placeholder="e.g., Geology & Mineral Exploration"
              className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition cursor-pointer"
            >
              {currentUser ? 'Update Profile' : 'Save & Sign In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
