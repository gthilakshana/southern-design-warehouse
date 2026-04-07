"use client"
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiOutlineSave, HiPhotograph, HiLink, HiLocationMarker, HiPhone, HiMail, HiCheck, HiRefresh, HiPlus, HiTrash, HiPencil, HiExternalLink, HiX } from 'react-icons/hi'
import { MdOutlineTextSnippet, MdImage, MdOutlineSegment, MdAddCircleOutline, MdDelete, MdSettings, MdShare, MdCategory } from 'react-icons/md'
import {
  getSiteSettings,
  updateSiteSettings,
  getSocialLinks,
  upsertSocialLink,
  deleteSocialLink,
  getPageContent,
  updatePageContent,
  deletePageImage,
  getGalleryImages,
  createGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
  getProductCategories,
  upsertProductCategory,
  deleteProductCategory,
  type ProductCategory
} from '@/lib/actions'
import { FaFacebook, FaInstagram, FaTiktok, FaLinkedin, FaYoutube, FaShareAlt } from 'react-icons/fa'
import dynamic from 'next/dynamic'
import 'react-quill-new/dist/quill.snow.css'

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false })

const SiteContentPage = () => {
  const [activeTab, setActiveTab] = useState('general')
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showSuccess, setShowSuccess] = useState(false)

  const [settings, setSettings] = useState({
    siteName: 'Southern Design Warehouse',
    address: '123 Southern Ave, Design District',
    phone: '1-800-555-0199',
    email: 'support@southerndesign.com',
    heroUrl: '',
    heroMobileUrl: '',
    heroTabletUrl: '',
    heroTitle: '',
    heroDescription: '',
    heroText: '',
    footerText: '© 2024 Southern Design Warehouse. All rights reserved.',
    footerBtnText: 'Plan Your Visit',
    footerBtnLink: '/contact',
  })

  const [socialLinks, setSocialLinks] = useState<any[]>([])
  const [editingSocial, setEditingSocial] = useState<any | null>(null)
  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false)

  // Gallery Specific State
  const [galleryImages, setGalleryImages] = useState<any[]>([])
  const [productCategories, setProductCategories] = useState<ProductCategory[]>([])
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<ProductCategory | null>(null)
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false)
  const [editingGallery, setEditingGallery] = useState<any | null>(null)
  const [categoryDesc, setCategoryDesc] = useState('')
  const [galleryLoading, setGalleryLoading] = useState(false)

  // About Page Rich Text States
  const [mission, setMission] = useState('')
  const [vision, setVision] = useState('')
  const [story, setStory] = useState('')

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['clean']
    ],
  }

  // Page Specific Content State
  const [selectedPage, setSelectedPage] = useState('kitchens')
  const [pageContent, setPageContent] = useState<any>(null)
  const [pageLoading, setPageLoading] = useState(false)
  const [dragActive, setDragActive] = useState<string | null>(null)
  const [pendingFiles, setPendingFiles] = useState<{ [key: string]: File }>({})

  const fetchSettings = async () => {
    setIsLoading(true)
    try {
      const data = await getSiteSettings()
      if (data) {
        setSettings({
          siteName: data.siteName || '',
          address: data.address || '',
          phone: data.phone || '',
          email: data.email || '',
          heroUrl: data.heroUrl || '',
          heroMobileUrl: data.heroMobileUrl || '',
          heroTabletUrl: data.heroTabletUrl || '',
          heroTitle: data.heroTitle || '',
          heroDescription: data.heroDescription || '',
          heroText: data.heroText || '',
          footerText: data.footerText || '',
          footerBtnText: data.footerBtnText || '',
          footerBtnLink: data.footerBtnLink || '',
        })
      }
    } catch (err) {
      console.error("Failed to fetch settings:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchSocialLinks = async () => {
    try {
      const data = await getSocialLinks()
      setSocialLinks(data)
    } catch (err) {
      console.error("Failed to fetch social links:", err)
    }
  }

  const fetchGalleryImages = async () => {
    setGalleryLoading(true)
    try {
      const data = await getGalleryImages()
      setGalleryImages(data)
    } catch (err) {
      console.error("Failed to fetch gallery images:", err)
    } finally {
      setGalleryLoading(false)
    }
  }

  const fetchProductCategories = async () => {
    try {
      const data = await getProductCategories()
      setProductCategories(data)
    } catch (err) {
      console.error("Failed to fetch product categories:", err)
    }
  }

  const fetchPageContent = async (slug: string) => {
    setPageLoading(true)
    try {
      const data = await getPageContent(slug)
      if (data) {
        setPageContent(data)
        if (slug === 'about' && data.metadata) {
          const metadata = data.metadata as any
          setMission(metadata.mission || '')
          setVision(metadata.vision || '')
          setStory(metadata.story || '')
        }
      } else {
        setPageContent(null)
      }
    } finally {
      setPageLoading(false)
    }
  }

  useEffect(() => {
    fetchSettings()
    fetchSocialLinks()
    fetchGalleryImages()
    fetchProductCategories()
    fetchPageContent(selectedPage)
  }, [selectedPage])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSettings(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSaving(true)

    const formData = new FormData(e.currentTarget)

    // Manually append any pending files from drag/drop or custom change
    Object.entries(pendingFiles).forEach(([key, file]) => {
      formData.set(key, file)
    })

    let result
    if (activeTab === 'pages') {
      formData.append('slug', selectedPage)
      result = await updatePageContent(formData)
    } else {
      result = await updateSiteSettings(formData)
    }

    if (result.success) {
      setShowSuccess(true)
      setPendingFiles({}) // Clear pending files on success
      setTimeout(() => setShowSuccess(false), 3000)
    } else {
      alert(result.error || "Failed to update settings")
    }

    if (activeTab === 'pages') {
      await fetchPageContent(selectedPage)
    } else {
      await fetchSettings()
    }
    setIsSaving(false)
  }

  const tabs = [
    { id: 'general', name: 'Global Settings', icon: MdSettings },
    { id: 'pages', name: 'Page Content', icon: MdOutlineTextSnippet },
    { id: 'gallery-imgs', name: 'Gallery Images', icon: HiPhotograph },
    { id: 'product-categories', name: 'Product Class', icon: MdCategory },
    { id: 'footer', name: 'Legal & Footer', icon: MdOutlineSegment },
    { id: 'social', name: 'Social Connections', icon: MdShare },
  ]

  return (
    <div className="space-y-6 font-[arial] animate-in fade-in duration-500 relative pb-20">
      {isLoading && (
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] z-[50] flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-slate-200 border-t-[#ff9900] rounded-full animate-spin" />
        </div>
      )}

      {/* Header View */}
      <div className="bg-white border border-gray-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm rounded-sm">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            Site Management Console
            <span className="text-[10px] font-black text-slate-400 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded uppercase">System Sync</span>
          </h2>
          <p className="text-xs font-medium text-slate-500">Modify global site settings, media assets, and social links.</p>
        </div>
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 text-[10px] font-black uppercase tracking-widest rounded border border-green-200"
            >
              <HiCheck size={16} /> Changes Saved Successfully
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* SDW Style Navigation Tabs */}
      <div className="flex border-b border-gray-200 overflow-x-auto whitespace-nowrap scrollbar-hide bg-white px-6 shadow-sm">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-8 py-4 text-[11px] font-bold uppercase tracking-widest transition-all border-b-2 ${isActive
                ? 'border-[#ff9900] text-[#ff9900] bg-orange-50/10'
                : 'border-transparent text-gray-500 hover:text-slate-900 hover:bg-gray-50'
                }`}
            >
              {tab.name}
            </button>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Configuration  */}
        <div className="lg:col-span-8">
          <form onSubmit={handleSave} className="bg-white border border-gray-200 shadow-sm rounded-sm">
            <div className="p-8 space-y-8 min-h-[400px]">
              {activeTab === 'general' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-gray-100 pb-3 mb-6">Business Identity</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-slate-500 uppercase">Business Name</label>
                      <input name="siteName" value={settings.siteName} onChange={handleChange} type="text" className="w-full px-3 py-2 border border-gray-300 rounded text-xs font-bold outline-none focus:border-[#ff9900]" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-slate-500 uppercase">System Status</label>
                      <button
                        type="button"
                        onClick={async () => {
                          const { testSupabaseConnectivity } = await import('@/lib/actions')
                          const res = await testSupabaseConnectivity()
                          alert(res.success ? 'Supabase Connection: OK (200)' : `Supabase Error: ${res.error}`)
                        }}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 border border-blue-200 text-blue-600 bg-blue-50 text-[10px] font-black uppercase tracking-widest rounded hover:bg-blue-100 transition-all"
                      >
                        <HiRefresh className="animate-spin-slow" size={14} /> Run Connection Test
                      </button>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-slate-500 uppercase">Phone Number</label>
                      <input name="phone" value={settings.phone} onChange={handleChange} type="text" className="w-full px-3 py-2 border border-gray-300 rounded text-xs font-bold outline-none focus:border-[#ff9900]" />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[11px] font-black text-slate-500 uppercase">Warehouse Address</label>
                      <input name="address" value={settings.address} onChange={handleChange} type="text" className="w-full px-3 py-2 border border-gray-300 rounded text-xs font-bold outline-none focus:border-[#ff9900]" />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[11px] font-black text-slate-500 uppercase">Primary Email</label>
                      <input name="email" value={settings.email} onChange={handleChange} type="email" className="w-full px-3 py-2 border border-gray-300 rounded text-xs font-bold outline-none focus:border-[#ff9900]" />
                    </div>
                  </div>
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-gray-100 pb-3 mb-6 mt-10">Home Hero Messaging</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[11px] font-black text-slate-500 uppercase">Hero Main Heading</label>
                      <input name="heroTitle" value={settings.heroTitle} onChange={handleChange} type="text" className="w-full px-3 py-2 border border-gray-300 rounded text-xs font-bold outline-none focus:border-[#ff9900]" placeholder="e.g. Premium Remodeling Materials..." />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[11px] font-black text-slate-500 uppercase">Hero Subtext Description</label>
                      <textarea name="heroDescription" value={settings.heroDescription} onChange={handleChange} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded text-xs font-medium outline-none focus:border-[#ff9900] leading-relaxed" placeholder="Detailed subtext description..." />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[11px] font-black text-slate-500 uppercase italic">Product Categories List (Dot-Separated: KITCHENS • BATHROOMS...)</label>
                      <input name="heroText" value={settings.heroText} onChange={handleChange} type="text" className="w-full px-3 py-2 border border-gray-300 rounded text-[10px] font-black tracking-widest uppercase outline-none focus:border-[#ff9900]" placeholder="KITCHENS • BATHROOMS • ..." />
                    </div>
                  </div>

                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-gray-100 pb-3 mb-6 mt-10">Global Banners (Home Page)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Desktop Home Hero */}
                    <div className="space-y-4">
                      <label className="text-[11px] font-black text-slate-500 uppercase tracking-tight">Home Desktop Hero</label>
                      <div
                        className={`relative group/global-hero h-40 border-2 border-dashed rounded-sm flex flex-col items-center justify-center transition-all overflow-hidden ${dragActive === 'global-hero' ? 'border-[#ff9900] bg-[#ff9900]/5' : 'border-gray-200 bg-slate-50/30 hover:border-[#ff9900]/40'
                          }`}
                        onDragOver={(e) => { e.preventDefault(); setDragActive('global-hero') }}
                        onDragLeave={() => setDragActive(null)}
                        onDrop={(e) => {
                          e.preventDefault(); setDragActive(null);
                          const file = e.dataTransfer.files?.[0];
                          if (file) {
                            setSettings(prev => ({ ...prev, heroUrl: URL.createObjectURL(file) }));
                            setPendingFiles(prev => ({ ...prev, heroImage: file }));
                          }
                        }}
                      >
                        {settings.heroUrl ? (
                          <>
                            <img src={settings.heroUrl} alt="Home Hero" className="absolute inset-0 w-full h-full object-cover opacity-80" />
                            <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover/global-hero:opacity-100 transition-opacity">
                              <span className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[9px] font-black uppercase tracking-widest">Change Desktop</span>
                            </div>
                          </>
                        ) : (
                          <div className="text-center space-y-1">
                            <HiPhotograph size={24} className={`mx-auto transition-colors ${dragActive === 'global-hero' ? 'text-[#ff9900]' : 'text-slate-300'}`} />
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                              {dragActive === 'global-hero' ? 'Drop Image' : 'Provision Desktop'}
                            </p>
                          </div>
                        )}
                        <input name="heroImage" type="file" accept="image/*" onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setSettings(prev => ({ ...prev, heroUrl: URL.createObjectURL(file) }));
                            setPendingFiles(prev => ({ ...prev, heroImage: file }));
                          }
                        }} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                      </div>
                    </div>

                    {/* Tablet Home Hero */}
                    <div className="space-y-4">
                      <label className="text-[11px] font-black text-slate-500 uppercase tracking-tight italic">Home Tablet Hero</label>
                      <div
                        className={`relative group/global-tablet h-40 border-2 border-dashed rounded-sm flex flex-col items-center justify-center transition-all overflow-hidden ${dragActive === 'global-tablet' ? 'border-[#ff9900] bg-[#ff9900]/5' : 'border-gray-200 bg-slate-50/30 hover:border-[#ff9900]/40'
                          }`}
                        onDragOver={(e) => { e.preventDefault(); setDragActive('global-tablet') }}
                        onDragLeave={() => setDragActive(null)}
                        onDrop={(e) => {
                          e.preventDefault(); setDragActive(null);
                          const file = e.dataTransfer.files?.[0];
                          if (file) {
                            setSettings(prev => ({ ...prev, heroTabletUrl: URL.createObjectURL(file) }));
                            setPendingFiles(prev => ({ ...prev, heroTabletImage: file }));
                          }
                        }}
                      >
                        {settings.heroTabletUrl ? (
                          <>
                            <img src={settings.heroTabletUrl} alt="Home Tablet Hero" className="absolute inset-0 w-full h-full object-cover opacity-80" />
                            <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover/global-tablet:opacity-100 transition-opacity">
                              <span className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[9px] font-black uppercase tracking-widest">Change Tablet</span>
                            </div>
                          </>
                        ) : (
                          <div className="text-center space-y-1">
                            <HiPhotograph size={24} className={`mx-auto transition-colors ${dragActive === 'global-tablet' ? 'text-[#ff9900]' : 'text-slate-300'}`} />
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                              {dragActive === 'global-tablet' ? 'Drop Image' : 'Provision Tablet'}
                            </p>
                          </div>
                        )}
                        <input name="heroTabletImage" type="file" accept="image/*" onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setSettings(prev => ({ ...prev, heroTabletUrl: URL.createObjectURL(file) }));
                            setPendingFiles(prev => ({ ...prev, heroTabletImage: file }));
                          }
                        }} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                      </div>
                    </div>

                    {/* Mobile Home Hero */}
                    <div className="space-y-4">
                      <label className="text-[11px] font-black text-slate-500 uppercase tracking-tight italic">Home Mobile Hero</label>
                      <div
                        className={`relative group/global-mobile h-40 border-2 border-dashed rounded-sm flex flex-col items-center justify-center transition-all overflow-hidden ${dragActive === 'global-mobile' ? 'border-[#ff9900] bg-[#ff9900]/5' : 'border-gray-200 bg-slate-50/30 hover:border-[#ff9900]/40'
                          }`}
                        onDragOver={(e) => { e.preventDefault(); setDragActive('global-mobile') }}
                        onDragLeave={() => setDragActive(null)}
                        onDrop={(e) => {
                          e.preventDefault(); setDragActive(null);
                          const file = e.dataTransfer.files?.[0];
                          if (file) {
                            setSettings(prev => ({ ...prev, heroMobileUrl: URL.createObjectURL(file) }));
                            setPendingFiles(prev => ({ ...prev, heroMobileImage: file }));
                          }
                        }}
                      >
                        {settings.heroMobileUrl ? (
                          <>
                            <img src={settings.heroMobileUrl} alt="Home Mobile Hero" className="absolute inset-0 w-full h-full object-cover opacity-80" />
                            <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover/global-mobile:opacity-100 transition-opacity">
                              <span className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[9px] font-black uppercase tracking-widest">Change Mobile</span>
                            </div>
                          </>
                        ) : (
                          <div className="text-center space-y-1">
                            <HiPhotograph size={24} className={`mx-auto transition-colors ${dragActive === 'global-mobile' ? 'text-[#ff9900]' : 'text-slate-300'}`} />
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                              {dragActive === 'global-mobile' ? 'Drop Image' : 'Provision Mobile'}
                            </p>
                          </div>
                        )}
                        <input name="heroMobileImage" type="file" accept="image/*" onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setSettings(prev => ({ ...prev, heroMobileUrl: URL.createObjectURL(file) }));
                            setPendingFiles(prev => ({ ...prev, heroMobileImage: file }));
                          }
                        }} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'pages' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-8"
                >
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-6">
                    <div className="space-y-1">
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Page Specific Overrides</h3>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Select a route to customize its identity.</p>
                    </div>
                    <select
                      value={selectedPage}
                      onChange={(e) => setSelectedPage(e.target.value)}
                      className="px-3 py-1.5 border border-gray-200 rounded text-[10px] font-black uppercase tracking-widest outline-none focus:border-[#ff9900] bg-gray-50/50"
                    >
                      <option value="kitchens">Kitchens</option>
                      <option value="bathrooms">Bathrooms</option>
                      <option value="showroom">Showroom</option>
                      <option value="gallery">Gallery Page</option>
                      <option value="products">Products</option>
                      <option value="inventory">Inventory Page</option>
                      <option value="contractors">Contractors</option>
                      <option value="about">About Page</option>
                      <option value="contact">Contact Page</option>
                    </select>
                  </div>

                  {pageLoading ? (
                    <div className="py-20 flex flex-col items-center justify-center gap-4">
                      <HiRefresh className="animate-spin text-slate-200" size={32} />
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Hydrating Cache...</span>
                    </div>
                  ) : (
                    <div className="space-y-10 animate-in fade-in slide-in-from-top-2 duration-500">
                      {/* Hero Section */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <label className="text-[11px] font-black text-slate-500 uppercase tracking-tight">Page Hero (Top Banner)</label>
                            {pageContent?.heroUrl && (
                              <button
                                type="button"
                                onClick={async () => {
                                  if (confirm('Purge hero image?')) {
                                    await deletePageImage(selectedPage, 'hero')
                                    fetchPageContent(selectedPage)
                                  }
                                }}
                                className="text-[9px] font-black text-red-500 uppercase tracking-widest hover:underline"
                              >
                                Purge Hero
                              </button>
                            )}
                          </div>                              <div
                            className={`relative group/hero h-48 border-2 border-dashed rounded-sm flex flex-col items-center justify-center transition-all overflow-hidden ${dragActive === 'hero' ? 'border-[#ff9900] bg-[#ff9900]/5' : 'border-gray-200 bg-slate-50/30 hover:border-[#ff9900]/40'
                              }`}
                            onDragOver={(e) => { e.preventDefault(); setDragActive('hero') }}
                            onDragLeave={() => setDragActive(null)}
                            onDrop={(e) => {
                              e.preventDefault()
                              setDragActive(null)
                              const file = e.dataTransfer.files?.[0]
                              if (file) {
                                setPageContent((prev: any) => ({ ...prev, heroUrl: URL.createObjectURL(file) }));
                                setPendingFiles(prev => ({ ...prev, heroImage: file }));
                              }
                            }}
                          >
                            {pageContent?.heroUrl ? (
                              <>
                                <img src={pageContent.heroUrl} alt="Hero" className="absolute inset-0 w-full h-full object-cover opacity-80" />
                                <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover/hero:opacity-100 transition-opacity">
                                  <span className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[9px] font-black uppercase tracking-widest">Change Image</span>
                                </div>
                              </>
                            ) : (
                              <div className="text-center space-y-2">
                                <HiPhotograph size={28} className={`mx-auto transition-colors ${dragActive === 'hero' ? 'text-[#ff9900]' : 'text-slate-300'}`} />
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                  {dragActive === 'hero' ? 'Drop to Upload' : 'Drag & Drop or Click'}
                                </p>
                              </div>
                            )}
                            <input
                              name="heroImage"
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                  setPageContent((prev: any) => ({ ...prev, heroUrl: URL.createObjectURL(file) }));
                                  setPendingFiles(prev => ({ ...prev, heroImage: file }));
                                }
                              }}
                              className="absolute inset-0 opacity-0 cursor-pointer z-10"
                            />
                          </div>

                          <p className="text-[9px] text-slate-400 font-bold uppercase italic tracking-tighter">Recommended: 2000x800px High-Res Wide (Desktop)</p>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <label className="text-[11px] font-black text-slate-500 uppercase tracking-tight italic">Tablet Hero</label>
                            {pageContent?.heroTabletUrl && (
                              <button
                                type="button"
                                onClick={async () => {
                                  if (confirm('Purge tablet hero?')) {
                                    await deletePageImage(selectedPage, 'heroTablet')
                                    fetchPageContent(selectedPage)
                                  }
                                }}
                                className="text-[9px] font-black text-red-500 uppercase tracking-widest hover:underline"
                              >
                                Purge Tablet
                              </button>
                            )}
                          </div>
                          <div
                            className={`relative group/tablet h-40 border-2 border-dashed rounded-sm flex flex-col items-center justify-center transition-all overflow-hidden ${dragActive === 'tablet' ? 'border-[#ff9900] bg-[#ff9900]/5' : 'border-gray-200 bg-slate-50/30 hover:border-[#ff9900]/40'
                              }`}
                            onDragOver={(e) => { e.preventDefault(); setDragActive('tablet') }}
                            onDragLeave={() => setDragActive(null)}
                            onDrop={(e) => {
                              e.preventDefault()
                              setDragActive(null)
                              const file = e.dataTransfer.files?.[0]
                              if (file) {
                                setPageContent((prev: any) => ({ ...prev, heroTabletUrl: URL.createObjectURL(file) }));
                                setPendingFiles(prev => ({ ...prev, heroTabletImage: file }));
                              }
                            }}
                          >
                            {pageContent?.heroTabletUrl ? (
                              <>
                                <img src={pageContent.heroTabletUrl} alt="Tablet" className="absolute inset-0 w-full h-full object-cover opacity-80" />
                                <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover/tablet:opacity-100 transition-opacity">
                                  <span className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[9px] font-black uppercase tracking-widest">Change Tablet</span>
                                </div>
                              </>
                            ) : (
                              <div className="text-center space-y-2">
                                <HiPhotograph size={24} className={`mx-auto transition-colors ${dragActive === 'tablet' ? 'text-[#ff9900]' : 'text-slate-300'}`} />
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                  {dragActive === 'tablet' ? 'Drop to Upload' : 'Drag & Drop'}
                                </p>
                              </div>
                            )}
                            <input
                              name="heroTabletImage"
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                  setPageContent((prev: any) => ({ ...prev, heroTabletUrl: URL.createObjectURL(file) }));
                                  setPendingFiles(prev => ({ ...prev, heroTabletImage: file }));
                                }
                              }}
                              className="absolute inset-0 opacity-0 cursor-pointer z-10"
                            />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <label className="text-[11px] font-black text-slate-500 uppercase tracking-tight italic">Mobile Hero</label>
                            {pageContent?.heroMobileUrl && (
                              <button
                                type="button"
                                onClick={async () => {
                                  if (confirm('Purge mobile hero?')) {
                                    await deletePageImage(selectedPage, 'heroMobile')
                                    fetchPageContent(selectedPage)
                                  }
                                }}
                                className="text-[9px] font-black text-red-500 uppercase tracking-widest hover:underline"
                              >
                                Purge Mobile
                              </button>
                            )}
                          </div>
                          <div
                            className={`relative group/mobile h-40 border-2 border-dashed rounded-sm flex flex-col items-center justify-center transition-all overflow-hidden ${dragActive === 'mobile' ? 'border-[#ff9900] bg-[#ff9900]/5' : 'border-gray-200 bg-slate-50/30 hover:border-[#ff9900]/40'
                              }`}
                            onDragOver={(e) => { e.preventDefault(); setDragActive('mobile') }}
                            onDragLeave={() => setDragActive(null)}
                            onDrop={(e) => {
                              e.preventDefault()
                              setDragActive(null)
                              const file = e.dataTransfer.files?.[0]
                              if (file) {
                                setPageContent((prev: any) => ({ ...prev, heroMobileUrl: URL.createObjectURL(file) }));
                                setPendingFiles(prev => ({ ...prev, heroMobileImage: file }));
                              }
                            }}
                          >
                            {pageContent?.heroMobileUrl ? (
                              <>
                                <img src={pageContent.heroMobileUrl} alt="Mobile" className="absolute inset-0 w-full h-full object-cover opacity-80" />
                                <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover/mobile:opacity-100 transition-opacity">
                                  <span className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[9px] font-black uppercase tracking-widest">Change Mobile</span>
                                </div>
                              </>
                            ) : (
                              <div className="text-center space-y-2">
                                <HiPhotograph size={24} className={`mx-auto transition-colors ${dragActive === 'mobile' ? 'text-[#ff9900]' : 'text-slate-300'}`} />
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                  {dragActive === 'mobile' ? 'Drop to Upload' : 'Drag & Drop'}
                                </p>
                              </div>
                            )}
                            <input
                              name="heroMobileImage"
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                  setPageContent((prev: any) => ({ ...prev, heroMobileUrl: URL.createObjectURL(file) }));
                                  setPendingFiles(prev => ({ ...prev, heroMobileImage: file }));
                                }
                              }}
                              className="absolute inset-0 opacity-0 cursor-pointer z-10"
                            />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <label className="text-[11px] font-black text-slate-500 uppercase tracking-tight">Content Illustration</label>
                            {pageContent?.contentUrl && (
                              <button
                                type="button"
                                onClick={async () => {
                                  if (confirm('Purge content image?')) {
                                    await deletePageImage(selectedPage, 'content')
                                    fetchPageContent(selectedPage)
                                  }
                                }}
                                className="text-[9px] font-black text-red-500 uppercase tracking-widest hover:underline"
                              >
                                Purge Content
                              </button>
                            )}
                          </div>
                          <div
                            className={`relative group/content aspect-video border-2 border-dashed rounded-sm flex flex-col items-center justify-center transition-all overflow-hidden ${dragActive === 'content' ? 'border-[#ff9900] bg-[#ff9900]/5' : 'border-gray-200 bg-slate-50/30 hover:border-[#ff9900]/40'
                              }`}
                            onDragOver={(e) => { e.preventDefault(); setDragActive('content') }}
                            onDragLeave={() => setDragActive(null)}
                            onDrop={(e) => {
                              e.preventDefault()
                              setDragActive(null)
                              const file = e.dataTransfer.files?.[0]
                              if (file) {
                                setPageContent((prev: any) => ({ ...prev, contentUrl: URL.createObjectURL(file) }));
                                setPendingFiles(prev => ({ ...prev, contentImage: file }));
                              }
                            }}
                          >
                            {pageContent?.contentUrl ? (
                              <>
                                <img src={pageContent.contentUrl} alt="Content" className="absolute inset-0 w-full h-full object-cover opacity-80" />
                                <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover/content:opacity-100 transition-opacity">
                                  <span className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[9px] font-black uppercase tracking-widest">Change Image</span>
                                </div>
                              </>
                            ) : (
                              <div className="text-center space-y-2">
                                <HiPhotograph size={28} className={`mx-auto transition-colors ${dragActive === 'content' ? 'text-[#ff9900]' : 'text-slate-300'}`} />
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                  {dragActive === 'content' ? 'Drop to Upload' : 'Drag & Drop'}
                                </p>
                              </div>
                            )}
                            <input
                              name="contentImage"
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                  setPageContent((prev: any) => ({ ...prev, contentUrl: URL.createObjectURL(file) }));
                                  setPendingFiles(prev => ({ ...prev, contentImage: file }));
                                }
                              }}
                              className="absolute inset-0 opacity-0 cursor-pointer z-10"
                            />
                          </div>
                          <p className="text-[9px] text-slate-400 font-bold uppercase italic tracking-tighter">Recommended: 1200x800px (4:3 or 16:9)</p>
                        </div>
                      </div>

                      <div className="border-t border-gray-100 pt-8 grid grid-cols-1 gap-6">
                        <div className="space-y-4">
                          <div className="p-4 bg-orange-50/30 border border-orange-100 rounded-sm">
                            <label className="text-[11px] font-black text-[#ff9900] uppercase tracking-widest block mb-2">Page-Specific Font Size</label>
                            <select 
                              name="fontSize"
                              defaultValue={pageContent?.fontSize || ''}
                              className="w-full h-10 px-3 border border-gray-300 rounded text-xs font-bold outline-none focus:border-[#ff9900] bg-white shadow-sm"
                              key={`${selectedPage}-fontSize`}
                            >
                              <option value="">Inherit Global (Default)</option>
                              <option value="14px">Small (14px)</option>
                              <option value="16px">Standard (16px)</option>
                              <option value="18px">Medium (18px)</option>
                              <option value="20px">Large (20px)</option>
                              <option value="24px">Extra Large (24px)</option>
                            </select>
                            <p className="text-[9px] text-slate-400 font-bold uppercase mt-2 italic tracking-tighter">Overrides the global site-wide font size for this specific page.</p>
                          </div>

                          <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-500 uppercase tracking-tight italic">Page Headline (H1 Override)</label>
                            <input
                              name="title"
                              defaultValue={pageContent?.title || ''}
                              className="w-full px-4 py-2.5 border border-gray-300 rounded text-xs font-bold outline-none focus:border-[#ff9900] bg-white shadow-sm"
                              placeholder="Catchy Page Title..."
                              key={`${selectedPage}-title`}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-500 uppercase tracking-tight italic">Sub-Headline / Description</label>
                            <textarea
                              name="description"
                              defaultValue={pageContent?.description || ''}
                              rows={4}
                              className="w-full px-4 py-3 border border-gray-300 rounded text-xs font-bold outline-none focus:border-[#ff9900] bg-white shadow-sm resize-none"
                              placeholder="Detailed page description for users and SEO..."
                              key={`${selectedPage}-desc`}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[11px] font-black text-slate-500 uppercase tracking-tight italic">Hero Material Categories (Dot-Separated)</label>
                          <input
                            name="heroText"
                            defaultValue={pageContent?.heroText || ''}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded text-[10px] font-black uppercase tracking-widest outline-none focus:border-[#ff9900] bg-white shadow-sm"
                            placeholder="e.g. TILES • VANITIES • FLOORING"
                            key={`${selectedPage}-tags`}
                          />
                        </div>

                        {selectedPage === 'about' && (
                          <div className="space-y-8 pt-8 border-t border-gray-100 animate-in fade-in slide-in-from-top-4 duration-500">
                             <div className="space-y-3">
                                <label className="text-[11px] font-black text-[#ff9900] uppercase tracking-widest">Our Mission Statement</label>
                                <div className="quill-container rounded-sm border border-gray-200 overflow-hidden shadow-inner">
                                  <ReactQuill 
                                    theme="snow"
                                    value={mission}
                                    onChange={setMission}
                                    modules={quillModules}
                                    className="bg-white"
                                  />
                                </div>
                                <input type="hidden" name="mission" value={mission} />
                             </div>

                             <div className="space-y-3">
                                <label className="text-[11px] font-black text-[#ff9900] uppercase tracking-widest">Our Vision Statement</label>
                                <div className="quill-container rounded-sm border border-gray-200 overflow-hidden shadow-inner">
                                  <ReactQuill 
                                    theme="snow"
                                    value={vision}
                                    onChange={setVision}
                                    modules={quillModules}
                                    className="bg-white"
                                  />
                                </div>
                                <input type="hidden" name="vision" value={vision} />
                             </div>

                             <div className="space-y-3">
                                <label className="text-[11px] font-black text-[#ff9900] uppercase tracking-widest">Our Story (Full Narrative)</label>
                                <div className="quill-container rounded-sm border border-gray-200 overflow-hidden shadow-inner">
                                  <ReactQuill 
                                    theme="snow"
                                    value={story}
                                    onChange={setStory}
                                    modules={quillModules}
                                    className="bg-white"
                                  />
                                </div>
                                <input type="hidden" name="story" value={story} />
                             </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'footer' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-gray-100 pb-3 mb-6">Legal & Footer Content</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-slate-500 uppercase">Footer Button Label</label>
                      <input name="footerBtnText" value={settings.footerBtnText} onChange={handleChange} type="text" className="w-full px-3 py-2 border border-gray-300 rounded text-xs font-bold outline-none focus:border-[#ff9900]" placeholder="e.g. Plan Your Visit" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-slate-500 uppercase">Footer Button Destination (URL)</label>
                      <input name="footerBtnLink" value={settings.footerBtnLink} onChange={handleChange} type="text" className="w-full px-3 py-2 border border-gray-300 rounded text-xs font-bold outline-none focus:border-[#ff9900]" placeholder="e.g. /contact" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-500 uppercase">Copyright Text</label>
                    <textarea name="footerText" value={settings.footerText} onChange={handleChange} rows={5} className="w-full px-3 py-2 border border-gray-300 rounded text-xs font-bold outline-none focus:border-[#ff9900] resize-none leading-relaxed" />
                  </div>
                </motion.div>
              )}

              {activeTab === 'social' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-6">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Social Media Links</h3>
                    <button
                      type="button"
                      onClick={() => { setEditingSocial(null); setIsSocialModalOpen(true); }}
                      className="px-4 py-1.5 bg-[#232f3e] text-white text-[10px] font-black uppercase tracking-widest rounded hover:bg-slate-900 transition-all flex items-center gap-2"
                    >
                      <HiPlus size={14} /> Add Social Link
                    </button>
                  </div>

                  <div className="space-y-3">
                    {socialLinks.length > 0 ? socialLinks.map((link) => {
                      const Icon = link.platform === 'facebook' ? FaFacebook :
                        link.platform === 'instagram' ? FaInstagram :
                          link.platform === 'tiktok' ? FaTiktok :
                            link.platform === 'linkedin' ? FaLinkedin :
                              link.platform === 'youtube' ? FaYoutube : FaShareAlt

                      return (
                        <div key={link.id} className="p-4 border border-gray-100 bg-gray-50/50 rounded flex items-center justify-between hover:border-gray-200 transition-all group">
                          <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded bg-white border border-gray-100 flex items-center justify-center text-slate-800">
                              <Icon size={16} />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[11px] font-black uppercase tracking-widest text-slate-900">{link.platform}</span>
                              <span className="text-[10px] text-slate-400 font-bold font-mono truncate max-w-[200px]">{link.url}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              type="button"
                              onClick={() => { setEditingSocial(link); setIsSocialModalOpen(true); }}
                              className="p-2 border border-gray-200 hover:bg-white rounded transition-all"
                            >
                              <HiPencil size={14} className="text-slate-400 hover:text-slate-900" />
                            </button>
                            <button
                              type="button"
                              onClick={async () => {
                                if (confirm('Delete this social link?')) {
                                  await deleteSocialLink(link.id)
                                  fetchSocialLinks()
                                }
                              }}
                              className="p-2 border border-gray-200 hover:bg-white rounded transition-all"
                            >
                              <HiTrash size={14} className="text-slate-400 hover:text-red-600" />
                            </button>
                          </div>
                        </div>
                      )
                    }) : (
                      <div className="py-12 text-center border-2 border-dashed border-gray-100 rounded">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No social links added yet</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === 'gallery-imgs' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-6">
                    <div className="space-y-1">
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Gallery Portfolio Management</h3>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight italic">Manage multi-category images for your public portfolio.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setEditingGallery(null); setPendingFiles({}); setIsGalleryModalOpen(true); }}
                      className="px-4 py-1.5 bg-[#232f3e] text-white text-[10px] font-black uppercase tracking-widest rounded hover:bg-slate-900 transition-all flex items-center gap-2"
                    >
                      <HiPlus size={14} /> Add Image
                    </button>
                  </div>

                  {galleryLoading ? (
                    <div className="py-20 flex flex-col items-center justify-center gap-4">
                      <HiRefresh className="animate-spin text-slate-200" size={32} />
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Scanning Storage...</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                      {galleryImages.length > 0 ? galleryImages.map((img: any) => (
                        <div key={img.id} className="group relative aspect-square bg-slate-50 border border-gray-100 rounded overflow-hidden hover:border-[#ff9900]/40 transition-all shadow-sm">
                          <img src={img.url} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700" alt={img.title} />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end gap-2">
                            <div className="flex flex-col">
                              <span className="text-[10px] font-black text-white uppercase truncate">{img.title || 'Untitled Image'}</span>
                              <span className="text-[9px] font-bold text-[#ff9900] uppercase tracking-widest">{img.category}</span>
                            </div>
                            <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                              <button
                                type="button"
                                onClick={() => { setEditingGallery(img); setPendingFiles({}); setIsGalleryModalOpen(true); }}
                                className="flex-1 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white py-1.5 text-[9px] font-black uppercase rounded"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={async () => {
                                  if (confirm('Purge this image?')) {
                                    const res = await deleteGalleryImage(img.id)
                                    if (res.success) fetchGalleryImages()
                                    else alert(res.error)
                                  }
                                }}
                                className="flex-1 bg-red-500/20 hover:bg-red-500/40 backdrop-blur-md border border-red-500/30 text-red-200 py-1.5 text-[9px] font-black uppercase rounded"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                          <div className="absolute top-2 left-2 px-2 py-0.5 bg-white/80 backdrop-blur-md border border-gray-100 rounded text-[8px] font-black uppercase tracking-tighter text-slate-900">
                            #{img.order}
                          </div>
                        </div>
                      )) : (
                        <div className="col-span-full py-16 text-center border-2 border-dashed border-gray-100 rounded">
                          <HiPhotograph size={40} className="mx-auto text-slate-100 mb-4" />
                          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Portfoilo is empty</p>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'product-categories' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6 px-10 py-12"
                >
                  <div className="flex items-center justify-between border-b border-gray-100 pb-6">
                    <div className="space-y-1">
                      <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                        <MdCategory className="text-[#ff9900]" size={18} />
                        Product Classifications
                      </h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Manage dynamic product categories and specifications.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setEditingCategory(null); setIsCategoryModalOpen(true); setCategoryDesc(''); }}
                      className="px-6 py-2 bg-[#232f3e] text-white text-[10px] font-black uppercase tracking-widest rounded hover:bg-slate-900 transition-all flex items-center gap-2 shadow-md hover:shadow-[#232f3e]/20"
                    >
                      <HiPlus size={14} /> Global Taxonomy +
                    </button>
                  </div>

                  <div className="space-y-4">
                    {productCategories.length > 0 ? productCategories.map((cat) => (
                      <div key={cat.id} className="p-6 bg-white border border-gray-100 rounded-sm flex items-center justify-between gap-6 hover:border-[#ff9900]/30 transition-all group shadow-sm hover:shadow-md">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-4">
                            <span className="w-8 h-8 bg-slate-50 border border-slate-100 flex items-center justify-center text-[10px] font-black text-slate-900 rounded-sm">
                              #{cat.order}
                            </span>
                            <div className="space-y-0.5">
                              <h4 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-3">
                                {cat.title}
                                {cat.color && (
                                  <span className="w-3 h-3 rounded-full border border-gray-200" style={{ backgroundColor: cat.color }} />
                                )}
                              </h4>
                              {cat.subtitle && <p className="text-[10px] font-bold text-[#ff9900] uppercase tracking-widest">{cat.subtitle}</p>}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 opacity-10 md:opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <button
                            type="button"
                            onClick={() => { setEditingCategory(cat); setIsCategoryModalOpen(true); setCategoryDesc(cat.desc); }}
                            className="p-2 border border-gray-200 hover:bg-[#ff9900]/10 hover:border-[#ff9900]/30 rounded transition-all group/btn"
                          >
                            <HiPencil size={14} className="text-slate-400 group-hover/btn:text-[#ff9900]" />
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              if (confirm('Delete this entire category taxonomy?')) {
                                const res = await deleteProductCategory(cat.id)
                                if (res.success) fetchProductCategories()
                              }
                            }}
                            className="p-2 border border-gray-200 hover:bg-red-50 hover:border-red-100 rounded transition-all group/btn"
                          >
                            <HiTrash size={14} className="text-slate-400 group-hover/btn:text-red-500" />
                          </button>
                        </div>
                      </div>
                    )) : (
                      <div className="py-24 text-center border-2 border-dashed border-gray-50 rounded bg-slate-50/30">
                        <MdCategory size={40} className="mx-auto text-slate-200 mb-4" />
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">No product categories verified in master database.</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>

            {activeTab !== 'social' && activeTab !== 'gallery-imgs' && (
              <div className="px-8 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-4">
                <button disabled={isLoading || isSaving} type="button" onClick={fetchSettings} className="px-4 py-2 text-[10px] font-black text-slate-600 hover:underline uppercase tracking-widest disabled:opacity-50">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving || isLoading}
                  className="flex items-center gap-2 px-8 py-2 bg-[#ff9900] text-[#232f3e] text-[11px] font-black uppercase tracking-widest rounded shadow-sm hover:bg-[#e68a00] transition-all active:scale-95 disabled:opacity-70"
                >
                  {isSaving ? <HiRefresh className="animate-spin" size={16} /> : <HiOutlineSave size={16} />}
                  {isSaving ? 'Syncing...' : 'Save Configuration'}
                </button>
              </div>
            )}
          </form>
        </div>

        {/* SDW Resource View */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#232f3e] text-white p-8 rounded-sm shadow-xl relative overflow-hidden group border border-white/5">
            <div className="relative z-10 space-y-6">
              <div className="space-y-1">
                <h4 className="text-[10px] font-black tracking-[0.2em] uppercase text-[#ff9900]">System Info</h4>
                <h3 className="text-sm font-bold leading-tight">Master System Console</h3>
              </div>
              <p className="text-[11px] text-slate-400 font-bold leading-relaxed uppercase tracking-tight">
                Any modifications to site settings will propagate across the warehouse system immediately.
              </p>
              <div className="space-y-3 pt-6 border-t border-white/10">
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-300">
                  <span>System Status</span>
                  <span className="text-green-500">Active</span>
                </div>
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-300">
                  <span>Build Version</span>
                  <span>SDW-4.1.0</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-sm p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-3 text-[10px] font-black text-slate-900 uppercase tracking-widest">
              <div className="w-7 h-7 rounded bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                <HiLocationMarker size={16} />
              </div>
              Site Snapshot
            </div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight leading-relaxed">
              Site identity is currently set to: <br />
              <span className="text-[#ff9900]">{settings.siteName}</span>
            </p>
            <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
              <span className="text-[9px] font-black text-slate-400 uppercase">Server Response</span>
              <span className="text-[10px] font-black text-green-600">Fast (8ms)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Social Endpoint Modal */}
      <AnimatePresence>
        {isSocialModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm shadow-2xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="bg-white w-full max-w-sm border border-gray-200 rounded shadow-2xl overflow-hidden"
            >
              <div className="bg-[#232f3e] text-white px-6 py-4 flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-widest">{editingSocial ? 'Edit Social Link' : 'Add Social Link'}</h2>
                <button onClick={() => setIsSocialModalOpen(false)} className="p-1 hover:bg-white/10 rounded">
                  <HiX size={18} />
                </button>
              </div>

              <form onSubmit={async (e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                if (editingSocial) formData.append('id', editingSocial.id)
                formData.append('isActive', 'true')

                const result = await upsertSocialLink(formData)
                if (result.success) {
                  setIsSocialModalOpen(false)
                  fetchSocialLinks()
                } else {
                  alert(result.error)
                }
              }} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-500 uppercase">Target Platform</label>
                  <select
                    name="platform"
                    defaultValue={editingSocial?.platform || 'facebook'}
                    className="w-full h-10 px-3 border border-gray-300 rounded text-xs font-bold uppercase outline-none focus:border-[#ff9900]"
                  >
                    <option value="facebook">Facebook</option>
                    <option value="instagram">Instagram</option>
                    <option value="tiktok">TikTok</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="youtube">YouTube</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-500 uppercase">Profile Link (URL)</label>
                  <input
                    name="url"
                    defaultValue={editingSocial?.url}
                    placeholder="https://..."
                    className="w-full h-10 px-3 border border-gray-300 rounded text-xs font-bold outline-none focus:border-[#ff9900]"
                  />
                </div>
                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => setIsSocialModalOpen(false)} className="flex-1 py-2 text-[10px] font-black text-slate-400 hover:text-slate-900 uppercase tracking-widest">Cancel</button>
                  <button type="submit" className="flex-[2] py-2 bg-[#ff9900] text-[#232f3e] font-black text-[10px] uppercase tracking-widest rounded shadow hover:bg-[#e68a00] transition-all">Save Link</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Gallery Image Modal */}
      <AnimatePresence>
        {isGalleryModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm shadow-2xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="bg-white w-full max-w-md border border-gray-200 rounded shadow-2xl overflow-hidden"
            >
              <div className="bg-[#232f3e] text-white px-6 py-4 flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-widest">{editingGallery ? 'Edit Gallery Image' : 'Add Gallery Image'}</h2>
                <button onClick={() => { setIsGalleryModalOpen(false); setEditingGallery(null); setPendingFiles({}); }} className="p-1 hover:bg-white/10 rounded">
                  <HiX size={18} />
                </button>
              </div>

              <form onSubmit={async (e) => {
                e.preventDefault()
                setIsSaving(true)
                const formData = new FormData(e.currentTarget)
                if (editingGallery) formData.append('id', editingGallery.id)

                // Add pending image if exists
                if (pendingFiles['galleryImg']) {
                  formData.set('image', pendingFiles['galleryImg'])
                }

                formData.append('isActive', 'true')

                const result = editingGallery
                  ? await updateGalleryImage(editingGallery.id, formData)
                  : await createGalleryImage(formData)

                if (result.success) {
                  setIsGalleryModalOpen(false)
                  fetchGalleryImages()
                  setEditingGallery(null)
                  setPendingFiles({})
                } else {
                  alert(result.error)
                }
                setIsSaving(false)
              }} className="p-8 space-y-6 max-h-[90vh] overflow-y-auto">

                <div className="space-y-4">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-tight">Gallery Image Asset</label>
                  <div className="relative h-48 border-2 border-dashed border-gray-200 rounded bg-slate-50/30 flex flex-col items-center justify-center overflow-hidden group">
                    {(editingGallery?.url || pendingFiles['galleryImg']) ? (
                      <img
                        src={pendingFiles['galleryImg'] ? URL.createObjectURL(pendingFiles['galleryImg']) : editingGallery.url}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center space-y-2">
                        <HiPhotograph size={32} className="mx-auto text-slate-200" />
                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Select Visual Asset</p>
                      </div>
                    )}
                    <input
                      type="file"
                      name="image"
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) setPendingFiles(prev => ({ ...prev, galleryImg: file }))
                      }}
                    />
                    {(editingGallery?.url || pendingFiles['galleryImg']) && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">Replace Content</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-500 uppercase">Image Title</label>
                    <input name="title" defaultValue={editingGallery?.title} className="w-full h-10 px-3 border border-gray-300 rounded text-xs font-bold outline-none focus:border-[#ff9900]" placeholder="Portfolio Title..." />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-500 uppercase">Category</label>
                    <select name="category" defaultValue={editingGallery?.category || 'general'} className="w-full h-10 px-3 border border-gray-300 rounded text-xs font-bold uppercase outline-none focus:border-[#ff9900]">
                      <option value="general">General</option>
                      <option value="kitchen">Kitchen</option>
                      <option value="bathroom">Bathroom</option>
                      <option value="showroom">Showroom</option>
                      <option value="flooring">Flooring</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-500 uppercase">Narrative Description</label>
                  <textarea name="description" defaultValue={editingGallery?.description} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded text-xs font-bold outline-none focus:border-[#ff9900]" placeholder="Brief context for this image..." />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-500 uppercase">Sort Priority (Order)</label>
                  <input name="order" type="number" defaultValue={editingGallery?.order || 0} className="w-full h-10 px-3 border border-gray-300 rounded text-xs font-bold outline-none focus:border-[#ff9900]" />
                </div>

                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => { setIsGalleryModalOpen(false); setEditingGallery(null); setPendingFiles({}); }} className="flex-1 py-2 text-[10px] font-black text-slate-400 hover:text-slate-900 uppercase tracking-widest">Cancel</button>
                  <button type="submit" disabled={isSaving} className="flex-[2] py-2 bg-[#ff9900] text-[#232f3e] font-black text-[10px] uppercase tracking-widest rounded shadow hover:bg-[#e68a00] transition-all disabled:opacity-50">
                    {isSaving ? (
                      <span className="flex items-center justify-center gap-2">
                        <HiRefresh className="animate-spin" size={14} /> Synchronizing...
                      </span>
                    ) : 'Commit to Portfolio'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Product Category Mutation Modal */}
      <AnimatePresence>
        {isCategoryModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm shadow-2xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="bg-white w-full max-w-2xl border border-gray-200 rounded shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="bg-[#232f3e] text-white px-6 py-4 flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-widest">{editingCategory ? 'Modify Taxonomy Unit' : 'Define New Category'}</h2>
                <button onClick={() => setIsCategoryModalOpen(false)} className="p-1 hover:bg-white/10 rounded">
                  <HiX size={18} />
                </button>
              </div>

              <form onSubmit={async (e) => {
                e.preventDefault()
                setIsSaving(true)
                const formData = new FormData(e.currentTarget)
                if (editingCategory) formData.append('id', editingCategory.id)
                formData.set('desc', categoryDesc)
                
                const res = await upsertProductCategory(formData)
                if (res.success) {
                  setIsCategoryModalOpen(false)
                  fetchProductCategories()
                } else {
                  alert(res.error)
                }
                setIsSaving(false)
              }} className="p-8 space-y-6 flex-1 overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Main Title</label>
                    <input name="title" defaultValue={editingCategory?.title} className="w-full h-10 px-3 border border-gray-300 rounded text-xs font-bold outline-none focus:border-[#ff9900]" placeholder="Wood Products..." required />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Subtitle / Headline</label>
                    <input name="subtitle" defaultValue={editingCategory?.subtitle} className="w-full h-10 px-3 border border-gray-300 rounded text-xs font-bold outline-none focus:border-[#ff9900]" placeholder="Natural Materials..." />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Narrative Content (Supports Rich Styles)</label>
                  <div className="border border-gray-300 rounded overflow-hidden">
                    <ReactQuill theme="snow" value={categoryDesc} onChange={setCategoryDesc} modules={quillModules} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Material Benefits (One per line)</label>
                    <textarea name="benefits" defaultValue={editingCategory?.benefits.join('\n')} rows={5} className="w-full p-3 border border-gray-300 rounded text-xs font-medium outline-none focus:border-[#ff9900]" placeholder="Strong and durable..." />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Common Uses (One per line)</label>
                    <textarea name="uses" defaultValue={editingCategory?.uses.join('\n')} rows={5} className="w-full p-3 border border-gray-300 rounded text-xs font-medium outline-none focus:border-[#ff9900]" placeholder="Hardwood flooring..." />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Accent Color (Hex)</label>
                    <div className="flex gap-2">
                       <input name="color" type="color" defaultValue={editingCategory?.color || '#a68966'} className="w-10 h-10 border border-gray-300 rounded p-1" />
                       <input name="color_text" value={editingCategory?.color || '#a68966'} disabled className="flex-1 h-10 px-3 border border-gray-300 rounded text-xs font-bold bg-gray-50 opacity-50" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sort Priority</label>
                    <input name="order" type="number" defaultValue={editingCategory?.order || 0} className="w-full h-10 px-3 border border-gray-300 rounded text-xs font-bold outline-none focus:border-[#ff9900]" />
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100 flex gap-4">
                  <button type="button" onClick={() => setIsCategoryModalOpen(false)} className="flex-1 py-3 text-[10px] font-black text-slate-400 hover:text-slate-900 uppercase tracking-widest">Abort Action</button>
                  <button type="submit" disabled={isSaving} className="flex-[2] py-3 bg-[#ff9900] text-[#232f3e] font-black text-[11px] uppercase tracking-widest rounded shadow-xl hover:bg-[#e68a00] transition-all disabled:opacity-50">
                    {isSaving ? 'Synchronizing Taxonomy...' : 'Commit Category to System'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <style jsx global>{`
        .ql-toolbar.ql-snow {
            border: none !important;
            background: #f8fafc !important;
            padding: 0.75rem !important;
            border-bottom: 1px solid #e2e8f0 !important;
        }
        .ql-container.ql-snow {
            border: none !important;
            font-family: 'Arial', sans-serif !important;
            font-size: 13px !important;
        }
        .ql-editor {
            padding: 1.5rem !important;
            min-height: 200px !important;
        }
        .ql-editor.ql-blank::before {
          font-style: normal !important;
          color: #94a3b8 !important;
          font-size: 12px !important;
        }
      `}</style>
    </div>
  )
}

export default SiteContentPage

