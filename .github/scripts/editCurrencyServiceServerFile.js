
const fs = require('fs');

// 1. Make a check for two files to be specified as arguments
// process.argv[0] is 'node', process.argv[1] is the script path
const file1Path = process.argv[2];
const file2Path = process.argv[3];

if (!file1Path || !file2Path) {
    console.error('Usage: node editCurrencyService.js <file1-path> <file2-path>');
    process.exit(1);
}

// Function to process a single file
function processFile(filePath) {
    try {
        // Read file contents
        let content = fs.readFileSync(filePath, 'utf8');

        // 2. Look for "console.log(\"Calling Function!\")" and toggle the exclamation point
        const regex = /(console\.log\("Calling Function")(!)?("\);)/g; // Using 'g' flag for global replacement

        content = content.replace(regex, (match, before, exclamation, after) => {
            if (exclamation) {
                // Has an exclamation point → remove it
                return `${before}${after}`;
            } else {
                // No exclamation point → add it
                return `${before}!${after}`;
            }
        });

        // Write back to the file
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Toggled exclamation point in: ${filePath}`);
    } catch (error) {
        console.error(`Error processing file ${filePath}:`, error.message);
    }
}

// Process both files
processFile(file1Path);
processFile(file2Path);
