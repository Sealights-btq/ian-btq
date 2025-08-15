const fs = require("fs");
const path = require("path");

if (process.argv.length !== 4) {
  console.error("Usage: node editProductCatalogService.js <file_path1> <file_path2>");
  process.exit(1);
}

const filePath1 = path.resolve(process.argv[2]);
const filePath2 = path.resolve(process.argv[3]);

function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, "utf8");
    const targetWithExcl = 'fmt.Println("Calling Function!")';
    const targetNoExcl = 'fmt.Println("Calling Function")';
    
    if (content.includes(targetWithExcl)) {
      content = content.replace(targetWithExcl, targetNoExcl);
      console.log(`Removed exclamation mark after "Function" in ${filePath}`);
    } else if (content.includes(targetNoExcl)) {
      content = content.replace(targetNoExcl, targetWithExcl);
      console.log(`Added exclamation mark after "Function" in ${filePath}`);
    } else {
      console.log(`Target line not found in ${filePath}`);
    }
    
    fs.writeFileSync(filePath, content, "utf8");
  } catch (err) {
    console.error(`Error processing file ${filePath}: ${err.message}`);
    process.exit(1);
  }
}

// Process both files
processFile(filePath1);
processFile(filePath2);
