const express = require('express');
const { readData, overWrite } = require('./utils/fsUtils');
const generateToken = require('./utils/generateToken');
const validateLogin = require('./middlewares/validateLogin');
const validateCredentials = require('./middlewares/validateCredentials');
const validateToken = require('./middlewares/validateToken');
const existingId = require('./middlewares/existingId');

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
    const data = await readData();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(200).json([]);
  }
});

app.get('/talker/search', validateToken, async (req, res) => {
  try {
    const searchTerm = req.query.q;
    const talkers = await readData();
    const filteredTalkers = searchTerm
      ? talkers.filter((talker) => talker.name
        .toLowerCase().includes(searchTerm.toLowerCase()))
      : talkers;

    return res.status(200).json(filteredTalkers || []);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

app.get('/talker/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await readData();
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
    const data = await readData();
    const newTalker = { id: data.length + 1, ...req.body };

    data.push(newTalker);  

    await overWrite(TALKER_PATH, data);

    return res.status(201).json(newTalker);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

app.put(
  '/talker/:id', 
  validateToken,
  existingId,
  validateCredentials,
  async (req, res) => {
  try {
    const id = +req.params.id;
    const talkers = await readData();
    const i = talkers.findIndex((talker) => talker.id === id);

    talkers[i] = { ...req.body, id };

    await overWrite(TALKER_PATH, talkers);

    return res.status(200).json(talkers[i]);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
},

app.delete('/talker/:id', validateToken, existingId, async (req, res) => {
  try {
    const talkers = await readData();
    const id = +req.params.id;
    const index = talkers.findIndex((talker) => talker.id === id);

    talkers.splice(index, 1);

    await overWrite(TALKER_PATH, talkers);

    return res.status(204).end();
  } catch (err) {
    return res.status(401).json({ message: err.message });
  }
}),
);
