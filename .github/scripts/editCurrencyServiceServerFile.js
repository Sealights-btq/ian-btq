
const fs = require('fs');
const path = require('path');

// File path is passed as the first command-line argument
const filePath = process.argv[2];
if (!filePath) {
    console.error('Usage: node editCurrencyServiceServerFile.js <file-path>');
    process.exit(1);
}

// Read file contents
let content = fs.readFileSync(filePath, 'utf8');

// Define regex to match the line
const regex = /(console\.log\("Profiler enabled)(\.)?("\);)/;

// Replace based on whether a period exists
content = content.replace(regex, (match, before, dot, after) => {
    return dot ? `${before}${after}` : `${before}.${after}`;
});

// Write back to the file
fs.writeFileSync(filePath, content, 'utf8');
console.log(`Updated: ${filePath}`);
