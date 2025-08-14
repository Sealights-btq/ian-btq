const fs = require('fs');

// The target line to modify
const targetLine = "  logger.info('Client for email service.')";

// Get the file path from command line arguments
// process.argv[0] is 'node'
// process.argv[1] is the script file path itself
// So, process.argv[2] will be the first argument passed
const filePath = process.argv[2];

// Check if a file path was provided
if (!filePath) {
  console.error('Usage: node editEmailService.js <path_to_python_file>');
  process.exit(1); // Exit with an error code
}

fs.readFile(filePath, 'utf8', (err, data) => { // Read the file
  if (err) {
    console.error(`Error reading the file "${filePath}":`, err);
    return;
  }

  const lines = data.split('\n'); // Split the file content into an array of lines

  const modifiedLines = lines.map(line => {
    if (line === targetLine) {
      if (line.endsWith('.')) {
        return line.slice(0, -1); // Remove the period if it exists
      } else {
        return line + '.'; // Add a period if it doesn't exist
      }
    }
    return line; // Return the line unchanged if it's not the target line
  });

  const modifiedContent = modifiedLines.join('\n'); // Join the lines back into a single string

  fs.writeFile(filePath, modifiedContent, 'utf8', (err) => { // Write the modified content back to the file
    if (err) {
      console.error(`Error writing to the file "${filePath}":`, err);
      return;
    }
    console.log(`File "${filePath}" modified successfully!`);
  });
});

