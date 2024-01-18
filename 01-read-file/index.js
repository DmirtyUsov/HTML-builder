const fs = require('fs');
const path = require('path');

const fileToRead = path.join(__dirname, 'text.txt');
const readStream = fs.createReadStream(fileToRead, {encoding: 'utf8'});

readStream.pipe(process.stdout);
