const fs = require("fs");

// Get file path from command-line arguments
const filePath = process.argv[2];
if (!filePath) {
    console.error("Usage: node editShippinService.js <path-to-file>");
    process.exit(1);
}

// Read file
let content = fs.readFileSync(filePath, "utf8");

// Pattern matches the exact fmt.Print line (ignores spaces/tabs)
const regexWithExclamation = /fmt\.Print\(\s*"GetQuote produces a shipping quote!"\s*\)/;
const regexWithoutExclamation = /fmt\.Print\(\s*"GetQuote produces a shipping quote"\s*\)/;

if (regexWithExclamation.test(content)) {
    // Remove the exclamation point
    content = content.replace(regexWithExclamation, 'fmt.Print("GetQuote produces a shipping quote")');
    console.log("Removed exclamation point from GetQuote print statement.");
} else if (regexWithoutExclamation.test(content)) {
    // Add the exclamation point
    content = content.replace(regexWithoutExclamation, 'fmt.Print("GetQuote produces a shipping quote!")');
    console.log("Added exclamation point to GetQuote print statement.");
} else {
    console.log("Target fmt.Print statement not found. No changes made.");
}

// Write changes back
fs.writeFileSync(filePath, content, "utf8");

