const fs = require('fs');
const filePath = 'C:\\Users\\Gavrawa\\Documents\\My Courses Node and Rect\\warehouse final project\\southern-design-warehouse\\app\\admin\\content\\page.tsx';
const lines = fs.readFileSync(filePath, 'utf8').split('\n');

// The error is at line 746 (1-indexed), so index 745.
// Let's verify it's the extra '/>'
if (lines[745].includes('/>') && lines[744].includes('/>')) {
    lines.splice(745, 1);
    fs.writeFileSync(filePath, lines.join('\n'));
    console.log('Successfully removed redundant tag at line 746.');
} else {
    console.error('Line 746 does not seem to be the redundant tag. Lines are:', lines[744], lines[745]);
    process.exit(1);
}
