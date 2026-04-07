const fs = require('fs');
const path = 'C:/Users/Gavrawa/Documents/My Courses Node and Rect/warehouse final project/southern-design-warehouse/app/admin/content/page.tsx';
let content = fs.readFileSync(path, 'utf8');

const startMarker = '{/* About Page Specialized Sections */}';
const endMarker = '                        )}';

const startIndex = content.indexOf(startMarker);
if (startIndex === -1) {
    console.log("Could not find start marker.");
    process.exit(1);
}

// Find the first ')}' after the start marker that is correctly indented
let currentSearchIndex = startIndex;
let endIndex = -1;
while (true) {
    const foundIndex = content.indexOf(endMarker, currentSearchIndex);
    if (foundIndex === -1) break;
    
    // Check if this is the closing bracket for the about section
    // The mission/vision textareas end around line 815, so the ')}' is at 817.
    // Let's just look for the first one that has exactly the right indentation.
    endIndex = foundIndex + endMarker.length;
    break; 
}

if (endIndex === -1) {
    console.log("Could not find end marker.");
    process.exit(1);
}

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

const finalContent = content.substring(0, startIndex) + newBlock + content.substring(endIndex);
fs.writeFileSync(path, finalContent);
console.log("SUCCESS: Replaced About section with Quill editors.");
