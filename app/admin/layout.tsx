"use client"
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useSession, signOut } from 'next-auth/react'
import SessionWrapper from '@/components/providers/SessionWrapper'
import { SearchProvider, useSearch } from '@/context/SearchContext'
import { getNewQuoteCount } from '@/lib/actions'
import {
  HiChevronLeft,
  HiChevronRight,
  HiLogout,
  HiMenuAlt2,
  HiX,
  HiSearch,
  HiBell,
  HiQuestionMarkCircle
} from 'react-icons/hi'
import { MdDashboard, MdInventory, MdPeople, MdSettings, MdMessage, MdGavel } from 'react-icons/md'

const AdminLayoutContent = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [newInquiryCount, setNewInquiryCount] = useState(0)
  const pathname = usePathname()
  const { data: session } = useSession()
  const { searchTerm, setSearchTerm } = useSearch()

  // Fetch new inquiry count
  const fetchInquiryCount = async () => {
    // skip if tab is not active or already fetching to avoid noise
    if (typeof document !== 'undefined' && document.visibilityState !== 'visible') return;

    try {
      const count = await getNewQuoteCount()
      setNewInquiryCount(count)
    } catch (error) {
      console.error("Failed to fetch inquiry count:", error)
    }
  }

  useEffect(() => {
    // Initial fetch
    fetchInquiryCount()
    
    // Poll every 30 seconds for new inquiries
    const interval = setInterval(() => {
      fetchInquiryCount()
    }, 30000)
    
    return () => clearInterval(interval)
  }, [])

  const user = session?.user
  const userInitials = user?.name 
    ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.slice(0, 2).toUpperCase() || 'AD'

  const navLinks = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: MdDashboard },
    { name: 'Quotes', href: '/admin/quotes', icon: MdMessage },
    { name: 'Inventory', href: '/admin/inventory', icon: MdInventory },
    { name: 'Users', href: '/admin/users', icon: MdPeople },
    { name: 'Site Content', href: '/admin/content', icon: MdSettings },
    { name: 'Legal & FAQ', href: '/admin/legal', icon: MdGavel },
  ]

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#19222d] text-slate-300 overflow-hidden font-[arial]">
      <div className="px-6 py-4 flex items-center justify-between border-b border-white/5">
        <h2 className="text-xs font-bold uppercase tracking-widest text-[#a68966]">SDW Management v1.0</h2>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="hidden lg:flex items-center justify-center w-6 h-6 text-slate-500 hover:text-white transition-all bg-white/5 rounded"
        >
          {isSidebarOpen ? <HiChevronLeft size={16} /> : <HiChevronRight size={16} />}
        </button>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-0.5 overflow-y-auto">
        {navLinks
          .filter(link => {
            if (link.name === 'Users' && (user as any)?.role !== 'ADMIN') return false
            return true
          })
          .map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 transition-all duration-150 group border-l-2 ${isActive
                    ? 'bg-white/5 text-[#ff9900] border-[#ff9900]'
                    : 'text-slate-400 hover:text-white hover:bg-white/5 border-transparent'
                  }`}
              >
                <Icon size={18} className={isActive ? 'text-[#ff9900]' : 'text-slate-500 group-hover:text-slate-300'} />
                {(isSidebarOpen || isMobileMenuOpen) && (
                  <span className="text-[13px] font-medium whitespace-nowrap">{link.name}</span>
                )}
              </Link>
            )
          })}
      </nav>

      <div className="p-3 border-t border-white/5">
        <button 
          type="button"
          onClick={() => signOut({ callbackUrl: "/login", redirect: true })}
          className="flex items-center gap-3 w-full px-3 py-2.5 text-slate-400 hover:text-white transition-all group hover:bg-white/5"
        >
          <HiLogout size={18} />
          {(isSidebarOpen || isMobileMenuOpen) && <span className="text-[13px] font-medium">Sign Out</span>}
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f2f3f3] flex flex-col font-[arial]">
      
      {/* 1. SDW Top Header */}
      <header className="h-14 bg-[#232f3e] text-white flex items-center justify-between px-4 sticky top-0 z-[60]">
        <div className="flex items-center gap-6">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-1.5 hover:bg-white/10 rounded transition-all"
          >
            <HiMenuAlt2 size={24} />
          </button>
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-[#ff9900] rounded-sm flex items-center justify-center text-[#232f3e] font-black text-xs group-hover:scale-105 transition-transform">
                SDW
            </div>
            <div className="hidden sm:flex flex-col border-l border-white/20 pl-3 ml-1">
                <span className="text-[11px] font-black uppercase tracking-widest leading-none">Dashboard</span>
                <div className="flex items-center gap-2">
                  <span className="text-[8px] font-bold text-[#ff9900] uppercase tracking-[0.2em] opacity-80">Warehouse Management</span>
                  <span className="text-[7px] font-black bg-[#ff9900] text-[#232f3e] px-1 rounded-[2px] leading-none mb-0.5 animate-pulse">v1.0</span>
                </div>
            </div>
          </Link>
          <div className="hidden md:flex items-center bg-[#19222d] rounded px-3 py-1.5 w-80 border border-white/10 group focus-within:border-[#ff9900] transition-all relative">
            <HiSearch className="text-slate-500 mr-2" size={16} />
            <input 
              type="text" 
              placeholder="Search services, items, users..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none text-xs w-full placeholder:text-slate-600 font-medium"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-3 p-1 hover:bg-white/10 rounded transition-colors text-slate-500 hover:text-white"
              >
                <HiX size={12} />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <Link href="/admin/quotes" className="hidden sm:flex items-center gap-1 hover:bg-white/10 px-3 py-2 rounded transition-all cursor-pointer group relative">
              <HiBell className={`${newInquiryCount > 0 ? 'text-[#ff9900]' : 'text-slate-400'} group-hover:text-white`} size={18} />
              {newInquiryCount > 0 && (
                <>
                  <div className="absolute top-2 right-3 w-2 h-2 bg-[#ff9900] rounded-full border border-[#232f3e] animate-pulse" />
                  <span className="ml-1 text-[10px] font-black text-[#ff9900] tabular-nums">
                    {newInquiryCount}
                  </span>
                </>
              )}
          </Link>
          <Link href="/admin/legal" title="System Documentation & FAQ" className="hidden sm:flex items-center gap-1 hover:bg-white/10 px-3 py-2 rounded transition-all cursor-pointer group border-l border-white/10 ml-2">
              <HiQuestionMarkCircle className="text-slate-400 group-hover:text-white" size={18} />
          </Link>

          <div className="flex items-center gap-3 pl-4 border-l border-white/10 ml-2 group cursor-pointer hover:bg-white/10 py-1.5 px-3 rounded transition-all">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight leading-none mb-0.5">
                {(user as any)?.role === 'ADMIN' ? 'Administrator' : 'Staff Member'}
              </p>
              <p className="text-[11px] font-bold text-white leading-none">
                {user?.name || user?.email?.split('@')[0] || 'Manager'}
              </p>
            </div>
            <div className="w-8 h-8 rounded bg-[#19222d] border border-white/10 flex items-center justify-center font-bold text-[#ff9900] text-[10px] shadow-inner">
               {userInitials}
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* 2. SDW Sidebar */}
        <motion.aside
          animate={{ width: isSidebarOpen ? 240 : 54 }}
          transition={{ duration: 0.1 }}
          className="hidden lg:block bg-[#19222d] border-r border-[#232f3e] sticky top-14 h-[calc(100vh-56px)] overflow-hidden transition-all"
        >
          <SidebarContent />
        </motion.aside>

        {/* 3. Main  Content */}
        <div 
          className={`flex-1 flex flex-col transition-all duration-150 min-w-0`}
        >
          {/* Breadcrumbs */}
          <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-2 text-[11px] font-bold text-gray-500 uppercase tracking-widest overflow-hidden overflow-x-auto whitespace-nowrap scrollbar-hide">
              <Link href="/admin/dashboard" className="hover:text-slate-900">Warehouse</Link>
              <MdChevronRight size={14} className="text-gray-300 shrink-0" />
              <span className="text-slate-900 shrink-0">
                {navLinks.find(link => pathname === link.href)?.name || 'Account'}
              </span>
              <div className="ml-auto flex items-center gap-2">
                 <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                 <span className="text-[9px] opacity-70">Location: Southern Warehouse HQ</span>
              </div>
          </div>

          <main className="p-6 md:p-10 max-w-[1600px] w-full mx-auto flex-1">
            {children}
          </main>

          <footer className="px-10 py-4 border-t border-gray-200 text-center bg-white">
              <p className="text-gray-400 text-[10px] font-bold tracking-widest uppercase opacity-80 leading-relaxed">
                Southern Design Warehouse • Built for Industrial Scale
              </p>
          </footer>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/60 z-[70] lg:hidden backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 bg-[#19222d] z-[80] lg:hidden shadow-2xl flex flex-col"
            >
              <div className="flex justify-end p-4">
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 text-slate-500 hover:text-white transition-colors hover:bg-white/5 rounded border border-white/5"
                >
                  <HiX size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-hidden">
                <SidebarContent />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style jsx global>{`
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #f1f3f3; }
        ::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #9ca3af; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  )
}

const MdChevronRight = ({ size, className }: { size: number, className: string }) => (
    <svg 
        stroke="currentColor" 
        fill="currentColor" 
        strokeWidth="0" 
        viewBox="0 0 24 24" 
        height={size} 
        width={size} 
        className={className} 
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path>
    </svg>
)

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionWrapper>
      <SearchProvider>
        <AdminLayoutContent>{children}</AdminLayoutContent>
      </SearchProvider>
    </SessionWrapper>
  )
}

export default AdminLayout
