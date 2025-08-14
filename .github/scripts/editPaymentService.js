const fs = require('fs');
const path = require('path');

if (process.argv.length < 3) {
  console.error('Usage: node editPaymentService.js <path-to-file.js>');
  process.exit(1);
}

const filePath = path.resolve(process.argv[2]);

if (!fs.existsSync(filePath)) {
  console.error(`Error: File not found – ${filePath}`);
  process.exit(1);
}

let content = fs.readFileSync(filePath, 'utf8');

const patternInvalid = /super\(`Credit card info is invalid`\);/;
const patternNotValid = /super\(`Credit card info is not valid`\);/;

if (patternInvalid.test(content)) {
  content = content.replace(
    patternInvalid,
    'super(`Credit card info is not valid`);'
  );
  console.log('Changed "invalid" → "not valid".');
} else if (patternNotValid.test(content)) {
  content = content.replace(
    patternNotValid,
    'super(`Credit card info is invalid`);'
  );
  console.log('Reverted "not valid" → "invalid".');
} else {
  console.log('No matching line found. No changes made.');
}

fs.writeFileSync(filePath, content, 'utf8');

