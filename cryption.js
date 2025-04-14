// cryption.js
const fs = require('fs');
const crypto = require('crypto');
require('dotenv').config();

const algorithm = 'aes-256-cbc';
const iv = Buffer.alloc(16, 0); // 16-byte IV

function getKey() {
  const keyStr = fs.readFileSync('encryption.key', 'utf-8').trim();
  return crypto.scryptSync(keyStr, 'salt', 32); // 256-bit key
}

function encryptFile(inputPath) {
  const key = getKey();
  const data = fs.readFileSync(inputPath);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
  fs.writeFileSync(inputPath, encrypted); // overwrite with encrypted content
}

function decryptFile(inputPath, outputPath) {
  const key = getKey();
  const data = fs.readFileSync(inputPath);
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  const decrypted = Buffer.concat([decipher.update(data), decipher.final()]);
  fs.writeFileSync(outputPath, decrypted); // write decrypted content to file2.txt
}

module.exports = { encryptFile, decryptFile };
