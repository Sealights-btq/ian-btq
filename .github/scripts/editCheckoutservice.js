// toggle-exclamation.js
const fs = require("fs");
const path = require("path");

if (process.argv.length !== 3) {
  console.error("Usage: node editCheckoutservice.js <file>");
  console.error("Error: You must specify exactly one file.");
  process.exit(1);
}

const filePath = process.argv[2];
const absPath = path.resolve(filePath);

// Check if file exists before doing anything
if (!fs.existsSync(absPath)) {
  console.error(`Error: File not found - ${absPath}`);
  process.exit(1);
}

try {
  let content = fs.readFileSync(absPath, "utf8");

  const regex = /fmt\.Println\("Starting main\(\) function(!?)"\)/;

  if (regex.test(content)) {
    content = content.replace(regex, (match, exclamation) => {
      if (exclamation) {
        // Remove the exclamation mark
        return 'fmt.Println("Starting main() function")';
      } else {
        // Add the exclamation mark
        return 'fmt.Println("Starting main() function!")';
      }
    });

    fs.writeFileSync(absPath, content, "utf8");
    console.log(`Updated: ${absPath}`);
  } else {
    console.log(`No matching line found in: ${absPath}`);
  }
} catch (err) {
  console.error(`Error processing ${absPath}:`, err.message);
}

