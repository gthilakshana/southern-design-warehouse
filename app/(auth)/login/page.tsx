"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { HiOutlineHome, HiOutlineLockClosed, HiOutlineMail } from 'react-icons/hi'
import { loginUser } from '@/lib/actions'
import Image from 'next/image'

const LoginPage = () => {
  const router = useRouter()
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const result = await loginUser(null, formData)

    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4">

      {/* ✅ BACKGROUND IMAGE */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/images/20260225_092039.jpg" // <-- your JPG image
          alt="Warehouse Background"
          fill
          className="object-cover"
          priority
        />

        {/* ✅ CLEAN OVERLAY */}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* ✅ NAVBAR */}
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center z-20">
        <span className="text-sm font-semibold text-gray-700 uppercase">
          Warehouse System
        </span>

        <Link
          href="/"
          className="flex items-center gap-2 text-xs font-semibold text-gray-600 hover:text-red-600 transition"
        >
          <HiOutlineHome />
          Home
        </Link>
      </div>

      {/* ✅ LOGIN CARD */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md bg-white border border-gray-200 p-8 mt-20 shadow-lg"
      >
        {/* HEADER */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 uppercase">
            Login Access
          </h2>
          <div className="w-12 h-[3px] bg-red-600 mt-2" />
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-4 p-3 border-l-4 border-red-600 bg-red-50">
            <p className="text-xs text-red-600 font-semibold uppercase">
              {error}
            </p>
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* EMAIL */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase">
              Email
            </label>

            <div className="relative mt-1">
              <HiOutlineMail className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                name="email"
                type="email"
                required
                className="w-full pl-8 pr-3 py-2 border border-gray-300 focus:border-green-600 outline-none text-sm"
                placeholder="email@example.com"
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase">
              Password
            </label>

            <div className="relative mt-1">
              <HiOutlineLockClosed className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                name="password"
                type="password"
                required
                className="w-full pl-8 pr-3 py-2 border border-gray-300 focus:border-green-600 outline-none text-sm"
              />
            </div>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 text-sm font-semibold uppercase transition active:scale-95 disabled:opacity-70"
          >
            {isLoading ? 'Checking...' : 'Login'}
          </button>

        </form>

        
        {/* FOOTER INSIDE CARD */}
<div className="mt-8 pt-6 border-t border-gray-200 text-center space-y-2">
  
  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
    Southern Design Warehouse
  </p>

  <p className="text-[10px] text-gray-400 uppercase">
    Secure Access Portal
  </p>

</div>
      </motion.div>

      {/* FOOT NOTE */}
      <p className="absolute bottom-4 text-[10px] text-white/70 uppercase z-10">
        Internal System • 2026
      </p>

    </div>
  )
}

export default LoginPage