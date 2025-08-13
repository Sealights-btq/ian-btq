const fs = require("fs");

// Get file path from arguments
const filePath = process.argv[2];
if (!filePath) {
    console.error("Usage: node editRecommendationService.js <path-to-file>");
    process.exit(1);
}

// Read file
let content = fs.readFileSync(filePath, "utf8");

if (content.includes('print("Make call to server now!")')) {
    // Remove the exclamation point
    content = content.replace(
        /print\("Make call to server now!"\)/,
        'print("Make call to server now")'
    );
    console.log("Removed exclamation point from print statement.");
} else if (content.includes('print("Make call to server now")')) {
    // Add the exclamation point
    content = content.replace(
        /print\("Make call to server now"\)/,
        'print("Make call to server now!")'
    );
    console.log("Added exclamation point to print statement.");
} else {
    console.log("Target print statement not found. No changes made.");
}

// Write file back
fs.writeFileSync(filePath, content, "utf8");

