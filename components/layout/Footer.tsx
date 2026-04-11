"use client"
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image' // Added for the logo
import { motion } from 'framer-motion'
import { getSiteSettings, getSocialLinks, submitLead, type SiteSettings } from '@/lib/actions'
import { FaFacebook, FaInstagram, FaTiktok, FaLinkedin, FaYoutube } from 'react-icons/fa'
import { HiCheckCircle, HiExclamationCircle, HiArrowRight } from 'react-icons/hi'

export const Footer = () => {
  const currentYear = new Date().getFullYear()
  const [settings, setSettings] = useState<Partial<SiteSettings>>({
    siteName: 'Southern Design Warehouse',
    logoUrl: '/logo.png',
    footerText: `© ${currentYear} Southern Design Warehouse.`,
    phone: '',
    email: '',
    address: '',
    footerBtnText: 'Plan Your Visit',
    footerBtnLink: '/contact'
  })
  const [socialLinks, setSocialLinks] = useState<any[]>([])
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error', message?: string }>({ type: 'idle' })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settingsData, socialData] = await Promise.all([
          getSiteSettings(),
          getSocialLinks()
        ])

        if (settingsData) {
          setSettings({
            ...settings,
            siteName: settingsData.siteName || settings.siteName,
            logoUrl: settingsData.logoUrl || settings.logoUrl,
            footerText: settingsData.footerText || settings.footerText,
            phone: settingsData.phone || '',
            email: settingsData.email || '',
            address: settingsData.address || '',
            footerBtnText: settingsData.footerBtnText || 'Plan Your Visit',
            footerBtnLink: settingsData.footerBtnLink || '/contact'
          })
        }

        setSocialLinks(socialData.filter((link: any) => link.isActive))
      } catch (err) {
        console.error("Failed to fetch footer data:", err)
      }
    }
    fetchData()
  }, [])
  
  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes('@')) return
    
    setStatus({ type: 'loading' })
    const formData = new FormData()
    formData.append('email', email)
    
    const result = await submitLead(formData)
    if (result.success) {
      setStatus({ type: 'success', message: result.success })
      setEmail('')
      setTimeout(() => setStatus({ type: 'idle' }), 5000)
    } else {
      setStatus({ type: 'error', message: result.error })
    }
  }

  const socialIconMap: { [key: string]: any } = {
    facebook: FaFacebook,
    instagram: FaInstagram,
    tiktok: FaTiktok,
    linkedin: FaLinkedin,
    youtube: FaYoutube
  }

  const sections = [
    {
      title: 'Inventory',
      links: [
        { name: 'Wood Products', href: '' },
        { name: 'Wall Panels', href: '' },
        { name: 'Tiles & Granite', href: '' },
        { name: 'Cabinets & Vanities', href: '/cabinets' },
        { name: 'Doors & Showers', href: '' },
      ]
    },
    {
      title: 'Specialties',
      links: [
        { name: 'Kitchen Design', href: '/kitchens' },
        { name: 'Bathroom Design', href: '/bathrooms' },
        { name: 'Cabinetry Solutions', href: '/cabinets' },
        { name: 'Contractor Supply', href: '/contractors' },
        { name: 'Showroom Tour', href: '/showroom' },
      ]
    },
    {
      title: 'Resources',
      links: [
        { name: 'Project Gallery', href: '/gallery' },
        { name: 'Our Story', href: '/about' },
        { name: 'Pricing FAQ', href: '/faq' },
        { name: 'Contact Us', href: '/contact' },
      ]
    }
  ]

  return (
    <footer className="bg-[#0A0A0A] text-white pt-20 pb-8 px-6 md:px-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto">

        {/* NEWSLETTER SECTION */}
        <div className="grid lg:grid-cols-2 gap-12 items-center pb-20 border-b border-white/5">
          <div>
            <h3 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              READY TO <span className="text-red-600">BUILD?</span>
            </h3>
            <p className="text-gray-400 max-w-md text-lg">
              Get exclusive contractor pricing and first-access to new warehouse inventory.
            </p>
          </div>
          <div className="relative">
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                className="flex-1 bg-white/5 border border-white/10 px-5 py-4 rounded-sm focus:outline-none focus:border-red-600 transition-colors text-white"
              />
              <button
                type="submit"
                disabled={status.type === 'loading'}
                className="bg-red-600 hover:bg-white hover:text-black text-white font-bold px-8 py-4 transition-all duration-300 uppercase tracking-widest text-sm flex items-center justify-center gap-2"
              >
                {status.type === 'loading' ? 'Sending...' : 'Join List'}
                <HiArrowRight />
              </button>
            </form>
            {status.message && (
              <p className={`absolute -bottom-8 left-0 text-sm ${status.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                {status.message}
              </p>
            )}
          </div>
        </div>

        {/* MIDDLE SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 py-20">
          
          {/* Brand Column - UPDATED WITH LOGO */}
          <div className="lg:col-span-2 space-y-8">
            <Link href="/" className="block">
              {/* FIXED: Logo replaces "SDW." text */}
              <div className="relative w-[200px] h-[60px]">
                <Image 
                  src={settings.logoUrl || "/logo.png"} 
                  alt={settings.siteName || "Southern Design Warehouse"} 
                  fill 
                  sizes="(max-width: 768px) 200px, 200px"
                  className="object-contain object-left brightness-0 invert" // Ensures it shows white/silver on dark background
                />
              </div>
            </Link>
            <div className="space-y-6">
              <div>
                <p className="text-red-600 font-bold uppercase tracking-[0.2em] text-[10px] mb-2">Main Warehouse</p>
                <p className="text-gray-400 text-sm leading-relaxed max-w-[280px]">
                  {settings.address || "Location loading..."}
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-red-600 font-bold uppercase tracking-[0.2em] text-[10px] mb-1">Direct Line</p>
                <a href={`tel:${settings.phone}`} className="text-xl font-bold hover:text-red-600 transition-colors">{settings.phone}</a>
                <a href={`mailto:${settings.email}`} className="text-gray-400 text-sm hover:text-white transition-colors">{settings.email}</a>
              </div>
            </div>
          </div>

          {/* Nav Columns */}
          {sections.map((section) => (
            <div key={section.title} className="space-y-6">
              <h4 className="text-sm font-bold uppercase tracking-widest text-white border-l-2 border-red-600 pl-4">
                {section.title}
              </h4>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-gray-500 hover:text-white hover:translate-x-1 inline-block transition-all text-sm">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* BOTTOM BAR */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col md:flex-row items-center gap-6 text-[11px] uppercase tracking-widest text-gray-500">
            <p>{settings.footerText}</p>
            <Link href="/privacy" className="hover:text-red-600 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-red-600 transition-colors">Terms of Service</Link>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-5">
            {socialLinks.map((link) => {
              const Icon = socialIconMap[link.platform.toLowerCase()] || FaFacebook
              return (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:border-red-600 hover:text-red-600 transition-all"
                >
                  <Icon size={18} />
                </a>
              )
            })}
          </div>

          <div className="text-[10px] uppercase tracking-widest text-gray-600">
            Design & Tech by <a href="https://makeitviralmedia.com/" className="text-red-900 hover:text-red-600 transition-colors font-bold">Make It Viral Media & Tech</a>
          </div>
        </div>
      </div>
    </footer>
  )
}