const fs = require('fs'); 

async function modifyFile() {
    // Check if a file path was provided as a command-line argument
    if (process.argv.length < 3) {
        console.error('Usage: node modifyFrontEndService.js <file_path>'); //
        process.exit(1); // Exit with an error code
    }

    const filePath = process.argv[2]; // The file path is the third element in process.argv

    try {
        let fileContent = await fs.promises.readFile(filePath, 'utf8');

        let updatedContent;
        if (fileContent.includes(lineToChange)) {
            // Remove the period
            updatedContent = fileContent.replace(lineToChange, lineWithoutPeriod);
            console.log(`Period removed from "${filePath}".`);
        } else if (fileContent.includes(lineWithoutPeriod)) {
            // Add the period
            updatedContent = fileContent.replace(lineWithoutPeriod, lineWithPeriod);
            console.log(`Period added to "${filePath}".`);
        } else {
            console.log(`Neither "${lineToChange}" nor "${lineWithoutPeriod}" found in "${filePath}". No changes made.`);
            return; // Exit if the line isn't found
        }

        await fs.promises.writeFile(filePath, updatedContent, 'utf8');
        console.log('File successfully updated!');
    } catch (error) {
        console.error('Error modifying file:', error); // Basic error handling for file operations
    }
}

modifyFile();
