import React from 'react';
import coalRockTexture from '../assets/images/coal_rock_texture_1788456045919.jpg';
import {
  Pickaxe,
  LayoutDashboard,
  FileText,
  Sparkles,
  BarChart3,
  FileCheck2,
  Cpu,
  AlertTriangle,
  X,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  discrepancyCount: number;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: string | number;
  badgeColor?: string;
  section?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  discrepancyCount,
  isOpenMobile,
  onCloseMobile,
}) => {
  const navItems: NavItem[] = [
    {
      id: 'home',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5 shrink-0" />,
    },
    {
      id: 'upload',
      label: 'Documents',
      icon: <FileText className="w-5 h-5 shrink-0" />,
    },
    {
      id: 'qa',
      label: 'AI Assistant',
      icon: <Sparkles className="w-5 h-5 shrink-0" />,
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <BarChart3 className="w-5 h-5 shrink-0" />,
    },
    {
      id: 'report',
      label: 'Reports',
      icon: <FileCheck2 className="w-5 h-5 shrink-0" />,
    },
    {
      id: 'extraction',
      label: 'Doc Reader',
      icon: <Cpu className="w-5 h-5 shrink-0" />,
    },
    {
      id: 'discrepancy',
      label: 'Check Errors',
      icon: <AlertTriangle className="w-5 h-5 shrink-0" />,
      badge: discrepancyCount > 0 ? discrepancyCount : undefined,
      badgeColor: 'bg-rose-500/20 text-rose-300 border border-rose-500/30',
    },
  ];

  const handleItemClick = (id: string) => {
    onSelectTab(id);
    onCloseMobile();
  };

  const sidebarContent = (
    <div
      className="h-full flex flex-col justify-between text-slate-300 select-none border-r border-slate-800/80 shadow-2xl relative"
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(17, 21, 30, 0.88) 0%, rgba(13, 16, 23, 0.94) 100%), url(${coalRockTexture})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/70 flex items-center justify-between">
        <div
          onClick={() => handleItemClick('home')}
          className="flex items-center gap-3.5 cursor-pointer group"
        >
          {/* Logo icon matching the screenshot */}
          <div className="w-11 h-11 rounded-2xl bg-[#202736] border border-slate-700/60 flex items-center justify-center text-blue-400 group-hover:bg-[#273042] group-hover:border-blue-500/50 group-hover:text-blue-300 transition shadow-inner shrink-0">
            <Pickaxe className="w-6 h-6" />
          </div>

          <div className="flex flex-col">
            <h2 className="text-lg font-black tracking-tight text-white group-hover:text-blue-300 transition leading-tight">
              MineIntel
            </h2>
            <span className="text-[11px] font-medium text-slate-400 tracking-wide">
              AI Intelligence
            </span>
          </div>
        </div>

        {/* Mobile close button */}
        <button
          onClick={onCloseMobile}
          className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`sidebar-nav-${item.id}`}
              onClick={() => handleItemClick(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 cursor-pointer text-left ${
                isActive
                  ? 'bg-[#222938] text-white shadow-md border border-slate-700/80 font-bold'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <span
                  className={`transition-colors ${
                    isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                >
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ml-2 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : item.badgeColor || 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Controls & System Status */}
      <div className="p-4 border-t border-slate-800/70 shrink-0 bg-[#11141b]">
        {/* System Online Status Indicator matching photo */}
        <div className="flex items-center justify-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-medium text-slate-400">System Online</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Permanent left panel) */}
      <aside className="hidden lg:block w-64 shrink-0 h-screen sticky top-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Slide-over Overlay */}
      {isOpenMobile && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative w-64 max-w-[80vw] h-full z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
