const { stdin, stdout } = process;
const readline = require('readline');
const fs = require('fs');
const path = require('path');

const fileToWrite = path.join(__dirname, 'text.txt');
const writeStream = fs.createWriteStream(fileToWrite);

const rl = readline.createInterface({ input: stdin, output: stdout, prompt: `>> ` });

console.log(`Session opened.\nWrite to file:`);
rl.prompt();
rl.on('line', (input) => {
  if (input.trim() === 'exit') {
    rl.close();
  } else {
    writeStream.write(input);
    writeStream.write('\n');
    rl.prompt();
  }
});

rl.on('close', () => {
  console.log('\nSession closed. Goodbye!');
  process.exit(0)
});
