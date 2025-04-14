const { parentPort, workerData } = require('worker_threads');
const { encryptFile, decryptFile } = require('./cryption');

const { filePath, action, outputPath } = workerData;

try {
  if (action === 'encrypt') {
    encryptFile(filePath); // Encrypt input file (e.g., input.txt)
    parentPort.postMessage(`Encrypted: ${filePath}`);
  } else if (action === 'decrypt') {
    decryptFile(filePath, outputPath); // Decrypt file1.txt and save to file2.txt
    parentPort.postMessage(`Decrypted to: ${outputPath}`);
  }
} catch (error) {
  parentPort.postMessage(`Error: ${error.message}`);
}
