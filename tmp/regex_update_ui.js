const fs = require('fs');
const path = 'C:/Users/Gavrawa/Documents/My Courses Node and Rect/warehouse final project/southern-design-warehouse/app/admin/content/page.tsx';
let content = fs.readFileSync(path, 'utf8');

const regex = /{\/\* About Page Specialized Sections \*\/}\s*\{selectedPage === 'about' && \(.*?\n\s*\)\}/s;

const newBlock = `{/* About Page Specialized Sections */}
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

if (regex.test(content)) {
    content = content.replace(regex, newBlock);
    fs.writeFileSync(path, content);
    console.log("SUCCESS: Replaced About section with Quill editors using Regex.");
} else {
    console.log("Regex match failed. Block structure might be different than expected.");
    // Try a very broad regex just to see if we can find ANY part of it
    const partialMatch = content.match(/{\/\* About Page Specialized Sections \*\//);
    console.log("Partial match (Comment): " + (partialMatch ? "Found" : "Not Found"));
}
