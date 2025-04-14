const jimpImport = require('jimp');
const Jimp = jimpImport.default || jimpImport;

const { encryptText, decryptText } = require('./cryption');

// Convert text to binary string
function textToBinary(text) {
  return text
    .split('')
    .map(char => char.charCodeAt(0).toString(2).padStart(8, '0'))
    .join('');
}

// Convert binary string back to text
function binaryToText(binary) {
  let text = '';
  for (let i = 0; i < binary.length; i += 8) {
    const byte = binary.slice(i, i + 8);
    if (byte.length === 8) {
      text += String.fromCharCode(parseInt(byte, 2));
    }
  }
  return text;
}

// Embed encrypted text inside image
async function embedTextInImage(imagePath, text, outputImagePath) {
  const image = await Jimp.read(imagePath);
  const encrypted = encryptText(text);
  const binary = textToBinary(encrypted) + '00000000'; // End of message marker

  let idx = 0;
  image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idxScan) {
    if (idx < binary.length) {
      const bit = parseInt(binary[idx]);
      this.bitmap.data[idxScan] = (this.bitmap.data[idxScan] & 0xFE) | bit;
      idx++;
    }
  });

  await image.writeAsync(outputImagePath);
  console.log(`✅ Encrypted text embedded in ${outputImagePath}`);
}

// Extract and decrypt text from image
async function extractTextFromImage(imagePath) {
  const image = await Jimp.read(imagePath);
  let binary = '';
  let stop = false;

  image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idxScan) {
    if (!stop) {
      const bit = this.bitmap.data[idxScan] & 1;
      binary += bit;

      if (binary.slice(-8) === '00000000') {
        stop = true;
      }
    }
  });

  const encrypted = binaryToText(binary.slice(0, -8));
  const decrypted = decryptText(encrypted);

  console.log(`🕵️ Encrypted (hidden) Text: ${encrypted}`);
  console.log(`🔓 Decrypted Text: ${decrypted}`);
}

module.exports = {
  embedTextInImage,
  extractTextFromImage
};
