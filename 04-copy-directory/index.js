const { copyFile, mkdir, readdir, rm } = require('node:fs/promises');
const path = require('path');

const directorySrc = path.join(__dirname, 'files');
const directoryDst = path.join(__dirname, 'files-copy');

rm(directoryDst, {recursive: true, force: true})
  .then(() => {
    mkdir(directoryDst, {recursive: true})
      .then(
        readdir(directorySrc, {withFileTypes: true})
          .then(files => files.forEach(file =>{
            if(file.isFile) {
              const fileSrc = path.join(file.path, file.name);
              const fileDst = path.join(directoryDst, file.name);
              copyFile(fileSrc, fileDst)
                .then(() => console.log(`${file.name} copied`))
                .catch(console.error);
            }
          }))
      )
      .catch(console.error);
  })
  .catch(console.error);
