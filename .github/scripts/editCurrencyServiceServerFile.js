const fs = require('fs');

// File path is passed as the first command-line argument
const filePath = process.argv[2];
if (!filePath) {
    console.error('Usage: node editCurrencyServiceServerFile.js <file-path>');
    process.exit(1);
}

// Read file contents
let content = fs.readFileSync(filePath, 'utf8');

// Regex: capture before, the optional dot, and after
const regex = /(console\.log\("Profiler enabled)(\.)?("\);)/;

// Toggle period
content = content.replace(regex, (match, before, dot, after) => {
    if (dot) {
        // Has a period → remove it
        return `${before}${after}`;
    } else {
        // No period → add it
        return `${before}.${after}`;
    }
});

// Write back to the file
fs.writeFileSync(filePath, content, 'utf8');
console.log(`Toggled period in: ${filePath}`);
