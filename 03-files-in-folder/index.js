const fsPromises = require('node:fs/promises');
const path = require('path');

const directoryToStart = path.join(__dirname, 'secret-folder');

fsPromises.readdir(directoryToStart, {withFileTypes: true})
  .then(files => files.forEach(file => {
    if(file.isFile()) {
      const pathToFile = path.join(file.path, file.name)
      fsPromises.stat(pathToFile)
        .then(stats => {
          const nameParts = file.name.split('.');
          const name = nameParts[0] ? nameParts[0] : '';
          const ext = nameParts[1] ? nameParts[1] : '';
          const line = `${name} - ${ext} - ${stats.size}b`;
          console.log(line);})
        .catch(error => console.error(error))
    }
  }))
  .catch(error => console.error(error));