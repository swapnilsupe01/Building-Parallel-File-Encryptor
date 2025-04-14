const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { Worker } = require('worker_threads');

const inputFilePath = 'files/input.txt';
const encryptedFilePath = 'files/file1.txt';
const decryptedFilePath = 'files/file2.txt';

function runWorker(filePath, action, outputPath) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(path.resolve(__dirname, 'worker.js'), {
      workerData: { filePath, action, outputPath }
    });
    worker.on('message', resolve);
    worker.on('error', reject);
  });
}

function promptUser(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise(resolve => rl.question(query, answer => {
    rl.close();
    resolve(answer);
  }));
}

(async () => {
  console.log('\nChoose an option:');
  console.log('1. Enter input text');
  console.log('2. Encrypt');
  console.log('3. Decrypt');

  const choice = await promptUser('\nEnter your choice (1/2/3): ');

  if (choice === '1') {
    const text = await promptUser('\nEnter text to save in input.txt: ');
    fs.writeFileSync(inputFilePath, text, 'utf-8');
    console.log('✅ Text saved to input.txt');
  } else if (choice === '2') {
    await runWorker(inputFilePath, 'encrypt', encryptedFilePath);
    // move encrypted result to file1.txt
    fs.copyFileSync(inputFilePath, encryptedFilePath);
    console.log('✅ Encrypted data saved to file1.txt');
  } else if (choice === '3') {
    await runWorker(encryptedFilePath, 'decrypt', decryptedFilePath);
    console.log('✅ Decrypted data saved to file2.txt');
  } else {
    console.log('❌ Invalid choice!');
  }
})();

