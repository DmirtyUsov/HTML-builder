const fsPromises = require('node:fs/promises');
const { createReadStream, createWriteStream } = require('fs');
const path = require('path');

const directorySrc = path.join(__dirname);
const directoryDst = path.join(__dirname, 'project-dist');
const indexFile = 'index.html';
const styleFile = 'style.css';
const assetsDir = 'assets'

const copyFiles = async (src, dst) => {
  await fsPromises.mkdir(dst, {recursive: true});
  const files = await fsPromises.readdir(src, {withFileTypes: true});
  files.forEach(file => {
    if(file.isFile()){
      const fileSrc = path.join(file.path, file.name);
      const fileDst = path.join(dst, file.name);
      fsPromises.copyFile(fileSrc, fileDst)
        .then(() => console.log(`${file.name} copied`))
        .catch(console.error);
    } else {
      const nestedDst = path.join(dst, file.name);
      const nestedSrc = path.join(src, file.name);
      copyFiles(nestedSrc, nestedDst);
    }
  })
}

const buildPage = async() => {
  await fsPromises.rm(directoryDst, {recursive: true, force: true});
  await fsPromises.mkdir(directoryDst, {recursive: true});

  // copy assets
  const src = path.join(directorySrc, assetsDir);
  const dst = path.join(directoryDst, assetsDir);
  copyFiles(src, dst);

  // create css
  const srcCss = path.join(directorySrc, 'styles')
  const files =  await fsPromises.readdir(srcCss, {withFileTypes: true});
  const cssFiles = [];
  const wsCss = createWriteStream(path.join(directoryDst, styleFile));
  files.forEach(file => {
    const srcFile = path.join(file.path, file.name);
    if(file.isFile() && path.extname(srcFile) === '.css') {
     cssFiles.push(srcFile);
     createReadStream(srcFile).pipe(wsCss);
     console.log(file.name, 'merged');
    }
  })

  // create index.html
  const template = await fsPromises
    .readFile(path.join(directorySrc, 'template.html'), {encoding: "utf-8"});

  const components = {};
  const srcComponents = path.join(directorySrc, 'components');
  const componentFiles =  await fsPromises
    .readdir(srcComponents, {withFileTypes: true});
  for (const file of componentFiles) {
    const srcFile = path.join(file.path, file.name);
    if(file.isFile() && path.extname(srcFile) === '.html') {
      components[path.parse(srcFile).name] = await fsPromises
        .readFile(srcFile, {encoding: "utf-8"});
    }
  }

  const pattern = /{{(\w*)}}/g;
  const indexhtml = template.replace(pattern, (_, token) => components[token] || '');
  await fsPromises.writeFile(path.join(directoryDst, indexFile), indexhtml);
  console.log('\nindex.html created');

}
buildPage()