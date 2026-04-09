"use client";

import React, { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";

import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTiktok,
  FaYoutube,
  FaShareAlt,
} from "react-icons/fa";
import {
  HiOutlinePhone,
  HiOutlineMail,
  HiOutlineLocationMarker,
} from "react-icons/hi";
import { getSiteSettings, createQuoteRequest, getSocialLinks, getPageContent, type PageContent, type SiteSettings } from "@/lib/actions";
import ResponsiveHero from "@/components/ui/ResponsiveHero";

export default function ContactPage() {
  const [settings, setSettings] = useState({
    phone: "1-800-555-0199",
    email: "info@southerndesignwarehouse.com",
    address: "123 Design Blvd.\nAtlanta, GA 30301",
  });

  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<PageContent | null>(null);
  const [socialLinks, setSocialLinks] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settingsData, contentData, socialData] = await Promise.all([
          getSiteSettings(),
          getPageContent('contact'),
          getSocialLinks()
        ]);

        if (settingsData) {
          const s = settingsData as SiteSettings;
          setSettings((prev) => ({
            phone: s.phone || prev.phone,
            email: s.email || prev.email,
            address: s.address || prev.address,
          }));
        }
        setContent(contentData);
        setSocialLinks(socialData);
      } catch (err) {
        console.error("Failed to fetch contact data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const defaultHero =
    "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=2000&auto=format&fit=crop";

  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">Loading contact form...</div>}>
      <ContactForm content={content} settings={settings} socialLinks={socialLinks} loading={loading} defaultHero={defaultHero} />
    </Suspense>
  );
}

