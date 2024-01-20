const fsPromises = require('node:fs/promises');
const { createReadStream, createWriteStream } = require('fs');

const path = require('path');

const directorySrc = path.join(__dirname, 'styles');
const fileDst = path.join(__dirname, 'project-dist', 'bundle.css');

const createBundle = async () => {
  const files =  await fsPromises.readdir(directorySrc, {withFileTypes: true});
  const cssFiles = [];
  const writeStream = createWriteStream(fileDst);
  files.forEach(file => {
    const srcFile = path.join(file.path, file.name);
    if(file.isFile && path.extname(srcFile) === '.css') {
      cssFiles.push(srcFile);
    }
  })
  cssFiles.forEach(css => {
    createReadStream(css).pipe(writeStream);
  })
}

createBundle();
