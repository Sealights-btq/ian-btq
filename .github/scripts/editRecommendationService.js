
const fs = require('fs').promises; // Use the promise-based fs API.

async function editFile(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf8'); // Read the file content.
    const lines = data.split(/\r?\n/); // Split the content into lines.

    const targetLine = "logger.info(\"Successfully started Stackdriver Profiler.\")"; // The target line to check

    let fileModified = false;
    const newLines = lines.map(line => {
      if (line.includes("logger.info(\"Successfully started Stackdriver Profiler")) {
        const hasPeriod = line.endsWith(".\")");
        if (hasPeriod) {
          fileModified = true;
          return line.slice(0, -2) + "\")"; // Remove the period.
        } else {
          fileModified = true;
          return line.slice(0, -1) + ".\")"; // Add the period.
        }
      }
      return line;
    });

    if (fileModified) {
      await fs.writeFile(filePath, newLines.join('\n'), 'utf8'); // Write the modified content back to the file.
      console.log(`File '${filePath}' modified successfully.`);
    } else {
      console.log(`File '${filePath}' did not contain the target line or did not require modification.`);
    }

  } catch (err) {
    console.error(`Error editing file: ${err.message}`);
  }
}

// Get the file path from the command line arguments.
const filePath = process.argv[2];

if (!filePath) {
  console.error("Please provide the file path as a command-line argument.");
  console.error("Usage: node editRecommendationService.js <file_path>");
  process.exit(1);
}

editFile(filePath);
