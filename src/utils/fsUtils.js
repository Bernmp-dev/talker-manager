const fs = require('fs').promises;
const path = require('path');

async function readData() {
  try {
    const data = await fs.readFile(path.resolve(__dirname, '../talker.json'))
    const response = JSON.parse(data);
    console.log(response);
    return response;
  } catch (err) {
    return console.error(`Erro na leitura do arquivo:
     ${err}`);
  }
}

module.exports = { readData };
