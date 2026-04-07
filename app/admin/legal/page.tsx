'use client'
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiOutlineDocumentText, HiOutlineQuestionMarkCircle, HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiCheckCircle, HiXCircle, HiRefresh, HiShieldCheck, HiX, HiPlus } from 'react-icons/hi'
import { getFAQs, upsertFAQ, deleteFAQ, getLegalPage, updateLegalPage, type FAQ, type LegalPage } from '@/lib/actions'
import dynamic from 'next/dynamic'
import 'react-quill-new/dist/quill.snow.css'

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false })

const AdminLegalPage = () => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'faq'>('privacy')
  const [isLoading, setIsLoading] = useState(false)
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null)
  
  // Legal Page States
  const [legalData, setLegalData] = useState<LegalPage | { title: string, content: string, slug: string }>({ title: '', content: '', slug: '' })
  
  // FAQ States
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null)
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false)

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 3000)
  }

  const fetchLegal = async (slug: string) => {
    setIsLoading(true)
    const data = await getLegalPage(slug)
    if (data) setLegalData(data)
    setIsLoading(false)
  }

  const fetchFaqs = async () => {
    setIsLoading(true)
    const data = await getFAQs()
    setFaqs(data)
    setIsLoading(false)
  }

  useEffect(() => {
    if (activeTab === 'faq') {
      fetchFaqs()
    } else {
      fetchLegal(activeTab)
    }
  }, [activeTab])

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['clean']
    ],
  }

  const handleLegalUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    const formData = new FormData(e.target as HTMLFormElement)
    formData.append('slug', activeTab)
    const result = await updateLegalPage(formData)
    if (result.success) {
      showNotification('success', `${activeTab === 'privacy' ? 'Privacy Policy' : 'Terms'} document updated successfully`)
    } else {
      showNotification('error', result.error || 'Update failed')
    }
    setIsLoading(false)
  }

  const handleFaqSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    const formData = new FormData(e.target as HTMLFormElement)
    if (editingFaq) formData.append('id', editingFaq.id)
    
    const result = await upsertFAQ(formData)
    if (result.success) {
      showNotification('success', editingFaq ? 'FAQ entry updated' : 'FAQ entry added')
      setIsFaqModalOpen(false)
      setEditingFaq(null)
      fetchFaqs()
    } else {
      showNotification('error', result.error || 'Operation failed')
    }
    setIsLoading(false)
  }

  const handleDeleteFaq = async (id: string) => {
    if (confirm('Permanently delete this FAQ entry?')) {
      setIsLoading(true)
      const result = await deleteFAQ(id)
      if (result.success) {
        showNotification('success', 'FAQ entry removed')
        fetchFaqs()
      } else {
        showNotification('error', result.error || 'Deletion failed')
      }
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6 font-[arial] animate-in fade-in duration-500 pb-20">
      
      {/* Header */}
      <div className="bg-white border border-gray-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm rounded-sm">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
             Documentation & FAQ
             <span className="text-[10px] font-black text-slate-400 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded uppercase font-mono">SDW-Docs-v1</span>
          </h2>
          <p className="text-xs font-medium text-slate-500">Manage site documentation, legal policies, and the FAQ center.</p>
        </div>
        
        {notification && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`px-4 py-2 rounded text-[10px] font-black uppercase tracking-widest border shadow-sm flex items-center gap-2 ${notification.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}
          >
            {notification.type === 'success' ? <HiCheckCircle size={16} /> : <HiXCircle size={16} />}
            {notification.message}
          </motion.div>
        )}
      </div>

   
      <div className="flex border-b border-gray-200 overflow-x-auto whitespace-nowrap scrollbar-hide bg-white px-6 shadow-sm">
        <button 
          onClick={() => setActiveTab('privacy')}
          className={`px-8 py-4 text-[11px] font-bold uppercase tracking-widest transition-all border-b-2 ${activeTab === 'privacy' ? 'border-[#ff9900] text-[#ff9900] bg-orange-50/10' : 'border-transparent text-gray-500 hover:text-slate-900 hover:bg-gray-50'}`}
        >
          Privacy Policy
        </button>
        <button 
          onClick={() => setActiveTab('faq')}
          className={`px-8 py-4 text-[11px] font-bold uppercase tracking-widest transition-all border-b-2 ${activeTab === 'faq' ? 'border-[#ff9900] text-[#ff9900] bg-orange-50/10' : 'border-transparent text-gray-500 hover:text-slate-900 hover:bg-gray-50'}`}
        >
          Support & FAQ Center
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-12">
          <div className="bg-white border border-gray-200 shadow-sm rounded-sm overflow-hidden relative min-h-[500px]">
            {isLoading && (
              <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] z-50 flex items-center justify-center">
                 <div className="w-8 h-8 border-3 border-slate-200 border-t-[#ff9900] rounded-full animate-spin" />
              </div>
            )}

            <div className="p-8">
              <AnimatePresence mode="wait">
                {activeTab !== 'faq' ? (
                  <motion.form 
                    key={activeTab}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onSubmit={handleLegalUpdate}
                    className="space-y-8"
                  >
                    <div className="grid grid-cols-1 gap-6">
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-tight">Document Title</label>
                        <input 
                          name="title"
                          type="text" 
                          value={legalData.title}
                          onChange={(e) => setLegalData({...legalData, title: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded text-xs font-bold outline-none focus:border-[#ff9900]"
                          placeholder="Policy Name"
                          required
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-tight">Document Content</label>
                        <div className="quill-container rounded-sm border border-gray-200 overflow-hidden shadow-inner">
                          <ReactQuill 
                            theme="snow"
                            value={legalData.content}
                            onChange={(content) => setLegalData({...legalData, content})}
                            modules={quillModules}
                            className="bg-white"
                            style={{ height: '500px' }}
                          />
                        </div>
                        <input type="hidden" name="content" value={legalData.content} />
                      </div>
                    </div>

                    <div className="flex justify-end pt-8 border-t border-gray-100">
                      <button 
                        type="submit"
                        className="px-8 py-3 bg-[#ff9900] text-[#232f3e] font-black text-[11px] uppercase tracking-widest rounded shadow-sm hover:bg-[#e68a00] transition-all flex items-center gap-2"
                      >
                        <HiShieldCheck size={16} /> Save Documentation
                      </button>
                    </div>
                  </motion.form>
                ) : (
                  <motion.div 
                    key="faq-list"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Frequently Asked Questions</h3>
                      <button 
                        onClick={() => { setEditingFaq(null); setIsFaqModalOpen(true); }}
                        className="px-4 py-1.5 bg-[#232f3e] text-white text-[10px] font-black uppercase tracking-widest rounded hover:bg-slate-900 transition-all flex items-center gap-2 shadow-sm"
                      >
                        <HiPlus size={14} /> Add FAQ Entry
                      </button>
                    </div>

                    <div className="space-y-4">
                      {faqs.length > 0 ? faqs.map((faq) => (
                        <div key={faq.id} className="p-5 bg-gray-50/50 border border-gray-100 rounded flex items-start justify-between gap-6 hover:border-gray-300 transition-all group">
                          <div className="space-y-3 flex-1">
                            <div className="flex items-center gap-3">
                                <span className="bg-white border border-gray-200 text-slate-900 w-7 h-7 rounded flex items-center justify-center text-[10px] font-black">{faq.order}</span>
                                <h4 className="text-sm font-bold text-slate-900 tracking-tight">{faq.question}</h4>
                            </div>
                            <p className="text-xs text-slate-500 font-medium leading-relaxed pl-10 border-l border-gray-200">{faq.answer}</p>
                          </div>
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => { setEditingFaq(faq); setIsFaqModalOpen(true); }}
                              className="p-2 border border-gray-200 hover:bg-white rounded transition-all"
                            >
                              <HiOutlinePencil size={14} className="text-slate-400 hover:text-slate-900 shadow-sm" />
                            </button>
                            <button 
                              onClick={() => handleDeleteFaq(faq.id)}
                              className="p-2 border border-gray-200 hover:bg-white rounded transition-all"
                            >
                              <HiOutlineTrash size={14} className="text-slate-400 hover:text-red-600 shadow-sm" />
                            </button>
                          </div>
                        </div>
                      )) : (
                        <div className="py-20 text-center bg-gray-50/50 rounded border-2 border-dashed border-gray-100 italic">
                          <p className="text-slate-300 font-bold text-[10px] uppercase tracking-widest">No FAQ entries found in the archive.</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Configuration Drawer (SDW style) */}
      <AnimatePresence>
        {isFaqModalOpen && (
          <div className="fixed inset-0 z-[100] flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFaqModalOpen(false)}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-xl bg-white h-full shadow-2xl flex flex-col"
            >
              <div className="bg-[#232f3e] text-white px-6 py-4 flex items-center justify-between">
                <h2 className="text-sm font-bold tracking-wider uppercase">{editingFaq ? 'Edit FAQ Entry' : 'Add FAQ Entry'}</h2>
                <button onClick={() => setIsFaqModalOpen(false)} className="p-1 hover:bg-white/10 rounded">
                    <HiX size={20} />
                 </button>
              </div>

              <form onSubmit={handleFaqSubmit} className="p-8 space-y-6 flex-1 overflow-y-auto">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-tight">Question</label>
                  <input 
                    name="question"
                    defaultValue={editingFaq?.question}
                    className="w-full px-4 py-2 border border-gray-300 rounded text-xs font-bold outline-none focus:border-[#ff9900]"
                    placeholder="e.g. Lead Times"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-tight">Answer</label>
                  <textarea 
                    name="answer"
                    defaultValue={editingFaq?.answer}
                    className="w-full h-40 p-4 border border-gray-300 rounded text-xs font-medium leading-relaxed outline-none focus:border-[#ff9900] resize-none"
                    placeholder="Provide the answer to the question..."
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-tight">Display Order</label>
                  <input 
                    name="order"
                    type="number"
                    defaultValue={editingFaq?.order || 0}
                    className="w-full px-4 py-2 border border-gray-300 rounded text-xs font-bold outline-none focus:border-[#ff9900]"
                    required
                  />
                </div>
              </form>

              <div className="bg-gray-50 border-t border-gray-200 p-6 flex justify-end gap-4">
                 <button type="button" onClick={() => setIsFaqModalOpen(false)} className="px-5 py-2 text-xs font-bold text-slate-600 hover:underline uppercase tracking-widest">Abort Action</button>
                 <button type="submit" onClick={(e) => {
                     // Trigger form submit manually since button is outside if we wanted, 
                     // but here it's inside the flex-col root
                 }}
                 className="px-8 py-2 bg-[#ff9900] text-[#232f3e] font-black text-[11px] uppercase tracking-widest rounded shadow-sm hover:bg-[#e68a00]"
                 >
                   Save FAQ Entry
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .ql-toolbar.ql-snow {
            border: none !important;
            background: #f8fafc !important;
            padding: 1rem !important;
            border-bottom: 1px solid #e2e8f0 !important;
        }
        .ql-container.ql-snow {
            border: none !important;
            font-family: 'Arial', sans-serif !important;
            font-size: 13px !important;
        }
        .ql-editor {
            padding: 1.5rem !important;
            min-height: 400px !important;
        }
      `}</style>
    </div>
  )
}

export default AdminLegalPage
