"use client"
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiOutlineTrash, HiOutlineMail, HiOutlinePhone, HiOutlineCalendar, HiOutlineViewList, HiCheckCircle, HiXCircle, HiRefresh, HiSearch, HiX, HiChevronRight } from 'react-icons/hi'
import { 
  getQuoteRequests, 
  deleteQuoteRequest, 
  updateQuoteStatus, 
  deleteMultipleQuoteRequests, 
  deleteAllQuoteRequests,
  getLeads,
  updateLeadStatus,
  deleteLead
} from '@/lib/actions'
import { useSearch } from '@/context/SearchContext'

const QuotesPage = () => {
  const [quotes, setQuotes] = useState<any[]>([])
  const [leads, setLeads] = useState<any[]>([])
  const [activeView, setActiveView] = useState<'quotes' | 'leads'>('quotes')
  const { searchTerm } = useSearch()
  const [isLoading, setIsLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [selectedQuote, setSelectedQuote] = useState<any | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    type: 'danger' | 'warning';
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    type: 'danger'
  })

  const fetchData = async () => {
    setIsLoading(true)
    const [quotesData, leadsData] = await Promise.all([
      getQuoteRequests(),
      getLeads()
    ])
    setQuotes(quotesData)
    setLeads(leadsData)
    setIsLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleDelete = async (id: string, type: 'quote' | 'lead' = 'quote') => {
    const isQuote = type === 'quote'
    setConfirmModal({
      isOpen: true,
      title: isQuote ? 'Terminate Inquiry Node' : 'Expunge Lead Entry',
      message: isQuote 
        ? 'Are you sure you want to permanently delete this inquiry? This action cannot be undone.' 
        : 'Are you sure you want to permanently remove this lead from the priority queue?',
      type: 'danger',
      onConfirm: async () => {
        setDeletingId(id)
        const result = isQuote ? await deleteQuoteRequest(id) : await deleteLead(id)
        if (result.success) {
          if (isQuote) {
            setQuotes(quotes.filter(q => q.id !== id))
          } else {
            setLeads(leads.filter(l => l.id !== id))
          }
        } else {
          alert(result.error)
        }
        setDeletingId(id === deletingId ? null : deletingId)
        setConfirmModal(prev => ({ ...prev, isOpen: false }))
      }
    })
  }

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    setIsLoading(true)
    const result = activeView === 'quotes' 
      ? await updateQuoteStatus(id, newStatus)
      : await updateLeadStatus(id, newStatus)
      
    if (result.success) {
      if (activeView === 'quotes') {
        setQuotes(quotes.map(q => q.id === id ? { ...q, status: newStatus } : q))
        if (selectedQuote?.id === id) {
          setSelectedQuote({ ...selectedQuote, status: newStatus })
        }
      } else {
        setLeads(leads.map(l => l.id === id ? { ...l, status: newStatus } : l))
      }
    } else {
      alert(result.error)
    }
    setIsLoading(false)
  }

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return
    setConfirmModal({
      isOpen: true,
      title: `Bulk Termination (${selectedIds.length})`,
      message: `Are you sure you want to delete ${selectedIds.length} selected inquiries? All data will be permanently removed.`,
      type: 'danger',
      onConfirm: async () => {
        setIsLoading(true)
        const result = await deleteMultipleQuoteRequests(selectedIds)
        if (result.success) {
          setQuotes(quotes.filter(q => !selectedIds.includes(q.id)))
          setSelectedIds([])
        } else {
          alert(result.error)
        }
        setIsLoading(false)
        setConfirmModal(prev => ({ ...prev, isOpen: false }))
      }
    })
  }

  const handleDeleteAll = async () => {
    setConfirmModal({
      isOpen: true,
      title: 'CRITICAL: Clear All Records',
      message: 'This will permanently wipe the ENTIRE inquiry archive. This action is irreversible and requires Master Admin confirmation.',
      type: 'danger',
      onConfirm: async () => {
        setIsLoading(true)
        const result = await deleteAllQuoteRequests()
        if (result.success) {
          setQuotes([])
          setSelectedIds([])
        } else {
          alert(result.error)
        }
        setIsLoading(false)
        setConfirmModal(prev => ({ ...prev, isOpen: false }))
      }
    })
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === (filteredQuotes?.length || 0)) {
      setSelectedIds([])
    } else {
      setSelectedIds(filteredQuotes.map(q => q.id))
    }
  }

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id))
    } else {
      setSelectedIds([...selectedIds, id])
    }
  }

  const filteredQuotes = quotes.filter(q => 
    q.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    q.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.projectType.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredLeads = leads.filter(l => 
    l.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6 font-[arial] animate-in fade-in duration-500 relative pb-20 text-slate-900">
      
      {/*  Header */}
      <div className="bg-white border border-gray-200 p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-sm rounded-sm">
        <div className="space-y-1">
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-3">
             Quotes & Inquiries
             <span className="text-[10px] font-black text-slate-400 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded uppercase">Central Archive</span>
          </h2>
          <p className="text-xs font-medium text-slate-500">Manage incoming project quote requests and customer leads.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="hidden sm:block">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-2 rounded border border-slate-100">
               {activeView === 'quotes' ? 'FILTERING INQUIRIES' : 'FILTERING PRIORITY QUEUE'}
            </p>
          </div>
          <button 
            onClick={fetchData}
            disabled={isLoading}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2 bg-white border border-gray-300 rounded text-xs font-bold text-slate-700 hover:bg-gray-50 transition-all shadow-sm active:scale-95 disabled:opacity-50"
          >
            <HiRefresh size={16} className={isLoading ? 'animate-spin' : ''} /> Refresh
          </button>
          {activeView === 'quotes' && (
            <button 
              onClick={handleDeleteAll}
              disabled={isLoading || quotes.length === 0}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2 bg-red-50 border border-red-200 rounded text-xs font-bold text-red-700 hover:bg-red-100 transition-all shadow-sm active:scale-95 disabled:opacity-50 uppercase tracking-tight"
            >
              <HiOutlineTrash size={16} /> Clear Archive
            </button>
          )}
        </div>
      </div>

      {/* View Switcher */}
      <div className="flex items-center gap-1 bg-white p-1 border border-gray-200 rounded-sm w-fit shadow-sm">
          <button 
            onClick={() => setActiveView('quotes')}
            className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all rounded-[1px] ${activeView === 'quotes' ? 'bg-[#232f3e] text-[#ff9900]' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Project Inquiries
          </button>
          <button 
            onClick={() => setActiveView('leads')}
            className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all rounded-[1px] ${activeView === 'leads' ? 'bg-[#232f3e] text-[#ff9900]' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Priority Queue (Leads)
          </button>
      </div>

      {/* Bulk Action Bar */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="bg-[#232f3e] text-white p-4 flex items-center justify-between rounded-sm shadow-xl border border-white/10"
          >
            <div className="flex items-center gap-4">
               <span className="text-[10px] font-black uppercase tracking-widest bg-[#ff9900] text-[#232f3e] px-2 py-0.5 rounded">
                 {selectedIds.length} Selected
               </span>
               <p className="text-xs font-bold text-slate-300">Bulk operational mode active.</p>
            </div>
            <div className="flex items-center gap-2">
               <button 
                onClick={() => setSelectedIds([])}
                className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider hover:underline"
               >
                 Cancel
               </button>
               <button 
                onClick={handleBulkDelete}
                className="px-6 py-1.5 bg-red-600 hover:bg-red-700 text-white text-[10px] font-black uppercase tracking-widest rounded transition-colors flex items-center gap-2"
               >
                 <HiOutlineTrash size={14} /> Delete Selected
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cloud Inventory Style Table */}
      <div className="bg-white border border-gray-200 shadow-sm overflow-hidden rounded-sm relative min-h-[400px]">
        {isLoading && (
          <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] z-50 flex items-center justify-center">
            <div className="w-8 h-8 border-3 border-slate-200 border-t-[#ff9900] rounded-full animate-spin" />
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] tracking-widest font-black text-slate-500 border-b border-gray-100 uppercase bg-gray-50/50">
                <th className="px-6 py-4 w-10">
                   <input 
                    type="checkbox" 
                    checked={selectedIds.length === filteredQuotes.length && filteredQuotes.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-gray-300 text-[#ff9900] focus:ring-[#ff9900]"
                   />
                </th>
                <th className="px-6 py-4">Customer Name</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Project Type</th>
                <th className="px-6 py-4">Date Submitted</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {activeView === 'quotes' ? (
                filteredQuotes.length > 0 ? filteredQuotes.map((quote) => (
                  <tr key={quote.id} className={`hover:bg-gray-50/50 transition-colors group ${selectedIds.includes(quote.id) ? 'bg-amber-50/30' : ''}`}>
                    <td className="px-6 py-4">
                       <input 
                        type="checkbox" 
                        checked={selectedIds.includes(quote.id)}
                        onChange={() => toggleSelect(quote.id)}
                        className="w-4 h-4 rounded border-gray-300 text-[#ff9900] focus:ring-[#ff9900]"
                       />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                          <div className="w-9 h-9 rounded bg-[#232f3e] text-[#ff9900] flex items-center justify-center font-bold text-xs ring-1 ring-white/10">
                            {quote.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex flex-col">
                              <span className="text-xs font-bold text-[#ff9900] hover:underline cursor-pointer" onClick={() => setSelectedQuote(quote)}>{quote.name}</span>
                              <span className="text-[10px] font-bold text-slate-400 tracking-tighter">{quote.email}</span>
                          </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[9px] font-black tracking-[0.1em] px-2 py-0.5 rounded border uppercase ${
                          quote.status === 'NEW' ? 'border-blue-200 text-blue-700 bg-blue-50' : 
                          quote.status === 'IN_PROGRESS' ? 'border-orange-200 text-orange-700 bg-orange-50' : 
                          'border-green-200 text-green-700 bg-green-50'
                        }`}>
                        {quote.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-bold text-slate-600 uppercase bg-slate-50 px-2 py-0.5 rounded border border-gray-100">{quote.projectType}</span>
                    </td>
                    <td className="px-6 py-4 text-[10px] text-slate-400 font-bold uppercase tabular-nums">
                      {new Date(quote.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setSelectedQuote(quote)}
                            className="p-2 text-slate-400 hover:text-slate-900 border border-transparent hover:border-gray-200 rounded transition-all"
                            title="View Details"
                          >
                            <HiOutlineViewList size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(quote.id)}
                            disabled={deletingId === quote.id}
                            className="p-2 text-slate-400 hover:text-red-700 border border-transparent hover:border-red-100 rounded transition-all"
                            title="Delete Inquiry"
                          >
                            <HiOutlineTrash size={16} />
                          </button>
                      </div>
                    </td>
                  </tr>
                )) : !isLoading && (
                  <tr>
                    <td colSpan={6} className="py-20 text-center">
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Archive is empty. No active inquiries found.</p>
                    </td>
                  </tr>
                )
              ) : (
                filteredLeads.length > 0 ? filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4"></td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                          <div className="w-9 h-9 rounded bg-[#ff9900] text-[#232f3e] flex items-center justify-center font-bold text-xs ring-1 ring-[#ff9900]/20">
                            @
                          </div>
                          <div className="flex flex-col">
                              <span className="text-xs font-bold text-slate-900">{lead.email}</span>
                              <span className="text-[10px] font-bold text-slate-400 tracking-tighter">Contractor Partnership Lead</span>
                          </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select 
                        value={lead.status}
                        onChange={(e) => handleStatusUpdate(lead.id, e.target.value)}
                        className={`text-[9px] font-black tracking-[0.1em] px-2 py-0.5 rounded border uppercase bg-transparent outline-none cursor-pointer ${
                          lead.status === 'UNREAD' ? 'border-amber-200 text-amber-700 bg-amber-50' : 
                          lead.status === 'CONTACTED' ? 'border-green-200 text-green-700 bg-green-50' : 
                          'border-gray-200 text-gray-500 bg-gray-50'
                        }`}
                      >
                        <option value="UNREAD">UNREAD</option>
                        <option value="CONTACTED">CONTACTED</option>
                        <option value="ARCHIVED">ARCHIVED</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-bold text-[#ff9900] uppercase bg-[#ff9900]/5 px-2 py-0.5 rounded border border-[#ff9900]/10 tracking-widest">PRIORITY QUEUE</span>
                    </td>
                    <td className="px-6 py-4 text-[10px] text-slate-400 font-bold uppercase tabular-nums">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                       <button
                          onClick={() => handleDelete(lead.id, 'lead')}
                          disabled={deletingId === lead.id}
                          className="p-2 text-slate-400 hover:text-red-700 border border-transparent hover:border-red-100 rounded transition-all"
                        >
                          <HiOutlineTrash size={16} />
                        </button>
                    </td>
                  </tr>
                )) : !isLoading && (
                  <tr>
                    <td colSpan={6} className="py-20 text-center">
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Priority Queue is currently empty.</p>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Drawer (SDW Style) */}
      <AnimatePresence>
        {selectedQuote && (
          <div className="fixed inset-0 z-[100] flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedQuote(null)}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col"
            >
              <div className="bg-[#232f3e] text-white px-6 py-4 flex items-center justify-between">
                 <h2 className="text-sm font-bold tracking-wider uppercase flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#ff9900] rounded-full" />
                    Inquiry Details
                 </h2>
                 <button onClick={() => setSelectedQuote(null)} className="p-1 hover:bg-white/10 rounded">
                    <HiX size={20} />
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-10">
                
                {/* Meta Header */}
                <div className="flex items-center gap-6 pb-8 border-b border-gray-100">
                    <div className="w-16 h-16 rounded bg-slate-100 border border-gray-200 flex items-center justify-center text-slate-900 font-bold text-2xl">
                        {selectedQuote.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-2xl font-bold tracking-tight text-slate-900">{selectedQuote.name}</h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            Reference ID: {selectedQuote.id.slice(-12).toUpperCase()}
                            <span className="px-2 py-0.5 bg-slate-50 border border-slate-100 rounded">Main Warehouse HQ</span>
                        </p>
                    </div>
                </div>

                {/* Data Cluster */}
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-tight">Email Address</label>
                        <div className="p-3 bg-gray-50 border border-gray-200 rounded font-bold text-[13px] text-slate-700 flex items-center gap-3">
                            <HiOutlineMail className="text-slate-400" /> {selectedQuote.email}
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-tight">Phone Number</label>
                        <div className="p-3 bg-gray-50 border border-gray-200 rounded font-bold text-[13px] text-slate-700 flex items-center gap-3">
                            <HiOutlinePhone className="text-slate-400" /> {selectedQuote.phone || 'NOT PROVIDED'}
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-tight italic border-l-2 border-[#ff9900] pl-3">Requested Materials</label>
                    <div className="p-4 bg-gray-50 border border-dashed border-gray-300 rounded font-bold text-xs text-slate-800 uppercase tracking-wide">
                        {selectedQuote.materials || 'NOT SPECIFIED'}
                    </div>
                </div>

                <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-tight">Project Message</label>
                    <div className="p-6 bg-slate-900 text-gray-300 rounded text-sm leading-relaxed font-medium italic border-l-4 border-[#ff9900]">
                        &quot;{selectedQuote.message}&quot;
                    </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-gray-100">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-tight">Inquiry Status</label>
                    <div className="flex gap-2">
                        {['NEW', 'IN_PROGRESS', 'COMPLETED'].map((status) => (
                            <button
                                key={status}
                                onClick={() => handleStatusUpdate(selectedQuote.id, status)}
                                className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest rounded transition-all border ${
                                    selectedQuote.status === status
                                    ? 'bg-[#232f3e] text-white border-[#232f3e] shadow-lg'
                                    : 'bg-white text-slate-500 border-gray-200 hover:border-gray-400'
                                }`}
                            >
                                {status.replace('_', ' ')}
                            </button>
                        ))}
                    </div>
                </div>
              </div>

              <div className="bg-gray-50 border-t border-gray-200 p-6 flex justify-end gap-3">
                 <button onClick={() => setSelectedQuote(null)} className="px-6 py-2 text-xs font-bold text-slate-600 hover:underline uppercase tracking-widest">Close</button>
                 <button 
                  onClick={() => { handleDelete(selectedQuote.id); setSelectedQuote(null); }}
                  className="px-8 py-2 bg-red-600 text-white text-xs font-black uppercase tracking-widest rounded shadow-sm hover:bg-red-700"
                 >
                   Delete Inquiry
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {confirmModal.isOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-md overflow-hidden border border-gray-200 shadow-2xl rounded-sm"
            >
              <div className="bg-[#232f3e] px-6 py-4 flex items-center gap-3">
                 <div className={`p-2 rounded ${confirmModal.type === 'danger' ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'}`}>
                    <HiOutlineTrash size={20} />
                 </div>
                 <h3 className="text-sm font-bold text-white uppercase tracking-widest">{confirmModal.title}</h3>
              </div>
              <div className="p-8">
                 <p className="text-sm text-slate-600 leading-relaxed font-medium">
                   {confirmModal.message}
                 </p>
              </div>
              <div className="bg-gray-50 px-8 py-4 flex justify-end gap-4 border-t border-gray-100">
                 <button 
                  onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                  className="px-6 py-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors"
                 >
                   Cancel
                 </button>
                 <button 
                  onClick={confirmModal.onConfirm}
                  className={`px-8 py-2 text-[10px] font-black uppercase tracking-widest text-white rounded shadow-sm transition-all active:scale-95 ${
                    confirmModal.type === 'danger' ? 'bg-red-600 hover:bg-red-700' : 'bg-amber-600 hover:bg-amber-700'
                  }`}
                 >
                   Confirm Deletion
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default QuotesPage
