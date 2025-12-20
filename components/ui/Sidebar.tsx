'use client';

import React, { useState, memo, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Settings, 
  ChevronDown,
  ChevronRight,
  Globe,
  Menu,
  X,
  Users2,
  CreditCard,
  LogOut,
  Command,
  LucideIcon,
  Eye,
  Zap,
  Link2,
  BarChart3,
  Bot,
  MousePointer,
  Plus,
  Target,
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/lib/store/hooks';
import { selectUser, selectCurrentTeam, logout } from '@/lib/store/slices/authSlice';
import { selectCurrentDomain, selectDomains, resetDomainState } from '@/lib/store/slices/domainSlice';
import { useLogoutMutation } from '@/lib/store/api/authApi';
import { baseApi } from '@/lib/store/api/baseApi';

interface NavItemType {
  name: string;
  href: string;
  icon: LucideIcon;
  children?: { name: string; href: string }[];
}

const navigation: NavItemType[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Overview', href: '/overview', icon: Eye },
  { name: 'Actions', href: '/actions', icon: Zap },
  { name: 'Sources', href: '/sources', icon: Link2 },
  { 
    name: 'Analytics', 
    href: '/analytics', 
    icon: BarChart3,
    children: [
      { name: 'Web Analytics', href: '/analytics/web' },
      { name: 'LLM Analytics', href: '/analytics/llm' },
    ]
  },
  { name: 'Team', href: '/team', icon: Users2 },
  { name: 'Billing', href: '/billing', icon: CreditCard },
  { name: 'Settings', href: '/settings', icon: Settings },
];

// Memoized NavItem component with hover animation
const NavItem = memo(function NavItem({ 
  name, 
  href, 
  icon: Icon, 
  isActive,
  onClick,
  index,
  children,
}: { 
  name: string; 
  href: string; 
  icon: LucideIcon; 
  isActive: boolean;
  onClick: () => void;
  index: number;
  children?: { name: string; href: string }[];
}) {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(
    children ? children.some(child => pathname.startsWith(child.href)) : false
  );

  const hasActiveChild = children?.some(child => pathname === child.href || pathname.startsWith(child.href + '/'));

  if (children) {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.03, duration: 0.3 }}
      >
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.15 }}
          className={`
            w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors duration-200
            ${hasActiveChild 
              ? 'bg-primary/10 text-primary' 
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }
          `}
        >
          <Icon className="w-5 h-5" />
          <span className="font-medium text-sm flex-1 text-left">{name}</span>
          <motion.div
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight className="w-4 h-4" />
          </motion.div>
        </motion.button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="pl-4 mt-1 space-y-1">
                {children.map((child, childIndex) => {
                  const isChildActive = pathname === child.href || pathname.startsWith(child.href + '/');
                  return (
                    <motion.div
                      key={child.href}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: childIndex * 0.05 }}
                    >
                      <Link
                        href={child.href}
                        onClick={onClick}
                        className={`
                          flex items-center gap-3 px-4 py-2 rounded-xl text-sm transition-colors duration-200
                          ${isChildActive 
                            ? 'bg-primary text-white shadow-lg shadow-primary/25' 
                            : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                          }
                        `}
                      >
                        {child.name === 'Web Analytics' ? (
                          <MousePointer className="w-4 h-4" />
                        ) : (
                          <Bot className="w-4 h-4" />
                        )}
                        <span>{child.name}</span>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03, duration: 0.3 }}
    >
      <Link
        href={href}
        onClick={onClick}
        className="relative block"
      >
        <motion.div
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.15 }}
          className={`
            flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors duration-200
            ${isActive 
              ? 'bg-primary text-white shadow-lg shadow-primary/25' 
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }
          `}
        >
          <Icon className="w-5 h-5" />
          <span className="font-medium text-sm">{name}</span>
          {isActive && (
            <motion.div
              layoutId="activeIndicator"
              className="absolute right-2 w-1.5 h-1.5 rounded-full bg-white"
              initial={false}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          )}
        </motion.div>
      </Link>
    </motion.div>
  );
});

// Memoized Navigation component
const Navigation = memo(function Navigation({ onItemClick }: { onItemClick: () => void }) {
  const pathname = usePathname();
  
  return (
    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
      {navigation.map((item, index) => {
        const isActive = !item.children && (pathname === item.href || pathname.startsWith(item.href + '/'));
        return (
          <NavItem
            key={item.name}
            name={item.name}
            href={item.href}
            icon={item.icon}
            isActive={isActive}
            onClick={onItemClick}
            index={index}
            children={item.children}
          />
        );
      })}
    </nav>
  );
});

// Memoized Logo component with subtle animation
const Logo = memo(function Logo() {
  return (
    <div className="p-6 border-b border-gray-100">
      <Link href="/dashboard" className="flex items-center">
        <motion.div 
          className="h-8 w-auto"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <img 
            src="/logo.svg" 
            alt="Convitsa" 
            className="h-8 w-auto"
          />
        </motion.div>
      </Link>
    </div>
  );
});

