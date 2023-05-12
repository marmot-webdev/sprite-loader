import { readFile, writeFile } from 'node:fs/promises';
import jsBeautify from 'js-beautify';

const beautify = jsBeautify.js;
const beautifyOptions = {
  indent_size: 2,
};

async function formatFile(filePath) {
  try {
    const fileContent = await readFile(filePath, { encoding: 'utf8' });
    const formattedContent = beautify(fileContent, beautifyOptions);

    await writeFile(filePath, formattedContent, { encoding: 'utf8' });
  } catch (error) {
    console.error(`Error reading or formatting file: ${error}`);
  }
}

async function formatFiles(filePaths) {
  const promises = filePaths.map(filePath => formatFile(filePath));
  await Promise.all(promises);
}

const filePaths = [
  './dist/sprite-loader.js'
];

formatFiles(filePaths);