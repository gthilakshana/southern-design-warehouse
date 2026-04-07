"use client"
import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiUserAdd, HiMail, HiShieldCheck, HiTrash, HiDotsVertical, HiSearch, HiX, HiCheck, HiShieldExclamation, HiPencil, HiRefresh, HiLockClosed } from 'react-icons/hi'
import { MdPerson, MdEmail, MdSecurity, MdDelete, MdHistory, MdEdit } from 'react-icons/md'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { getUsers, registerUser, updateUserDetails, deleteUser } from '@/lib/actions'
import { useSearch } from '@/context/SearchContext'

interface UserItem {
  id: string
  name: string | null
  email: string
  role: 'ADMIN' | 'CONTRACTOR'
  status: 'ACTIVE' | 'PENDING' | 'INACTIVE'
  joined: string | Date
  image: string | null
}

const UsersPage = () => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [users, setUsers] = useState<UserItem[]>([])
  const { searchTerm } = useSearch()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<UserItem | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [viewProfileImage, setViewProfileImage] = useState<string | null>(null)
  const [isRemovingImage, setIsRemovingImage] = useState(false)

  // Security Check: Only admins can access this page
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated' && (session?.user as any)?.role !== 'ADMIN') {
      router.push('/admin/dashboard')
    }
  }, [session, status, router])

  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      const data = await getUsers()
      setUsers(data as any)
    } catch (err) {
      console.error("Failed to fetch users:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const filteredUsers = useMemo(() => {
    return users.filter(user =>
      (user.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [users, searchTerm])

  const handleAddUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    const formData = new FormData(e.currentTarget)

    const result = await registerUser(formData)
    if (result.success) {
      await fetchUsers()
      setIsModalOpen(false)
    } else {
      alert(result.error)
      setIsLoading(false)
    }
  }

  const openEditDrawer = (user: UserItem) => {
    setEditingUser(user)
    setIsRemovingImage(false)
  }

  const closeEditDrawer = () => {
    setEditingUser(null)
    setIsRemovingImage(false)
  }

  const handleUpdateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingUser) return
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const result = await updateUserDetails(editingUser.id, formData)

    if (result.success) {
      await fetchUsers()
      setEditingUser(null)
      setIsRemovingImage(false)
    } else {
      alert(result.error)
      setIsLoading(false)
    }
  }

  const handleDeleteRecord = async (id: string) => {
    setIsLoading(true)
    const result = await deleteUser(id)
    if (result.success) {
      await fetchUsers()
      setDeleteConfirmId(null)
    } else {
      alert(result.error)
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6 font-[arial] animate-in fade-in duration-500 relative pb-20">
      
      {/*  Header */}
      <div className="bg-white border border-gray-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm rounded-sm">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
             Identity & Access Management
             <span className="text-[10px] font-black text-slate-400 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded uppercase font-mono">SDW-IAM-v2</span>
          </h2>
          <p className="text-xs font-medium text-slate-500">Manage user identities, security ranks, and administrative clearance protocols.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="hidden sm:block">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-2 rounded border border-slate-100 font-mono">
               Active Filter: {searchTerm || 'ALL_IDENTITIES'}
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2 bg-[#ff9900] text-[#232f3e] text-[11px] font-bold uppercase tracking-wider rounded hover:bg-[#e68a00] transition-all shadow-sm active:scale-95"
          >
            <HiUserAdd size={16} /> Provision User
          </button>
        </div>
      </div>

      {/* Cloud IAM Style Table */}
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
                <th className="px-6 py-4">User Name</th>
                <th className="px-6 py-4">Security Role</th>
                <th className="px-6 py-4">Access Status</th>
                <th className="px-6 py-4">Creation Date</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredUsers.length > 0 ? filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                        <div 
                          onClick={() => user.image && setViewProfileImage(user.image)}
                          className={`w-9 h-9 rounded flex items-center justify-center font-bold text-xs ring-1 ring-white/10 overflow-hidden cursor-pointer active:scale-95 transition-all ${user.role === 'ADMIN' ? 'bg-[#232f3e] text-[#ff9900]' : 'bg-slate-100 text-slate-600'}`}
                        >
                          {user.image ? (
                            <img src={user.image} alt={user.name || 'User'} className="w-full h-full object-cover" />
                          ) : (
                            (user.name || 'U').charAt(0).toUpperCase()
                          )}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-slate-900">{user.name || 'Anonymous operative'}</span>
                            <span className="text-[10px] font-bold text-slate-400 tracking-tighter">{user.email}</span>
                        </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                        {user.role === 'ADMIN' ? (
                          <span className="flex items-center gap-1.5 px-2 py-1 bg-slate-900/5 text-slate-700 text-[9px] font-black tracking-widest rounded border border-slate-200 uppercase">
                            <HiShieldCheck className="text-green-600" size={14} /> Master Admin
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 text-slate-500 text-[9px] font-black tracking-widest rounded border border-gray-100 uppercase">
                            <HiLockClosed className="text-slate-300" size={14} /> Staff Member
                          </span>
                        )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[9px] font-black tracking-[0.1em] px-2 py-0.5 rounded border uppercase ${
                        user.status === 'ACTIVE' ? 'border-green-200 text-green-700 bg-green-50' : 
                        user.status === 'PENDING' ? 'border-orange-200 text-orange-700 bg-orange-50' : 
                        'border-gray-200 text-gray-400 bg-gray-50'
                      }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[10px] text-slate-400 font-bold uppercase tabular-nums">
                    {new Date(user.joined).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEditDrawer(user)}
                          className="p-2 text-slate-400 hover:text-slate-900 border border-transparent hover:border-gray-200 rounded transition-all"
                          title="Modify Entry"
                        >
                          <HiPencil size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(user.id)}
                          className="p-2 text-slate-400 hover:text-red-700 border border-transparent hover:border-red-100 rounded transition-all"
                          title="Purge Identity"
                        >
                          <HiTrash size={16} />
                        </button>
                    </div>
                  </td>
                </tr>
              )) : !isLoading && (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">No operative identities found matching your filter.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Security Module Info */}
      <div className="bg-[#232f3e] text-white p-8 rounded-sm shadow-xl relative overflow-hidden group border border-white/5">
         <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
            <div className="w-14 h-14 bg-[#ff9900] text-[#232f3e] rounded flex items-center justify-center shadow-lg transform -rotate-3 group-hover:rotate-0 transition-transform">
               <HiShieldCheck size={32} />
            </div>
            <div className="flex-1 space-y-1 text-center md:text-left">
               <h4 className="text-[10px] font-black tracking-[0.3em] uppercase text-[#ff9900]">Security & Network Compliance</h4>
               <p className="text-xs text-slate-400 font-bold uppercase tracking-tight leading-relaxed max-w-2xl">
                  Administrative privilege changes and new operative provisionings are strictly audited. Secure accounts must be verified prior to network access.
               </p>
            </div>
         </div>
      </div>

      {/* Provisioning Drawer (SDW style) */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
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
                <h2 className="text-sm font-bold tracking-wider uppercase flex items-center gap-2">
                    <HiUserAdd size={18} className="text-[#ff9900]" />
                    Add New Operative
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-white/10 rounded">
                    <HiX size={20} />
                 </button>
              </div>

              <form id="add-user-form" onSubmit={handleAddUser} className="p-8 space-y-8 flex-1 overflow-y-auto">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-tight">Full Legal Identity</label>
                    <input required name="name" type="text" className="w-full px-4 py-2 border border-gray-300 rounded text-xs font-bold outline-none focus:border-[#ff9900]" placeholder="Operative Label" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-tight">Network URI (Email)</label>
                    <input required name="email" type="email" className="w-full px-4 py-2 border border-gray-300 rounded text-xs font-bold outline-none focus:border-[#ff9900]" placeholder="ID@cluster.com" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-tight">Access Password</label>
                    <input required name="password" type="password" className="w-full px-4 py-2 border border-gray-300 rounded text-xs font-bold outline-none focus:border-[#ff9900]" placeholder="••••••••" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-tight">Access Control Image (Profile Photo)</label>
                    <input 
                      name="image" 
                      type="file" 
                      accept="image/*"
                      className="w-full px-4 py-2 border border-dashed border-gray-300 rounded text-[10px] font-bold outline-none focus:border-[#ff9900] file:bg-[#232f3e] file:text-[#ff9900] file:border-none file:rounded file:px-3 file:py-1 file:mr-4 file:text-[9px] file:font-black file:uppercase file:cursor-pointer" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-tight">Clearance Group (Role)</label>
                    <select name="role" className="w-full px-4 py-2 border border-gray-300 rounded text-xs font-bold uppercase outline-none focus:border-[#ff9900]">
                      <option value="ADMIN">Master Admin</option>
                      <option value="CONTRACTOR">Staff Member</option>
                    </select>
                  </div>
                  <div className="p-4 bg-gray-50 border border-[#ff9900]/20 rounded text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
                    Identity will be provisioned with the specified secure password. Access protocols are audited and recorded.
                  </div>
                </div>
              </form>

              <div className="bg-gray-50 border-t border-gray-200 p-6 flex justify-end gap-3">
                 <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 text-xs font-bold text-slate-600 hover:underline uppercase tracking-widest">Abort</button>
                 <button 
                  type="submit" 
                  form="add-user-form"
                  className="px-8 py-2 bg-[#ff9900] text-[#232f3e] font-black text-[11px] uppercase tracking-widest rounded shadow-sm hover:bg-[#e68a00]"
                 >
                   Confirm Addition
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modification Drawer (SDW style) */}
      <AnimatePresence>
        {editingUser && (
          <div className="fixed inset-0 z-[100] flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeEditDrawer}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-xl bg-white h-full shadow-2xl flex flex-col"
            >
              <div className="bg-[#232f3e] text-white px-6 py-4 flex items-center justify-between shadow-md relative z-10">
                <h2 className="text-sm font-bold tracking-wider uppercase flex items-center gap-2">
                    <HiPencil size={18} className="text-[#ff9900]" />
                     Modify Identity Details
                 </h2>
                <button onClick={closeEditDrawer} className="p-1 hover:bg-white/10 rounded transition-colors">
                    <HiX size={20} />
                 </button>
              </div>

              <form onSubmit={handleUpdateUser} className="flex-1 flex flex-col min-h-0">
                <div className="p-8 space-y-8 flex-1 overflow-y-auto">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="col-span-2 space-y-2">
                            <label className="text-[11px] font-black text-slate-500 uppercase tracking-tight">Legal Identity Label</label>
                            <input defaultValue={editingUser.name || ''} required name="name" type="text" className="w-full px-4 py-2 border border-gray-300 rounded text-xs font-bold outline-none focus:border-[#ff9900]" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-500 uppercase tracking-tight">Security Clearance</label>
                            <select name="role" defaultValue={editingUser.role} className="w-full px-4 py-2 border border-gray-300 rounded text-xs font-bold uppercase outline-none focus:border-[#ff9900]">
                                <option value="ADMIN">Master Admin</option>
                                <option value="CONTRACTOR">Staff Member</option>
                            </select>
                        </div>
                        <div className="col-span-2 space-y-2">
                            <label className="text-[11px] font-black text-slate-500 uppercase tracking-tight">Access URI (Email)</label>
                            <input defaultValue={editingUser.email} required name="email" type="email" className="w-full px-4 py-2 border border-gray-300 rounded text-xs font-bold outline-none focus:border-[#ff9900]" />
                        </div>
                        
                        <div className="col-span-2 pt-6 border-t border-gray-100 space-y-4">
                            <label className="text-[11px] font-black text-slate-500 uppercase tracking-tight">Identity Visual (Profile Image)</label>
                            
                            {editingUser.image && !isRemovingImage ? (
                              <div className="flex items-center gap-6 p-4 bg-gray-50 border border-gray-200 rounded">
                                 <div className="w-16 h-16 rounded overflow-hidden border border-gray-300">
                                    <img src={editingUser.image} alt="Current" className="w-full h-full object-cover" />
                                 </div>
                                 <div className="flex-1 space-y-2">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Operative Photo</p>
                                    <button 
                                      type="button"
                                      onClick={() => setIsRemovingImage(true)}
                                      className="text-[10px] font-bold text-red-600 hover:underline uppercase tracking-tight"
                                    >
                                      Request Image Purge
                                    </button>
                                 </div>
                                 <input type="hidden" name="removeImage" value="false" />
                              </div>
                            ) : (
                              <div className="space-y-4">
                                 <input 
                                    name="image" 
                                    type="file" 
                                    accept="image/*"
                                    className="w-full px-4 py-2 border border-dashed border-gray-300 rounded text-[10px] font-bold outline-none focus:border-[#ff9900] file:bg-[#232f3e] file:text-[#ff9900] file:border-none file:rounded file:px-3 file:py-1 file:mr-4 file:text-[9px] file:font-black file:uppercase file:cursor-pointer" 
                                 />
                                 {isRemovingImage && (
                                   <div className="flex flex-col gap-2">
                                      <p className="text-[9px] font-black text-red-500 uppercase tracking-widest flex items-center gap-2">
                                        <HiShieldExclamation /> Identity purge requested. Re-upload or save to clear.
                                      </p>
                                      <button 
                                        type="button" 
                                        onClick={() => setIsRemovingImage(false)}
                                        className="text-[9px] font-bold text-slate-400 hover:text-slate-900 uppercase tracking-tight self-start"
                                      >
                                        Undo Purge Request
                                      </button>
                                      <input type="hidden" name="removeImage" value="true" />
                                   </div>
                                 )}
                              </div>
                            )}
                        </div>

                        <div className="col-span-2 space-y-2">
                            <label className="text-[11px] font-black text-slate-500 uppercase tracking-tight italic">Authentication Protocol (Status)</label>
                            <div className="flex gap-2">
                                {['ACTIVE', 'PENDING', 'INACTIVE'].map((status) => (
                                    <label key={status} className="flex-1 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="status"
                                            value={status}
                                            defaultChecked={editingUser.status === status}
                                            className="sr-only peer"
                                        />
                                        <div className="py-2 text-center text-[10px] font-black rounded border border-gray-200 bg-white peer-checked:bg-[#232f3e] peer-checked:text-white peer-checked:border-[#232f3e] uppercase tracking-widest hover:border-gray-300">
                                            {status}
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 border-t border-gray-200 p-6 flex justify-end gap-3 mt-auto relative z-10">
                    <button type="button" onClick={closeEditDrawer} className="px-5 py-2 text-xs font-bold text-slate-600 hover:underline uppercase tracking-widest">Abort</button>
                    <button 
                      type="submit" 
                      className="px-8 py-2 bg-[#ff9900] text-[#232f3e] font-black text-[11px] uppercase tracking-widest rounded shadow-sm hover:bg-[#e68a00] transition-colors disabled:opacity-50"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Processing...' : 'Apply Config Update'}
                    </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Purge Confirmation Alert */}
      <AnimatePresence>
        {deleteConfirmId && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-950/40 backdrop-blur-sm shadow-2xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="bg-white max-w-sm w-full border border-gray-200 shadow-2xl rounded-sm p-8"
            >
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-2 flex items-center gap-3">
                 <HiShieldExclamation className="text-red-500" size={20} />
                 Permanent Identity Purge
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium mb-8 uppercase tracking-tight">You are about to terminate this operational identity. Access to the warehouse network will be immediately revoked.</p>
              <div className="flex justify-end gap-3">
                 <button onClick={() => setDeleteConfirmId(null)} className="px-5 py-2 text-xs font-extrabold text-slate-600 hover:underline uppercase tracking-widest">Abort</button>
                 <button 
                    onClick={() => handleDeleteRecord(deleteConfirmId)}
                    className="px-6 py-2 bg-red-600 text-white text-xs font-black uppercase tracking-wider rounded hover:bg-red-700 shadow-sm"
                 >
                    Confirm Termination
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Profile Badge View Modal */}
      <AnimatePresence>
        {viewProfileImage && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-2xl w-full flex flex-col items-center gap-6"
            >
              <button 
                onClick={() => setViewProfileImage(null)}
                className="absolute -top-12 right-0 p-2 text-white hover:bg-white/10 rounded-full transition-all"
              >
                <HiX size={32} />
              </button>
              
              <div className="bg-[#232f3e] p-2 rounded shadow-2xl border-4 border-white/10 ring-1 ring-white/5">
                <img 
                  src={viewProfileImage} 
                  alt="Operative Identity" 
                  className="max-h-[70vh] w-auto object-contain rounded-sm"
                />
              </div>
              
              <div className="text-center space-y-2">
                 <h3 className="text-[#ff9900] font-black text-xs uppercase tracking-[0.4em]">Operative Identity Verified</h3>
                 <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest">Southern Design Warehouse Security Audit System</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default UsersPage
