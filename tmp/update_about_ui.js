const fs = require('fs');
const path = 'C:/Users/Gavrawa/Documents/My Courses Node and Rect/warehouse final project/southern-design-warehouse/app/admin/content/page.tsx';
let content = fs.readFileSync(path, 'utf8');

const oldBlock = `                        {/* About Page Specialized Sections */}
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
                        )}`;

const newBlock = `                        {/* About Page Specialized Sections */}
                        {selectedPage === 'about' && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-8 pt-8 border-t border-gray-100"
                          >
                             <div className="space-y-2">
                                <label className="text-[11px] font-black text-[#ff9900] uppercase tracking-[0.2em] flex items-center gap-2">
                                   Our Story (Rich Text)
                                   <span className="text-[9px] font-black text-slate-300 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded">Narrative Section</span>
                                </label>
                                <div className="quill-container rounded-sm border border-gray-200 overflow-hidden shadow-inner bg-white">
                                  <ReactQuill 
                                    theme="snow"
                                    value={storyContent}
                                    onChange={setStoryContent}
                                    modules={quillModules}
                                    placeholder="The Southern Design Warehouse Story content here..."
                                  />
                                </div>
                                <input type="hidden" name="story" value={storyContent} />
                             </div>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                   <label className="text-[11px] font-black text-[#ff9900] uppercase tracking-[0.2em]">Our Mission Statement</label>
                                   <div className="quill-container rounded-sm border border-gray-200 overflow-hidden shadow-inner bg-white">
                                      <ReactQuill 
                                        theme="snow"
                                        value={missionContent}
                                        onChange={setMissionContent}
                                        modules={quillModules}
                                        placeholder="To empower the builders of tomorrow..."
                                      />
                                   </div>
                                   <input type="hidden" name="mission" value={missionContent} />
                                </div>
                                <div className="space-y-2">
                                   <label className="text-[11px] font-black text-[#ff9900] uppercase tracking-[0.2em]">Our Vision Statement</label>
                                   <div className="quill-container rounded-sm border border-gray-200 overflow-hidden shadow-inner bg-white">
                                      <ReactQuill 
                                        theme="snow"
                                        value={visionContent}
                                        onChange={setVisionContent}
                                        modules={quillModules}
                                        placeholder="To be the most technologically advanced..."
                                      />
                                   </div>
                                   <input type="hidden" name="vision" value={visionContent} />
                                </div>
                             </div>
                          </motion.div>
                        )}`;

if (content.includes(oldBlock)) {
    content = content.replace(oldBlock, newBlock);
    fs.writeFileSync(path, content);
    console.log("Successfully updated the About section UI.");
} else {
    // Try a more flexible search if the exact match fails
    console.log("Exact block match failed. Attempting partial replacement...");
    const textareaRegex = /<textarea[^>]*name="story"[^>]*\/>/g;
    if (content.match(textareaRegex)) {
        console.log("Found textareas. This script needs refinement or manual edit.");
    } else {
        console.log("Could not find the target textareas.");
    }
}
