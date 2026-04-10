"use client"
import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { HiOutlineMenu, HiOutlineX, HiLocationMarker, HiPhone, HiChevronRight, HiMail } from 'react-icons/hi'
import { getSiteSettings } from '@/lib/actions'

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [settings, setSettings] = useState<any>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    const fetchSettings = async () => {
      const data = await getSiteSettings()
      setSettings(data)
    }
    fetchSettings()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'Kitchens', href: '/kitchens' },
    { name: 'Bathrooms', href: '/bathrooms' },
    { name: 'Cabinets', href: '/cabinets' },
    { name: 'Contractors', href: '/contractors' },
    { name: 'Showroom', href: '/showroom' },
    { name: 'Inventory', href: '/inventory' },
    { name: 'Gallery', href: '/gallery' },
  ]

  return (
    <header className="sticky top-0 left-0 right-0 z-50 font-sans">
      {/* 1. TOP BAR (Only on Desktop) */}
<div
  className={`hidden lg:block transition-all duration-500 overflow-hidden ${
    isScrolled ? "max-h-0 opacity-0" : "max-h-20 opacity-100"
  }`}
>
  <div className="bg-[#111111]/95 backdrop-blur-md border-b border-white/5">
    <div className="container mx-auto px-6 py-2 flex flex-col md:flex-row justify-between items-center text-[11px] uppercase tracking-wider font-semibold">

      {/* LEFT SIDE */}
      <div className="flex flex-wrap justify-center md:justify-start items-center gap-6 text-gray-400">

        {/* ADDRESS */}
        <div className="flex items-center gap-2 hover:text-white transition duration-300 group">
          <HiLocationMarker className="text-[#dc2626] group-hover:scale-110 transition-transform" />
          <span className="truncate max-w-[180px] md:max-w-none">
            {settings?.address || "8524 E Adamo Dr, Tampa, FL"}
          </span>
        </div>

        {/* PHONE */}
        <div className="flex items-center gap-2 hover:text-white transition duration-300 group">
          <HiPhone className="text-[#dc2626] group-hover:scale-110 transition-transform" />
          <a
            href={`tel:${settings?.phone}`}
            className="hover:text-white"
          >
            {settings?.phone || "1-800-555-0199"}
          </a>
        </div>

        {/* EMAIL */}
        <div className="flex items-center gap-2 hover:text-white transition duration-300 group">
          <HiMail className="text-[#dc2626] group-hover:scale-110 transition-transform" />
          <a
            href={`mailto:${settings?.email}`}
            className="lowercase tracking-normal font-sans"
          >
            {settings?.email || "support@southerndesign.com"}
          </a>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-4 mt-2 md:mt-0">

        {/* Divider */}
        <div className="hidden md:block h-4 w-px bg-white/20"></div>

        {/* LOGIN BUTTON */}
        <Link
          href="/login"
          className="relative text-gray-300 hover:text-white transition duration-300"
        >
          <span className="after:absolute after:left-0 after:-bottom-1 after:h-[1px] after:w-0 after:bg-[#dc2626] after:transition-all after:duration-300 hover:after:w-full">
            Staff Login
          </span>
        </Link>
      </div>
    </div>
  </div>
</div>

      {/* 2. MAIN NAVIGATION */}
      <nav className={`transition-all    duration-300 ${isScrolled ? 'bg-white py-3 shadow-xl' : 'bg-[#f9f7f2] py-3'}`}>
        <div className="container mx-auto px-6 flex items-center justify-between relative">
          
          {/* MOBILE PLACEHOLDER (To balance absolute logo) */}
          <div className="lg:hidden w-10" />

          {/* 1. LOGO SECTION */}
          <div className="flex-shrink-0 flex items-center z-10 lg:static absolute left-1/2 lg:left-auto -translate-x-1/2 lg:translate-x-0">
            <Link href="/" className="relative block w-[160px] md:w-[200px] h-[50px] md:h-[65px]">
              <Image 
                src={settings?.logoUrl || "/logo.png"} 
                alt={settings?.siteName || "Logo"} 
                fill 
                priority 
                className="object-contain" 
              />
            </Link>
          </div>

          {/* 2. DESKTOP LINKS SECTION (Centered in remaining space) */}
          <div className="hidden lg:flex flex-1 justify-center items-center px-8">
            <div className="flex items-center space-x-4 xl:space-x-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href} 
                  className="text-[11px] xl:text-[12px] font-black uppercase tracking-tighter text-[#1a1a1a] hover:text-[#b33a2b] transition-all duration-300 ease-in-out opacity-90 hover:opacity-100 whitespace-nowrap"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* 3. DESKTOP BUTTON & MOBILE TOGGLE SECTION */}
          <div className="flex items-center gap-4 z-10">
            {/* Desktop Button - Now ONLY on lg+ */}
            <div className="hidden lg:block text-right">
              <Link href="/contact#quote-form">
                <button className="bg-red-600 hover:bg-[#1a1a1a] text-white px-5 xl:px-8 py-3 font-bold text-[11px] xl:text-[12px] uppercase tracking-widest transition-all whitespace-nowrap shadow-lg hover:shadow-red-600/20">
                  Request Quote
                </button>
              </Link>
            </div>

            {/* MOBILE TOGGLE */}
            <button 
              className="lg:hidden bg-[#1a1a1a] text-white p-2.5 rounded-sm shadow-md hover:bg-red-600 transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <HiOutlineMenu size={22} />
            </button>
          </div>
        </div>
      </nav>

      {/* 3. PROFESSIONAL MOBILE OVERLAY */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ x: '100%' }} 
            animate={{ x: 0 }} 
            exit={{ x: '100%' }} 
            transition={{ type: 'tween', duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 bg-white z-[70] lg:hidden flex flex-col font-sans"
          >
            {/* Mobile Header */}
            <div className="flex justify-end items-center px-8 py-6 border-b border-gray-100">
              <button 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="w-10 h-10 flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-[#1a1a1a] transition-colors"
              >
                <HiOutlineX size={24} />
              </button>
            </div>

            {/* Mobile Body - CLEAN LIST */}
            <div className="flex-1 overflow-y-auto px-8 py-10">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-6">Menu</p>
                {navLinks.map((link) => (
                  <Link 
                    key={link.name} 
                    href={link.href} 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between py-5 border-b border-gray-50 group active:bg-gray-50 px-2 -mx-2"
                  >
                    <span className="text-lg font-bold uppercase tracking-tight text-[#1a1a1a] group-hover:text-[#b33a2b] transition-colors">{link.name}</span>
                    <HiChevronRight className="text-gray-300 group-hover:text-[#b33a2b] transition-all" size={20} />
                  </Link>
                ))}
              </div>

              {/* Warehouse Quick Info - PROFESSIONAL FOOTER BLOCK */}
              <div className="mt-16 space-y-8">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Warehouse Support</p>
                
                <div className="grid gap-6">
                  <a href={`tel:${settings?.phone}`} className="flex items-start gap-5 group">
                    <div className="w-10 h-10 bg-gray-50 flex items-center justify-center text-[#1a1a1a] group-hover:bg-[#1a1a1a] group-hover:text-white transition-all">
                      <HiPhone size={18} />
                    </div>
                    <div>
                      <p className="text-[9px] font-extrabold text-[#dc2626] uppercase tracking-widest mb-0.5">Direct Sales</p>
                      <p className="text-[#1a1a1a] font-black text-sm">{settings?.phone || "1-800-555-0199"}</p>
                    </div>
                  </a>

                  <div className="flex items-start gap-5">
                    <div className="w-10 h-10 bg-gray-50 flex items-center justify-center text-[#1a1a1a]">
                      <HiLocationMarker size={18} />
                    </div>
                    <div>
                      <p className="text-[9px] font-extrabold text-[#dc2626] uppercase tracking-widest mb-0.5">Showroom</p>
                      <p className="text-[#1a1a1a] font-black text-xs leading-relaxed max-w-[200px]">{settings?.address || "8524 E Adamo Dr, Tampa, FL"}</p>
                    </div>
                  </div>

                  <a href={`mailto:${settings?.email}`} className="flex items-start gap-5 group">
                    <div className="w-10 h-10 bg-gray-50 flex items-center justify-center text-[#1a1a1a] group-hover:bg-[#1a1a1a] group-hover:text-white transition-all">
                      <HiMail size={18} />
                    </div>
                    <div>
                      <p className="text-[9px] font-extrabold text-[#dc2626] uppercase tracking-widest mb-0.5">Inquiries</p>
                      <p className="text-[#1a1a1a] font-black text-xs break-all lowercase font-sans">{settings?.email || "support@southerndesign.com"}</p>
                    </div>
                  </a>
                </div>
              </div>
            </div>

            {/* Mobile Footer Action - BOX TYPE SHARP */}
            <div className="px-8 py-8 bg-white border-t border-gray-100">
              <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)}>
                <button className="w-full bg-[#b33a2b] text-white py-5 font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl active:scale-[0.98] transition-all">
                  Get Instant Quote
                </button>
              </Link>
              <Link 
                href="/login" 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="block text-center mt-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] hover:text-[#1a1a1a] transition-colors"
              >
                Staff Portal Access
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}