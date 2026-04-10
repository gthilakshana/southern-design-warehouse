"use client"
import React, { useState, useEffect, useMemo, useRef } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  HiPlus,
  HiSearch,
  HiPencilAlt,
  HiTrash,
  HiFilter,
  HiX,
  HiCheck,
  HiExclamation,
  HiPhotograph,
  HiCube,
  HiRefresh,
  HiExternalLink,
  HiShieldExclamation
} from 'react-icons/hi'
import { getInventory, createInventoryItem, updateInventoryItem, deleteInventoryItem } from '@/lib/actions'
import { useSearch } from '@/context/SearchContext'

interface InventoryItem {
  id: string
  name: string
  category: string
  stock: number
  price: number
  status: string
  sku: string
  imageUrl?: string | null
}

const InventoryPage = () => {
  const [items, setItems] = useState<InventoryItem[]>([])
  const { searchTerm } = useSearch()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [isRemovingImage, setIsRemovingImage] = useState(false)
  const [draggedFile, setDraggedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Dynamic Category State
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false)
  const [customCategory, setCustomCategory] = useState('')

  // UX State
  const [isDragging, setIsDragging] = useState(false)
  const [formValues, setFormValues] = useState({
    name: '',
    sku: '',
    category: 'KITCHEN',
    price: 0,
    stock: 0
  })

  // Initialize from MongoDB
  const fetchInventory = async () => {
    setIsLoading(true)
    try {
      const data = await getInventory()
      console.log("Fetched Inventory Data Structure:", data[0]); // Debug first item
      setItems(data as any)
    } catch (err) {
      console.error("Failed to fetch inventory:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchInventory()
  }, [])

  useEffect(() => {
    if (editingItem) {
      setFormValues({
        name: editingItem.name,
        sku: editingItem.sku,
        category: editingItem.category,
        price: editingItem.price,
        stock: editingItem.stock
      })
      setPreviewUrl(editingItem.imageUrl || '')
      setIsRemovingImage(false)
    } else {
      setFormValues({ name: '', sku: '', category: 'KITCHEN', price: 0, stock: 0 })
      setPreviewUrl('')
      setIsRemovingImage(false)
    }
    setIsAddingNewCategory(false)
    setCustomCategory('')
  }, [editingItem, isModalOpen])

  const filteredItems = useMemo(() => {
    return items.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [items, searchTerm])

  const generateSKU = () => {
    const random = Math.floor(1000 + Math.random() * 9000)
    const prefix = formValues.category.substring(0, 3).toUpperCase()
    const newSku = `${prefix}-${random}`
    setFormValues(prev => ({ ...prev, sku: newSku }))
  }

  const handleFileChange = (file: File | undefined) => {
    if (file) {
      setPreviewUrl(URL.createObjectURL(file))
      setDraggedFile(file)
      setIsRemovingImage(false)
    }
  }

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    const formData = new FormData(e.currentTarget)
    
    // Ensure dragged/dropped file is included
    if (draggedFile) {
      formData.set("image", draggedFile)
    }

    if (!formData.get("sku") && formValues.sku) {
      formData.append("sku", formValues.sku)
    }

    let result
    if (editingItem) {
      result = await updateInventoryItem(editingItem.id, formData)
    } else {
      result = await createInventoryItem(formData)
    }

    if (result.success) {
      await fetchInventory()
      setIsModalOpen(false)
      setEditingItem(null)
      setPreviewUrl('')
      setDraggedFile(null)
      setIsRemovingImage(false)
      setIsAddingNewCategory(false)
      setCustomCategory('')
    } else {
      alert(result.error)
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    setIsLoading(true)
    const result = await deleteInventoryItem(id)
    if (result.success) {
      await fetchInventory()
      setDeleteConfirmId(null)
    } else {
      alert(result.error)
      setIsLoading(false)
    }
  }

  const getStockStatus = (stock: number) => {
    if (stock > 10) return { label: 'Running', color: 'border-green-200 text-green-700 bg-green-50' }
    if (stock > 0) return { label: 'Low Stock', color: 'border-orange-200 text-orange-700 bg-orange-50' }
    return { label: 'Stopped', color: 'border-red-200 text-red-700 bg-red-50' }
  }

  return (
    <div className="space-y-6 font-[arial] animate-in fade-in duration-500 pb-20">
      
      {/*  Header */}
      <div className="bg-white border border-gray-200 p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-sm rounded-sm">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
             Stock Inventory
             <span className="text-[10px] font-black text-[#232f3e] bg-[#ff9900]/10 border border-[#ff9900]/20 px-2 py-0.5 rounded shadow-sm">Asset Manifest v1.0</span>
          </h2>
          <p className="text-xs font-medium text-slate-500">Manage digital manifests and physical stock levels.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="hidden sm:block">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-2 rounded border border-slate-100 italic">
               Search Active for: {searchTerm || 'All Assets'}
            </p>
          </div>
          <button
            onClick={() => {
              setEditingItem(null)
              setFormValues({ name: '', sku: '', category: 'KITCHEN', price: 0, stock: 0 })
              setPreviewUrl('')
              setDraggedFile(null)
              setIsAddingNewCategory(false)
              setCustomCategory('')
              setIsModalOpen(true)
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2 bg-[#ff9900] text-[#232f3e] text-[11px] font-bold uppercase tracking-wider rounded hover:bg-[#e68a00] transition-all shadow-sm active:scale-95"
          >
            <HiPlus size={16} /> Add New Product
          </button>
        </div>
      </div>

      {/* Cloud Fleet Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
            { label: 'Standard Stock', count: items.filter(i => i.stock > 10).length, icon: HiCheck, color: 'text-green-600' },
            { label: 'Low Stock Levels', count: items.filter(i => i.stock > 0 && i.stock <= 10).length, icon: HiExclamation, color: 'text-orange-600' },
            { label: 'Out of Stock', count: items.filter(i => i.stock === 0).length, icon: HiX, color: 'text-red-600' },
        ].map((stat) => (
            <div key={stat.label} className="bg-white p-4 border border-gray-200 rounded-sm shadow-sm flex items-center justify-between">
                <div className="space-y-0.5">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                    <p className="text-2xl font-bold text-slate-900">{stat.count}</p>
                </div>
                <stat.icon className={stat.color} size={24} />
            </div>
        ))}
      </div>

      {/* Instance Table (SDW EC2 Style) */}
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
                <th className="px-6 py-4">Product Name / SKU</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4 text-right">Unit Price</th>
                <th className="px-6 py-4 text-right">Units in Stock</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredItems.length > 0 ? filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded border border-gray-200 bg-slate-50 relative overflow-hidden shrink-0 shadow-inner">
                            {(item.imageUrl || (item as any).image) ? (
                                <Image
                                  src={item.imageUrl || (item as any).image}
                                  alt={item.name}
                                  fill
                                  sizes="40px"
                                  className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                    <HiCube size={16} />
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-[#ff9900] hover:underline cursor-pointer">{item.name}</span>
                            <span className="text-[10px] font-bold text-slate-400 font-mono tracking-tighter">{item.sku}</span>
                        </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[9px] font-black tracking-[0.1em] px-2 py-0.5 rounded border uppercase ${getStockStatus(item.stock).color}`}>
                      {getStockStatus(item.stock).label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">{item.category}</span>
                  </td>
                  <td className="px-6 py-4 text-right text-xs font-bold text-slate-900">
                    ${item.price.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-xs font-bold text-slate-700 tabular-nums">{item.stock} Unit(s)</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            setEditingItem(item)
                            setFormValues({
                                name: item.name,
                                sku: item.sku,
                                category: item.category,
                                price: item.price,
                                stock: item.stock
                            })
                            setPreviewUrl(item.imageUrl || '')
                            setIsRemovingImage(false)
                            setIsAddingNewCategory(false)
                            setCustomCategory('')
                            setIsModalOpen(true)
                          }}
                          className="p-2 text-slate-400 hover:text-slate-900 border border-transparent hover:border-gray-200 rounded transition-all"
                        >
                          <HiPencilAlt size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(item.id)}
                          className="p-2 text-slate-400 hover:text-red-600 border border-transparent hover:border-red-100 rounded transition-all"
                        >
                          <HiTrash size={16} />
                        </button>
                    </div>
                  </td>
                </tr>
              )) : !isLoading && (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <HiCube size={40} className="mx-auto text-slate-200 mb-4" />
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No active products found matching your filter.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal - SDW Side Drawer Style */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col"
            >
              <div className="bg-[#232f3e] text-white px-6 py-4 flex items-center justify-between shadow-md relative z-10">
                 <h2 className="text-sm font-bold tracking-wider uppercase flex items-center gap-2">
                    <HiPencilAlt size={18} className="text-[#ff9900]" />
                    Configure Product Settings
                 </h2>
                 <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-white/10 rounded transition-colors">
                    <HiX size={20} />
                 </button>
              </div>

              <form 
                key={editingItem ? `edit-${editingItem.id}` : 'new-product'}
                onSubmit={handleSave} 
                className="flex-1 flex flex-col min-h-0 font-[arial]"
              >
                <div className="p-8 space-y-8 flex-1 overflow-y-auto">
                    {/* Hardware Visualization (Image) */}
                    <div className="space-y-4">
                       <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">A. Product Visualization</h3>
                       
                       {(editingItem?.imageUrl || (editingItem as any)?.image) && !isRemovingImage ? (
                          <div className="flex items-center gap-6 p-4 bg-gray-50 border border-gray-200 rounded group">
                             <div className="relative w-24 h-24 rounded overflow-hidden border border-gray-300 shadow-sm bg-white">
                                <Image
                                  src={(editingItem?.imageUrl || (editingItem as any)?.image) || ''}
                                  alt="Current Asset"
                                  fill
                                  sizes="96px"
                                  className="object-cover"
                                />
                             </div>
                             <div className="flex-1 space-y-2">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Registered Manifest Image</p>
                                <button 
                                  type="button"
                                  onClick={() => {
                                    setIsRemovingImage(true)
                                    setPreviewUrl('')
                                  }}
                                  className="text-[10px] font-bold text-red-600 hover:text-red-800 underline uppercase tracking-tight"
                                >
                                  Purge Asset Image
                                </button>
                             </div>
                             <input type="hidden" name="removeImage" value="false" />
                          </div>
                       ) : (
                          <div 
                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={(e) => {
                                e.preventDefault();
                                setIsDragging(false);
                                const file = e.dataTransfer.files?.[0];
                                if (file) handleFileChange(file);
                            }}
                            className={`border-2 border-dashed rounded min-h-[160px] flex flex-col items-center justify-center transition-all cursor-pointer relative group overflow-hidden ${
                                isDragging ? 'border-[#ff9900] bg-orange-50' : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                             <input 
                                name="image" 
                                type="file" 
                                className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                                onChange={(e) => handleFileChange(e.target.files?.[0])}
                             />
                             {previewUrl ? (
                                 <div className="relative w-full h-40">
                                   <Image
                                     src={previewUrl}
                                     alt="Preview"
                                     fill
                                     unoptimized
                                     className="object-cover group-hover:opacity-60 transition-all"
                                   />
                                 </div>
                             ) : (
                                 <div className="text-center space-y-2 p-6">
                                    <HiPhotograph size={32} className="mx-auto text-slate-300 group-hover:text-[#ff9900] transition-colors" />
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter group-hover:text-slate-600">Drag asset image here</p>
                                    <p className="text-[9px] text-slate-300 uppercase italic">PNG, JPG, WEBP (Max 5MB)</p>
                                 </div>
                             )}
                             {isRemovingImage && (
                                <div className="absolute top-2 right-2 z-20">
                                  <span className="flex items-center gap-1.5 px-2 py-1 bg-red-600 text-white text-[8px] font-black uppercase tracking-widest rounded shadow-lg">
                                    <HiShieldExclamation /> Purge Requested
                                  </span>
                                </div>
                             )}
                             <input type="hidden" name="removeImage" value={isRemovingImage ? 'true' : 'false'} />
                          </div>
                       )}
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="col-span-2 space-y-2">
                            <label className="text-[11px] font-black text-slate-500 uppercase tracking-tight">Product Label / Name</label>
                            <input
                               name="name"
                               defaultValue={formValues.name}
                               required
                               className="w-full px-3 py-2 border border-gray-300 rounded text-xs font-bold focus:border-[#ff9900] outline-none"
                               placeholder="Standard Kitchen Cabinet v2"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-500 uppercase tracking-tight">System SKU ID</label>
                            <div className="flex gap-2">
                                <input
                                   name="sku"
                                   defaultValue={formValues.sku}
                                   readOnly={!!editingItem}
                                   className={`flex-1 px-3 py-2 border border-solid border-gray-300 rounded text-xs font-mono font-bold focus:border-[#ff9900] outline-none ${editingItem ? 'bg-gray-50 text-slate-500' : ''}`}
                                   placeholder="SKU-0000"
                                />
                                {!editingItem && (
                                    <button type="button" onClick={generateSKU} className="p-2 border border-gray-200 hover:bg-gray-50 rounded transition-colors" title="Regenerate SKU">
                                        <HiRefresh size={16} />
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-500 uppercase tracking-tight">Product Classification</label>
                            
                            {!isAddingNewCategory ? (
                              <div className="relative">
                                <select
                                  name="category"
                                  defaultValue={formValues.category}
                                  onChange={(e) => {
                                    if (e.target.value === 'ADD_NEW') {
                                      setIsAddingNewCategory(true);
                                    }
                                  }}
                                  className="w-full px-3 py-2 border border-gray-300 rounded text-xs font-black uppercase outline-none focus:border-[#ff9900] bg-white cursor-pointer appearance-none"
                                >
                                  <option value="KITCHEN">KITCHEN</option>
                                  <option value="BATHROOM">BATHROOM</option>
                                  <option value="FLOORING">FLOORING</option>
                                  <option value="COUNTERTOP">COUNTERTOP</option>
                                  <option value="STORAGE">STORAGE</option>
                                  <option value="TOOLS">TOOLS</option>
                                  
                                  {/* Dynamic categories from existing items */}
                                  {Array.from(new Set(items.map(i => i.category.toUpperCase())))
                                    .filter(cat => !['KITCHEN', 'BATHROOM', 'FLOORING', 'COUNTERTOP', 'STORAGE', 'TOOLS'].includes(cat))
                                    .map(cat => (
                                      <option key={cat} value={cat}>{cat}</option>
                                    ))
                                  }
                                  
                                  <option value="ADD_NEW" className="text-[#ff9900] font-black italic">+ Create New Category</option>
                                </select>
                                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                                  <HiFilter className="text-gray-300" size={14} />
                                </div>
                              </div>
                            ) : (
                              <div className="flex gap-2 animate-in slide-in-from-right-1 duration-300">
                                <input
                                  name="category"
                                  autoFocus
                                  placeholder="ENTER NEW CATEGORY..."
                                  className="flex-1 px-3 py-2 border border-[#ff9900] bg-orange-50/30 rounded text-xs font-black uppercase outline-none"
                                  onChange={(e) => setCustomCategory(e.target.value.toUpperCase())}
                                />
                                <button
                                  type="button"
                                  onClick={() => setIsAddingNewCategory(false)}
                                  className="px-3 bg-slate-100 text-slate-500 rounded hover:bg-slate-200 transition-colors"
                                  title="Cancel"
                                >
                                  <HiX size={16} />
                                </button>
                              </div>
                            )}
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-500 uppercase tracking-tight">Market Valuation ($)</label>
                            <input
                               name="price"
                               type="number"
                               step="0.01"
                               defaultValue={formValues.price}
                               className="w-full px-3 py-2 border border-gray-300 rounded text-xs font-black outline-none focus:border-[#ff9900] tabular-nums"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-500 uppercase tracking-tight">Inventory Units</label>
                            <input
                               name="stock"
                               type="number"
                               defaultValue={formValues.stock}
                               className="w-full px-3 py-2 border border-gray-300 rounded text-xs font-black outline-none focus:border-[#ff9900] tabular-nums"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 border-t border-gray-200 p-6 flex justify-end gap-3 mt-auto relative z-10">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 text-xs font-bold text-slate-600 hover:underline uppercase tracking-widest">Abort</button>
                    <button 
                      type="submit"
                      disabled={isLoading}
                      className="bg-[#232f3e] text-[#ff9900] px-10 py-2.5 text-xs font-black uppercase tracking-[0.1em] rounded shadow-lg hover:bg-slate-800 transition-all disabled:opacity-50"
                    >
                      {isLoading ? 'Synchronizing...' : 'Save Product Entity'}
                    </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Dialog */}
      <AnimatePresence>
        {deleteConfirmId && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white max-w-sm w-full border border-gray-200 shadow-2xl rounded-sm p-8"
            >
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-2 flex items-center gap-3">
                 <HiExclamation className="text-red-600" size={20} />
                 Permanent Data Revocation
              </h3>
              <p className="text-[11px] text-slate-500 leading-relaxed font-bold uppercase tracking-tight mb-8">This action will permanently purge this inventory entity and its associated manifest image from the cloud cluster.</p>
              <div className="flex justify-end gap-3">
                 <button onClick={() => setDeleteConfirmId(null)} className="px-5 py-2 text-xs font-extrabold text-slate-600 hover:underline uppercase tracking-widest">Abort</button>
                 <button 
                    onClick={() => handleDelete(deleteConfirmId)}
                    className="px-6 py-2 bg-red-600 text-white text-xs font-black uppercase tracking-wider rounded hover:bg-red-700 shadow-sm"
                 >
                    Confirm Termination
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}

export default InventoryPage
