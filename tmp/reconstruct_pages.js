const fs = require('fs');
const filePath = 'C:\\Users\\Gavrawa\\Documents\\My Courses Node and Rect\\warehouse final project\\southern-design-warehouse\\app\\admin\\content\\page.tsx';
let content = fs.readFileSync(filePath, 'utf8');

const pagesStartStr = "{activeTab === 'pages' && (";
const footerStartStr = "{activeTab === 'footer' && (";

const startIndex = content.indexOf(pagesStartStr);
const endIndex = content.indexOf(footerStartStr);

if (startIndex === -1 || endIndex === -1) {
    console.error('Could not find markers');
    process.exit(1);
}

const beforePart = content.substring(0, startIndex);
const afterPart = content.substring(endIndex);

const cleanPagesContent = `{activeTab === 'pages' && (
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
                                      if(confirm('Purge hero image?')) {
                                        await deletePageImage(selectedPage, 'hero')
                                        fetchPageContent(selectedPage)
                                      }
                                    }}
                                    className="text-[9px] font-black text-red-500 uppercase tracking-widest hover:underline"
                                  >
                                    Purge Hero
                                  </button>
                                )}
                             </div>
                             <div 
                                className={\`relative group/hero h-48 border-2 border-dashed rounded-sm flex flex-col items-center justify-center transition-all overflow-hidden \${
                                  dragActive === 'hero' ? 'border-[#ff9900] bg-[#ff9900]/5' : 'border-gray-200 bg-slate-50/30 hover:border-[#ff9900]/40'
                                }\`}
                                onDragOver={(e) => { e.preventDefault(); setDragActive('hero') }}
                                onDragLeave={() => setDragActive(null)}
                                onDrop={(e) => {
                                  e.preventDefault()
                                  setDragActive(null)
                                  const file = e.dataTransfer.files?.[0]
                                  if(file) {
                                    setPageContent((prev) => ({ ...prev, heroUrl: URL.createObjectURL(file) }));
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
                                      <HiPhotograph size={28} className={\`mx-auto transition-colors \${dragActive === 'hero' ? 'text-[#ff9900]' : 'text-slate-300'}\`} />
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
                                    if(file) {
                                      setPageContent((prev) => ({ ...prev, heroUrl: URL.createObjectURL(file) }));
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
                                      if(confirm('Purge tablet hero?')) {
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
                                className={\`relative group/tablet h-40 border-2 border-dashed rounded-sm flex flex-col items-center justify-center transition-all overflow-hidden \${
                                  dragActive === 'tablet' ? 'border-[#ff9900] bg-[#ff9900]/5' : 'border-gray-200 bg-slate-50/30 hover:border-[#ff9900]/40'
                                }\`}
                                onDragOver={(e) => { e.preventDefault(); setDragActive('tablet') }}
                                onDragLeave={() => setDragActive(null)}
                                onDrop={(e) => {
                                  e.preventDefault()
                                  setDragActive(null)
                                  const file = e.dataTransfer.files?.[0]
                                  if(file) {
                                    setPageContent((prev) => ({ ...prev, heroTabletUrl: URL.createObjectURL(file) }));
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
                                      <HiPhotograph size={24} className={\`mx-auto transition-colors \${dragActive === 'tablet' ? 'text-[#ff9900]' : 'text-slate-300'}\`} />
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
                                    if(file) {
                                      setPageContent((prev) => ({ ...prev, heroTabletUrl: URL.createObjectURL(file) }));
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
                                      if(confirm('Purge mobile hero?')) {
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
                                className={\`relative group/mobile h-40 border-2 border-dashed rounded-sm flex flex-col items-center justify-center transition-all overflow-hidden \${
                                  dragActive === 'mobile' ? 'border-[#ff9900] bg-[#ff9900]/5' : 'border-gray-200 bg-slate-50/30 hover:border-[#ff9900]/40'
                                }\`}
                                onDragOver={(e) => { e.preventDefault(); setDragActive('mobile') }}
                                onDragLeave={() => setDragActive(null)}
                                onDrop={(e) => {
                                  e.preventDefault()
                                  setDragActive(null)
                                  const file = e.dataTransfer.files?.[0]
                                  if(file) {
                                    setPageContent((prev) => ({ ...prev, heroMobileUrl: URL.createObjectURL(file) }));
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
                                      <HiPhotograph size={24} className={\`mx-auto transition-colors \${dragActive === 'mobile' ? 'text-[#ff9900]' : 'text-slate-300'}\`} />
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
                                    if(file) {
                                      setPageContent((prev) => ({ ...prev, heroMobileUrl: URL.createObjectURL(file) }));
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
                                      if(confirm('Purge content image?')) {
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
                                className={\`relative group/content aspect-video border-2 border-dashed rounded-sm flex flex-col items-center justify-center transition-all overflow-hidden \${
                                  dragActive === 'content' ? 'border-[#ff9900] bg-[#ff9900]/5' : 'border-gray-200 bg-slate-50/30 hover:border-[#ff9900]/40'
                                }\`}
                                onDragOver={(e) => { e.preventDefault(); setDragActive('content') }}
                                onDragLeave={() => setDragActive(null)}
                                onDrop={(e) => {
                                  e.preventDefault()
                                  setDragActive(null)
                                  const file = e.dataTransfer.files?.[0]
                                  if(file) {
                                    setPageContent((prev) => ({ ...prev, contentUrl: URL.createObjectURL(file) }));
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
                                      <HiPhotograph size={28} className={\`mx-auto transition-colors \${dragActive === 'content' ? 'text-[#ff9900]' : 'text-slate-300'}\`} />
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
                                    if(file) {
                                      setPageContent((prev) => ({ ...prev, contentUrl: URL.createObjectURL(file) }));
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
                          <div className="space-y-2">
                             <label className="text-[11px] font-black text-slate-500 uppercase tracking-tight italic">Page Headline (H1 Override)</label>
                             <input 
                               name="title" 
                               defaultValue={pageContent?.title || ''} 
                               className="w-full px-4 py-2.5 border border-gray-300 rounded text-xs font-bold outline-none focus:border-[#ff9900] bg-white shadow-sm" 
                               placeholder="Catchy Page Title..." 
                               key={\`\${selectedPage}-title\`}
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
                               key={\`\${selectedPage}-desc\`}
                             />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[11px] font-black text-slate-500 uppercase tracking-tight italic">Hero Material Categories (Dot-Separated)</label>
                             <input 
                               name="heroText" 
                               defaultValue={pageContent?.heroText || ''} 
                               className="w-full px-4 py-2.5 border border-gray-300 rounded text-[10px] font-black uppercase tracking-widest outline-none focus:border-[#ff9900] bg-white shadow-sm" 
                               placeholder="e.g. TILES • VANITIES • FLOORING" 
                               key={\`\${selectedPage}-tags\`}
                             />
                          </div>
                       </div>

                       {/* About Page Specialized Sections */}
                       {selectedPage === 'about' && (
                         <motion.div 
                           initial={{ opacity: 0, y: 10 }}
                           animate={{ opacity: 1, y: 0 }}
                           className="space-y-8 pt-8 border-t border-gray-100"
                         >
                            <div className="space-y-2">
                               <label className="text-[11px] font-black text-[#ff9900] uppercase tracking-[0.2em] flex items-center gap-2">
                                  Our Story (HTML/Text)
                                  <span className="text-[9px] font-black text-slate-300 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded">Narrative Section</span>
                               </label>
                               <textarea 
                                 name="story" 
                                 defaultValue={pageContent?.metadata?.story || ''} 
                                 rows={12} 
                                 className="w-full px-4 py-4 border border-gray-300 rounded text-xs leading-relaxed font-bold outline-none focus:border-[#ff9900] bg-white shadow-sm resize-y" 
                                 placeholder="The Southern Design Warehouse Story content here... (HTML supported)" 
                                 key={\`\${selectedPage}-story\`}
                               />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                               <div className="space-y-2">
                                  <label className="text-[11px] font-black text-[#ff9900] uppercase tracking-[0.2em]">Our Mission Statement</label>
                                  <textarea 
                                    name="mission" 
                                    defaultValue={pageContent?.metadata?.mission || ''} 
                                    rows={4} 
                                    className="w-full px-4 py-3 border border-gray-300 rounded text-xs leading-relaxed font-bold outline-none focus:border-[#ff9900] bg-white shadow-sm resize-none" 
                                    placeholder="To empower the builders of tomorrow..." 
                                    key={\`\${selectedPage}-mission\`}
                                  />
                               </div>
                               <div className="space-y-2">
                                  <label className="text-[11px] font-black text-[#ff9900] uppercase tracking-[0.2em]">Our Vision Statement</label>
                                  <textarea 
                                    name="vision" 
                                    defaultValue={pageContent?.metadata?.vision || ''} 
                                    rows={4} 
                                    className="w-full px-4 py-3 border border-gray-300 rounded text-xs leading-relaxed font-bold outline-none focus:border-[#ff9900] bg-white shadow-sm resize-none" 
                                    placeholder="To be the most technologically advanced..." 
                                    key={\`\${selectedPage}-vision\`}
                                  />
                               </div>
                            </div>
                         </motion.div>
                       )}
                    </div>
                  )}
                </motion.div>
              )}

              `;

fs.writeFileSync(filePath, beforePart + cleanPagesContent + afterPart);
console.log('Successfully reconstructed the Pages tab structure.');
