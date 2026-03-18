'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Home, BarChart2, PieChart, Users, Map, Menu, X, Flag } from 'lucide-react';
import ThemeToggle from '@/components/ui/ThemeToggle';
const navItems = [
  { name: 'Summary',  href: '/',                  icon: Home },
  { name: 'Results',  href: '/dashboard/results',  icon: BarChart2 },
  { name: 'Parties',  href: '/dashboard/parties',  icon: PieChart },
  { name: 'Turnout',  href: '/dashboard/turnout',  icon: Users },
  { name: 'States',   href: '/dashboard/states',   icon: Map },
];

function NavLinks({ pathname, onClick }) {
  return navItems.map((item) => {
    const isActive = pathname === item.href;
    const Icon = item.icon;
    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={onClick}
        className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-150 ${
          isActive
            ? 'bg-white/20 text-white font-semibold shadow-inner'
            : 'text-blue-200 hover:bg-white/10 hover:text-white'
        }`}
      >
        <Icon size={18} />
        <span className="text-sm">{item.name}</span>
      </Link>
    );
  });
}

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* ── Mobile top bar ──────────────────────────────── */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-blue-900 text-white shadow-lg">
        <div className="flex items-center gap-2">
          <Flag size={16} className="text-orange-400" />
          <span className="font-bold text-base tracking-tight">ECI Analytics</span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* ── Mobile drawer overlay ────────────────────────── */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Mobile drawer ───────────────────────────────── */}
      <div className={`md:hidden fixed top-0 left-0 h-full w-64 z-50 bg-blue-900 text-white shadow-2xl transform transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-blue-800">
          <div>
            <h1 className="text-lg font-bold">ECI Analytics</h1>
            <p className="text-xs text-blue-300">Election Commission of India</p>
          </div>
          <button onClick={() => setMobileOpen(false)} className="p-1 rounded-lg hover:bg-white/10">
            <X size={18} />
          </button>
        </div>
        <nav className="px-3 mt-4 space-y-1">
          <NavLinks pathname={pathname} onClick={() => setMobileOpen(false)} />
        </nav>
        <div className="absolute bottom-4 left-0 right-0 text-center text-xs text-blue-400">
          &copy; 2024 ECI Dashboard
        </div>
      </div>

      {/* ── Desktop sidebar ──────────────────────────────── */}
      <aside className="hidden md:flex w-60 bg-blue-900 text-white flex-col shadow-xl flex-shrink-0">
        <div className="px-5 py-4 flex items-center justify-between border-b border-blue-800">
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <Flag size={14} className="text-orange-400" />
              <h1 className="text-base font-bold">ECI Analytics</h1>
            </div>
            <p className="text-xs text-blue-300">Election Commission of India</p>
          </div>
          <ThemeToggle />
        </div>
        <nav className="flex-1 px-3 space-y-1 mt-4 overflow-y-auto">
          <NavLinks pathname={pathname} />
        </nav>
        <div className="p-4 text-xs text-center text-blue-400 border-t border-blue-800">
          &copy; 2024 ECI Dashboard
          <span className="ml-1">| </span>
          <Link
            href="https://github.com/akshaymohanty/eci-analytics"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline text-blue-500 dark:text-blue-400"
          >
            Register
          </Link>
        </div>
      </aside>
    </>
  );
}
