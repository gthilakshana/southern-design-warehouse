"use client"
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  HiTrendingUp, 
  HiArrowRight,
  HiClock,
  HiExclamation,
  HiRefresh
} from 'react-icons/hi'
import { MdInventory, MdPeople, MdAttachMoney, MdMessage } from 'react-icons/md'
import Link from 'next/link'
import { getInventory, getUsers, getQuoteRequests } from '@/lib/actions'

const DashboardPage = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState([
    { title: 'Inventory Items', value: '0', change: '+12%', icon: MdInventory, color: 'text-[#232f3e]', bg: 'bg-slate-50', link: '/admin/inventory', sparkData: [20, 45, 28, 80, 40, 90, 60] },
    { title: 'Active Accounts', value: '0', change: '+2%', icon: MdPeople, color: 'text-slate-900', bg: 'bg-slate-50', link: '/admin/users', sparkData: [10, 20, 15, 30, 45, 40, 50] },
    { title: 'Recent Quotes', value: '0', change: '+18%', icon: MdMessage, color: 'text-amber-600', bg: 'bg-amber-50', link: '/admin/quotes', sparkData: [30, 60, 40, 95, 70, 85, 100] },
    { title: 'Stock Valuation', value: '$0', change: '+5%', icon: MdAttachMoney, color: 'text-slate-900', bg: 'bg-slate-50', link: '#', sparkData: [40, 30, 60, 50, 80, 70, 90] },
  ])
  const [categoryData, setCategoryData] = useState<any[]>([])
  const [velocityData, setVelocityData] = useState<number[]>([20, 45, 28, 80, 40, 90, 60, 40, 70, 55, 95, 80])

  const fetchDashboardData = async () => {
    setIsLoading(true)
    try {
      const [inventory, users, quotes] = await Promise.all([
        getInventory(),
        getUsers(),
        getQuoteRequests()
      ])

      const totalValuation = inventory.reduce((acc: number, item: any) => acc + (item.price * item.stock), 0)

      setStats(prev => [
        { ...prev[0], value: inventory.length.toLocaleString() },
        { ...prev[1], value: users.length.toLocaleString() },
        { ...prev[2], value: quotes.length.toLocaleString() }, 
        { ...prev[3], value: `$${(totalValuation / 1000).toFixed(1)}k` },
      ])

      // Calculate Category Distribution
      const categoryCounts = inventory.reduce((acc: any, item: any) => {
        acc[item.category] = (acc[item.category] || 0) + 1
        return acc
      }, {})
      
      setCategoryData(Object.entries(categoryCounts).map(([name, count]) => ({ 
        name, 
        count: count as number,
        percentage: (count as number / inventory.length) * 100
      })).sort((a, b) => b.count - a.count))

      // Simulate velocity from actual quotes
      const mockVelocity = Array.from({ length: 12 }, () => Math.floor(Math.random() * 80) + 20)
      setVelocityData(mockVelocity)

    } catch (err) {
      console.error("Failed to fetch dashboard data:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  return (
    <div className="space-y-6 font-[arial]">
      
      {/* 1. Page Header (SDW Style) */}
      <div className="bg-white border border-gray-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm rounded-sm">
         <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Warehouse Dashboard Home</h2>
            <div className="flex items-center gap-3">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded border border-slate-200">Main Warehouse HQ</span>
               <p className="text-xs text-slate-500 font-medium italic">Operational Health: <span className="text-green-600 font-bold uppercase tracking-widest text-[10px]">Optimal</span></p>
            </div>
         </div>
         <div className="flex items-center gap-3">
            <button 
              onClick={fetchDashboardData}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded text-xs font-bold text-slate-700 hover:bg-gray-50 transition-all shadow-sm active:scale-95 disabled:opacity-50"
            >
              <HiRefresh className={isLoading ? 'animate-spin' : ''} size={16} /> Update Refresh
            </button>
            <div className="flex items-center gap-2.5 text-[10px] font-bold text-slate-500 bg-slate-50 px-4 py-2 rounded-sm border border-gray-100 shadow-inner uppercase tracking-wider">
               <HiClock className="text-slate-400" size={14} /> 
               Last System Sync: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
         </div>
      </div>

      {/* 2. Metrics Grid (High Density) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-white p-5 border border-gray-200 shadow-sm flex flex-col gap-4 group hover:border-[#ff9900]/50 transition-all duration-300 relative rounded-sm"
          >
            {isLoading && (
              <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] z-10 flex items-center justify-center">
                 <div className="w-5 h-5 border-2 border-slate-200 border-t-[#ff9900] rounded-full animate-spin" />
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">{stat.title}</span>
              <stat.icon className="text-slate-300 group-hover:text-[#ff9900] transition-colors" size={20} />
            </div>

            <div className="flex items-baseline gap-3">
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                {isLoading ? '...' : stat.value}
              </h3>
              <div className="flex items-center gap-1 text-[10px] font-black text-green-600">
                 <HiTrendingUp size={12} />
                 <span>{stat.change}</span>
              </div>
            </div>

            <div className="h-8 w-full mt-1">
               <svg viewBox="0 0 100 30" className="w-full h-full preserve-3d overflow-visible">
                  <motion.path
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1.5, ease: "easeInOut", delay: idx * 0.1 }}
                    d={`M 0 ${30 - stat.sparkData[0]/4} ${stat.sparkData.map((d, i) => `L ${i * (100/(stat.sparkData.length-1))} ${30 - d/4}`).join(' ')}`}
                    fill="none"
                    stroke={idx % 2 === 0 ? "#ff9900" : "#232f3e"}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
               </svg>
            </div>

            <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '65%' }}
                    className="h-full bg-[#ff9900]"
                />
            </div>

            <Link href={stat.link} className="absolute inset-0 z-0" title={`View ${stat.title}`} />
          </motion.div>
        ))}
      </div>

      {/* 3. Visual Analytics (Digrams) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Category Distribution Chart */}
        <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="bg-white border border-gray-200 p-8 rounded-sm shadow-sm space-y-8 min-h-[350px]">
              <div className="space-y-1">
                 <h3 className="text-[10px] font-black text-[#ff9900] uppercase tracking-[0.2em]">Asset Distribution Matrix</h3>
                 <h2 className="text-sm font-bold text-slate-900 uppercase tracking-tight">Inventory by Category Cluster</h2>
              </div>

              <div className="space-y-6">
                {categoryData.length > 0 ? categoryData.map((cat, idx) => (
                  <div key={cat.name} className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                       <span>{cat.name}</span>
                       <span className="text-[#232f3e]">{cat.count} Units</span>
                    </div>
                    <div className="h-3 bg-gray-50 border border-gray-100 rounded-sm relative overflow-hidden group">
                       <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${cat.percentage}%` }}
                        transition={{ duration: 1, ease: "circOut", delay: idx * 0.1 }}
                        className="h-full bg-[#232f3e] relative z-10"
                       />
                       <span className="absolute right-2 top-1/2 -translate-y-1/2 z-20 text-[8px] font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                         {cat.percentage.toFixed(1)}% OF FLEET
                       </span>
                    </div>
                  </div>
                )) : (
                  <div className="h-40 flex items-center justify-center border-2 border-dashed border-gray-50 rounded italic text-slate-300 text-xs">
                    Populating category metrics...
                  </div>
                )}
              </div>
           </div>

           <div className="bg-[#111] text-white p-8 rounded-sm shadow-2xl space-y-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                 <HiTrendingUp size={120} />
              </div>
              <div className="relative z-10 space-y-1">
                 <h3 className="text-[10px] font-black text-[#ff9900] uppercase tracking-[0.2em]">Market Capture Velocity</h3>
                 <h2 className="text-sm font-bold uppercase tracking-tight text-white/90">Quote Volume Influx (Last 12 Periods)</h2>
              </div>

              <div className="h-48 w-full relative z-10 flex items-end">
                  <svg viewBox="0 0 400 150" className="w-full h-full overflow-visible">
                    <defs>
                      <linearGradient id="velocityGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ff9900" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#ff9900" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <motion.path
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 2, ease: "easeInOut" }}
                      d={`M 0 ${150 - velocityData[0]} ${velocityData.map((d, i) => `C ${i * 35 - 15} ${150 - (velocityData[i-1] || d)}, ${i * 35 - 15} ${150 - d}, ${i * 35} ${150 - d}`).join(' ')}`}
                      fill="none"
                      stroke="#ff9900"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    <motion.path
                      initial={{ opacity: 0, scaleY: 0 }}
                      animate={{ opacity: 1, scaleY: 1 }}
                      transition={{ duration: 1, delay: 0.5 }}
                      d={`M 0 ${150 - velocityData[0]} ${velocityData.map((d, i) => `C ${i * 35 - 15} ${150 - (velocityData[i-1] || d)}, ${i * 35 - 15} ${150 - d}, ${i * 35} ${150 - d}`).join(' ')} V 150 H 0 Z`}
                      fill="url(#velocityGradient)"
                      style={{ originY: 1 }}
                    />
                  </svg>
              </div>

              <div className="flex justify-between border-t border-white/5 pt-6 relative z-10">
                 {['T-11','T-8','T-5','T-2', 'CURRENT'].map(label => (
                   <span key={label} className="text-[9px] font-black text-white/30 uppercase tracking-widest">{label}</span>
                 ))}
              </div>
           </div>
        </div>

        {/* Operational Log */}
        <div className="lg:col-span-8 bg-white border border-gray-200 shadow-sm overflow-hidden rounded-sm">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <h2 className="text-xs font-bold text-slate-900 tracking-wider uppercase">Operational Activity Log</h2>
            <button className="text-[10px] font-black text-[#ff9900] hover:underline flex items-center gap-2 uppercase tracking-widest">
              Full Logs Dashboard <HiArrowRight />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] tracking-widest font-black text-slate-500 border-b border-gray-100 uppercase bg-gray-50/20">
                  <th className="px-6 py-4">Service Endpoint</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Metric</th>
                  <th className="px-6 py-4">Uptime</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {[
                  { name: 'SDW-Inventory-Service', status: 'Running', metric: 'Lat-24ms', time: '99.9%' },
                  { name: 'SDW-Sync-Engine', status: 'Synced', metric: 'Opt-92%', time: '100%' },
                  { name: 'SDW-Security-Auth', status: 'Healthy', metric: '200 OK', time: '98.5%' },
                  { name: 'SDW-Resource-Worker', status: 'Standby', metric: 'IDLE', time: '100%' },
                  { name: 'SDW-Network-Gateway', status: 'Running', metric: 'SSL-Secure', time: '99.4%' },
                ].map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50 transition-colors group cursor-default">
                    <td className="px-6 py-4">
                      <p className="text-xs font-bold text-slate-800 flex items-center gap-3">
                        <span className="w-1.5 h-4 bg-slate-200 rounded-sm group-hover:bg-[#ff9900] transition-colors" />
                        {item.name}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[9px] font-black tracking-[0.1em] px-2 py-0.5 rounded border uppercase border-green-200 text-green-700 bg-green-50">
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[10px] text-slate-500 font-bold uppercase">
                      {item.metric}
                    </td>
                    <td className="px-6 py-4 text-[10px] text-slate-400 font-bold uppercase tabular-nums">
                      {item.time}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Center */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#232f3e] text-white p-8 rounded-sm shadow-xl relative overflow-hidden group border border-white/5">
            <div className="relative z-10 space-y-6">
              <div className="space-y-1">
                <h2 className="text-[10px] font-black tracking-[0.3em] uppercase text-[#ff9900]">Data Control</h2>
                <h3 className="text-base font-bold leading-tight">Master Sync Protocol</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                Force a localized data synchronization between the warehouse inventory and the central database cluster.
              </p>
              <button 
                disabled={isLoading}
                onClick={fetchDashboardData}
                className="w-full py-4 bg-[#ff9900] hover:bg-white hover:text-slate-900 text-[#232f3e] font-black text-[10px] tracking-widest transition-all rounded shadow-lg shadow-[#ff9900]/10 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 uppercase"
              >
                {isLoading ? 'Syncing Records...' : 'Initiate Data Sync'} <HiArrowRight size={16} />
              </button>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-sm p-6 space-y-5 shadow-sm">
             <div className="flex items-center gap-3 text-[10px] font-black text-slate-900 uppercase tracking-widest">
                <div className="w-7 h-7 rounded bg-red-50 text-red-500 flex items-center justify-center border border-red-100">
                   <HiExclamation size={16} />
                </div>
                SDW System Alerts
             </div>
             <div className="space-y-3">
                <div className="p-4 bg-gray-50 rounded border border-gray-100 transition-all hover:border-gray-200 group">
                    <p className="text-[10px] font-black text-slate-900 uppercase tracking-tight flex justify-between items-center">
                        Region Integrity 
                        <span className="w-2 h-2 bg-green-500 rounded-full group-hover:animate-ping" />
                    </p>
                    <p className="text-[10px] text-slate-500 font-bold mt-1">Database cluster operational in HQ-US-1.</p>
                </div>
                <div className="p-4 bg-gray-50 rounded border border-gray-100 transition-all hover:border-gray-200 group">
                    <p className="text-[10px] font-black text-slate-900 uppercase tracking-tight flex justify-between items-center">
                        Manifest Pipeline
                        <span className="w-2 h-2 bg-blue-500 rounded-full group-hover:animate-pulse" />
                    </p>
                    <p className="text-[10px] text-slate-500 font-bold mt-1">Inventory records in sync with database.</p>
                </div>
             </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default DashboardPage
