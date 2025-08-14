
const fs = require("fs");
const path = require("path");

if (process.argv.length < 3) {
  console.error("Usage: node editProductCalalogServiceMainGo.js <file_path>");
  process.exit(1);
}

const filePath = path.resolve(process.argv[2]);

try {
  let content = fs.readFileSync(filePath, "utf8");

  const targetWithPeriod = 'log.Info("Profiling enabled.")';
  const targetNoPeriod = 'log.Info("Profiling enabled")';

  if (content.includes(targetWithPeriod)) {
    content = content.replace(targetWithPeriod, targetNoPeriod);
    console.log(`Removed period after "enabled" in ${filePath}`);
  } else if (content.includes(targetNoPeriod)) {
    content = content.replace(targetNoPeriod, targetWithPeriod);
    console.log(`Added period after "enabled" in ${filePath}`);
  } else {
    console.log(`Target line not found in ${filePath}`);
  }

  fs.writeFileSync(filePath, content, "utf8");

} catch (err) {
  console.error(`Error processing file: ${err.message}`);
  process.exit(1);
}
