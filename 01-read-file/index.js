const fs = require('fs');
const path = require('path');

const fileToRead = path.join(__dirname, 'text.txt');
const readStream = fs.createReadStream(fileToRead, {encoding: 'utf8'});

// Option 1
// readStream.on('data', chunk => {
//   console.log(chunk);
// })

// Option 2
readStream.pipe(process.stdout);

// exit on uncaught errors
process.on('uncaughtException', err => {
  console.log(`Uncaught error: ${err}`);
  process.exit(1);
})