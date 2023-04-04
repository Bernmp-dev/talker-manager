const fs = require('fs').promises;
const path = require('path');

const PATH_NAME = '../talker.json';

async function readData() {
  try {
    const data = await fs.readFile(path.resolve(__dirname, PATH_NAME));
    const response = JSON.parse(data);

    return response || [];
  } catch (err) {
    return console.error(`Erro na leitura do arquivo: ${err}`);
  }
}

async function overWrite(pathname, value) {
  try {
    await fs.writeFile(path
      .resolve(__dirname, pathname), JSON.stringify(value));
    } catch (err) {
      return console.error(`Erro ao subscrever do arquivo: ${err}`);
    }
}

module.exports = { readData, overWrite };
