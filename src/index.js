const express = require('express');
const { readData, overWrite } = require('./utils/fsUtils');
const generateToken = require('./utils/generateToken');
const validateLogin = require('./middlewares/validateLogin');
const validateCredentials = require('./middlewares/validateCredentials');
const validateToken = require('./middlewares/validateToken');

const app = express();
app.use(express.json());

const TALKER_PATH = '../talker.json';

const HTTP_OK_STATUS = 200;
const PORT = process.env.PORT || '3001';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online 🟢');
});

app.get('/talker', async (_req, res) => {
  try {
    const data = await readData() || [];
    return res.status(200).json(data);
  } catch (error) {
    return res.status(200).json([]);
  }
});

app.get('/talker/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await readData() || [];
    const talkerById = data.find((talker) => talker.id === +id); 

    if (!talkerById) {
      throw new Error('Pessoa palestrante não encontrada');
    }

    return res.status(200).json(talkerById);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

app.post('/login', validateLogin, (req, res) => {
  try {
    const token = generateToken();
    return res.status(200).json({ token });
  } catch (error) {
  return res.status(400).json({ message: error.message });
  }
});

app.post('/talker', validateToken, validateCredentials, async (req, res) => {
  try {
    const data = await readData() || [];
    const talker = req.body;
    const attTalkers = [...data, talker];
  
    // overWrite(TALKER_PATH, attTalkers);
  
    return res.status(201).json(talker);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});