function ContactForm({ content, settings, socialLinks, loading, defaultHero }: any) {
  const searchParams = useSearchParams();
  const projectName = searchParams.get('project');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{
    success?: string;
    error?: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget; 
    setIsSubmitting(true);
    setSubmissionResult(null);

    try {
      const formData = new FormData(form); 
      const result = await createQuoteRequest(formData);

      if (result && !result.error) {
        setSubmissionResult({ success: "Request sent successfully!" });
        form.reset(); 
      } else {
        setSubmissionResult({
          error: result?.error || "Something went wrong. Please try again.",
        });
      }
    } catch (error) {
      console.error("Submission error:", error);
      setSubmissionResult({ success: "Request sent successfully!" });
      form.reset(); 
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (submissionResult) {
      const timer = setTimeout(() => {
        setSubmissionResult(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [submissionResult]);

  const defaultMessage = projectName 
    ? `Hello, I am interested in learning more about the project: "${projectName}" featured in your gallery. Could you provide details about the materials used and a possible quote?`
    : "";

  return (
    <div className="min-h-screen bg-gray-50 font-[arial]" style={{ fontSize: content?.fontSize || 'inherit' }}>
      {/*  HERO WITH MOTION (UPDATED) */}
      <section className="relative h-[45vh] md:h-[55vh] flex items-center justify-center text-center text-white px-6 overflow-hidden">
        <ResponsiveHero
          heroUrl={content?.heroUrl || defaultHero}
          fallbackUrl={defaultHero}
          alt="Contact"
          brightness="brightness-[0.4]"
        />
        <div className="relative z-10 max-w-3xl">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-6xl font-bold uppercase tracking-tighter text-white"
          >
            {content?.title || "Contact Us"}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-200 mt-4 text-lg"
          >
            {content?.description || "Have questions about materials or planning a project? We’re here to help."}
          </motion.p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="py-16 px-6 md:px-12 -mt-10">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-4 bg-white border-t-4 border-red-600 shadow-lg p-8"
          >
            <h2 className="text-2xl font-bold mb-2 text-gray-900">
              Warehouse Contact
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              Get in touch with our warehouse team for materials, logistics, and project support.
            </p>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <HiOutlinePhone className="text-red-600 w-6 h-6 mt-1" />
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Phone</p>
                  <p className="font-semibold text-gray-800">
                    {loading ? "Loading..." : settings.phone}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <HiOutlineMail className="text-red-600 w-6 h-6 mt-1" />
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Email</p>
                  <p className="font-semibold text-gray-800 break-all">
                    {loading ? "Loading..." : settings.email}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <HiOutlineLocationMarker className="text-red-600 w-6 h-6 mt-1" />
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Address</p>
                  <p className="font-semibold text-gray-800 whitespace-pre-line">
                    {loading ? "Loading..." : settings.address}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-4">
                Follow Us
              </p>
              <div className="flex flex-wrap gap-4">
                {socialLinks.length > 0 ? (
                  socialLinks.map((link: any) => {
                    const Icon = link.platform === 'facebook' ? FaFacebook :
                      link.platform === 'instagram' ? FaInstagram :
                        link.platform === 'tiktok' ? FaTiktok :
                          link.platform === 'linkedin' ? FaLinkedin :
                             link.platform === 'youtube' ? FaYoutube : FaShareAlt;
                    return (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 flex items-center justify-center border rounded-full hover:bg-red-600 hover:text-white transition group"
                        title={link.platform}
                      >
                        <Icon className="text-gray-600 group-hover:text-white" />
                      </a>
                    );
                  })
                ) : (
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">No connections set</p>
                )}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-8 bg-white shadow p-10"
          >
            <h2 className="text-2xl font-bold mb-8">Request Quote</h2>
            <form onSubmit={handleSubmit} className="space-y-8">
              {submissionResult?.success && (
                <div className="p-3 bg-green-100 text-green-700 border border-green-300 text-sm transition-opacity duration-500">
                  {submissionResult.success}
                </div>
              )}
              {submissionResult?.error && (
                <div className="p-3 bg-red-100 text-red-700 border border-red-300 text-sm transition-opacity duration-500">
                  {submissionResult.error}
                </div>
              )}
              <div className="grid md:grid-cols-2 gap-6">
                <input
                  name="name"
                  required
                  placeholder="Name"
                  className="border p-3 focus:border-red-600 outline-none"
                />
                <input
                  name="phone"
                  required
                  placeholder="Phone"
                  className="border p-3 focus:border-red-600 outline-none"
                />
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="Email"
                  className="border p-3 focus:border-red-600 outline-none"
                />
                <select
                  name="projectType"
                  className="border p-3 focus:border-red-600 outline-none bg-white"
                >
                  <option>Kitchen Remodel</option>
                  <option>Flooring Installation</option>
                  <option>Cabinet Update</option>
                  <option>Other</option>
                </select>
              </div>
              <input
                name="materials"
                placeholder="Materials Needed"
                className="w-full border p-3 focus:border-red-600 outline-none"
              />
              <textarea
                name="message"
                required
                rows={5}
                defaultValue={defaultMessage}
                placeholder="Message..."
                className="w-full border p-3 focus:border-red-600 outline-none"
              />
              <button
                disabled={isSubmitting}
                className="bg-red-600 hover:bg-black text-white px-8 py-3 font-bold disabled:opacity-50 transition"
              >
                {isSubmitting ? "Sending..." : "Submit Request"}
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* MAP SECTION */}
      <section className="pb-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white p-4 shadow-xl">
            <div className="flex items-center gap-2 mb-6">
              <HiOutlineLocationMarker className="text-red-600 w-6 h-6" />
              <h2 className="text-lg lg:text-xl font-bold uppercase tracking-widest text-gray-800">Find Our Warehouse</h2>
            </div>
            <div className="w-full h-[450px] border border-gray-200">
              <iframe
                src="https://www.google.com/maps?q=8524+E+Adamo+Dr,+Tampa,+FL+33619,+USA&output=embed"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Southern Design Warehouse Location"
                className="brightness-110 hover:grayscale-0 transition-all duration-700"
              ></iframe>
            </div>
            <div className="mt-6 flex flex-col md:flex-row justify-between items-center text-sm font-bold text-gray-500 uppercase tracking-tighter gap-4">
              <p className="flex items-center gap-2 text-center md:text-left">
                <span className="text-red-600">Office Address:</span> 8524 E Adamo Dr, Tampa, FL 33619, USA
              </p>
              <a 
                href="https://www.google.com/maps/dir//8524+E+Adamo+Dr,+Tampa,+FL+33619,+USA"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black text-white px-8 py-3 hover:bg-red-600 transition duration-300 shadow-md"
              >
                Get Directions
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}