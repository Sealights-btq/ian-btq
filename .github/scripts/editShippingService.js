const fs = require("fs");
const path = require("path");

if (process.argv.length < 3) {
  console.error("Usage: node editShippingService.js <file>");
  process.exit(1);
}

const filePath = path.resolve(process.argv[2]);

try {
  let content = fs.readFileSync(filePath, "utf8");

  const target = 'log.Info("Tracing enabled, but temporarily unavailable")';
  const targetWithPeriod = 'log.Info("Tracing enabled, but temporarily unavailable.")';

  // Only replace if it matches exactly without the period
  if (content.includes(target)) {
    content = content.replace(target, targetWithPeriod);
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`Updated line in: ${filePath}`);
  } else {
    console.log(`No change needed in: ${filePath}`);
  }

} catch (err) {
  console.error(`Error reading or writing file: ${err.message}`);
  process.exit(1);
}
