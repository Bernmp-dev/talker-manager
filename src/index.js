const express = require('express');
const { readData } = require('./utils/fsUtils')
const generateToken = require('./utils/generateToken')
const validateLogin = require('./middlewares/validateLogin');

const app = express();
app.use(express.json());

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
    res.status(200).json(data)
  } catch (error) {
    res.status(200).json([]);
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

    res.status(200).json(talkerById);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

app.post('/login', validateLogin, async (req, res) => {
  res.status(200).json({ token:  generateToken() });
});