// Memoized Search component with press animation
const SearchTrigger = memo(function SearchTrigger({ onClick }: { onClick?: () => void }) {
  return (
    <div className="p-4 border-b border-gray-100">
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={onClick}
        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-500 text-sm transition-colors"
      >
        <Command className="w-4 h-4" />
        <span>Search...</span>
        <kbd className="ml-auto px-2 py-0.5 rounded bg-gray-200 text-xs font-mono">⌘K</kbd>
      </motion.button>
    </div>
  );
});

// Memoized Domain Selector with dropdown animation
const DomainSelector = memo(function DomainSelector({ 
  domain, 
  isOpen, 
  onToggle 
}: { 
  domain: { url: string } | null; 
  isOpen: boolean; 
  onToggle: () => void;
}) {
  const displayDomain = domain?.url ? (() => {
    try {
      return new URL(domain.url).hostname;
    } catch {
      return 'No domain';
    }
  })() : 'No domain';

  return (
    <div className="p-4 border-b border-gray-100">
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={onToggle}
        className="w-full flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Globe className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium text-gray-700 truncate max-w-[140px]">
            {displayDomain}
          </span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </motion.div>
      </motion.button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-2 p-2 rounded-xl bg-white border border-gray-200 shadow-lg">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="p-3 rounded-lg bg-primary/5 border border-primary/20"
              >
                <div className="flex items-center gap-2">
                  <motion.div 
                    className="w-2 h-2 rounded-full bg-primary"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span className="text-sm font-medium text-gray-700 truncate">
                    {displayDomain}
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Track New Prompt Button */}
      <Link href="/prompts/track" className="block mt-3">
        <motion.div
          whileHover={{ scale: 1.01, y: -1 }}
          whileTap={{ scale: 0.99 }}
          className="w-full flex items-center gap-3 p-3 rounded-xl bg-primary text-white hover:bg-primary/90 transition-colors shadow-md shadow-primary/20"
        >
          <div className="p-1.5 rounded-lg bg-white/20">
            <Target className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium">Track New Prompt</span>
          <Plus className="w-4 h-4 ml-auto" />
        </motion.div>
      </Link>
    </div>
  );
});

// Memoized User Section with dropdown animation
const UserSection = memo(function UserSection({ 
  user, 
  isOpen, 
  onToggle, 
  onLogout 
}: { 
  user: { firstName?: string; lastName?: string; email?: string } | null;
  isOpen: boolean;
  onToggle: () => void;
  onLogout: () => void;
}) {
  return (
    <div className="p-4 border-t border-gray-100">
      <div className="relative">
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={onToggle}
          className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 transition-colors"
        >
          <motion.div 
            className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white font-semibold"
            whileHover={{ scale: 1.05 }}
          >
            {user?.firstName?.charAt(0) || 'U'}
          </motion.div>
          <div className="flex-1 text-left">
            <p className="text-sm font-medium text-gray-900">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </motion.div>
        </motion.button>
        
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.05 }}
              >
                <Link
                  href="/settings"
                  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={onToggle}
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </Link>
              </motion.div>
              <hr className="my-2 border-gray-100" />
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
              >
                <button
                  onClick={onLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4" />
                  Log out
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
});

interface SidebarProps {
  onOpenCommandPalette?: () => void;
}

export default function Sidebar({ onOpenCommandPalette }: SidebarProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const currentDomain = useAppSelector(selectCurrentDomain);
  
  const [logoutMutation] = useLogoutMutation();
  
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDomainDropdownOpen, setIsDomainDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const handleLogout = useCallback(async () => {
    // Clear all state first
    dispatch(logout());
    dispatch(resetDomainState());
    
    // Clear any cached API data
    dispatch(baseApi.util.resetApiState());
    
    // Then call logout API (don't wait for it)
    try {
      logoutMutation();
    } catch (err) {
      // Ignore errors - we've already logged out locally
    }
    
    // Use replace to prevent going back to authenticated pages
    router.replace('/login');
  }, [logoutMutation, dispatch, router]);

  const closeMobileMenu = useCallback(() => {
    setIsMobileOpen(false);
  }, []);

  const toggleDomainDropdown = useCallback(() => {
    setIsDomainDropdownOpen(prev => !prev);
  }, []);

  const toggleUserDropdown = useCallback(() => {
    setIsUserDropdownOpen(prev => !prev);
  }, []);

  return (
    <>
      {/* Mobile menu button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-white shadow-lg"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        <AnimatePresence mode="wait">
          {isMobileOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Menu className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={closeMobileMenu}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ 
          x: isMobileOpen ? 0 : (typeof window !== 'undefined' && window.innerWidth < 1024 ? -288 : 0)
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed inset-y-0 left-0 z-40 w-72 h-screen bg-white border-r border-gray-100 flex flex-col lg:translate-x-0"
      >
        <Logo />
        <SearchTrigger onClick={onOpenCommandPalette} />
        <DomainSelector 
          domain={currentDomain} 
          isOpen={isDomainDropdownOpen} 
          onToggle={toggleDomainDropdown} 
        />
        <Navigation onItemClick={closeMobileMenu} />
        <UserSection 
          user={user} 
          isOpen={isUserDropdownOpen} 
          onToggle={toggleUserDropdown}
          onLogout={handleLogout}
        />
      </motion.aside>
    </>
  );
}
