const express = require('express');
const { readData, writeData } = require('./utils/fsUtils');
const generateToken = require('./utils/generateToken');
const validateLogin = require('./middlewares/validateLogin');
const validateCredentials = require('./middlewares/validateCredentials');
const validateToken = require('./middlewares/validateToken');
const validateId = require('./middlewares/validateId');
const applyFilters = require('./middlewares/validateSearchs');
const patchRate = require('./middlewares/patchRate');

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
    res.locals.initialTalkers = await readData();
    
    applyFilters(req, res, () => res.status(200).json(res.locals.talkers));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

app.get('/talker/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const data = await readData();
    const talkerById = data.find((talker) => talker.id === id); 

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

    await writeData(TALKER_PATH, data);

    return res.status(201).json(newTalker);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

app.put(
  '/talker/:id', 
  validateToken,
  validateId,
  validateCredentials,
  async (req, res) => {
  try {
    const id = Number(req.params.id);
    const talkers = await readData();
    const i = talkers.findIndex((talker) => talker.id === id);

    talkers[i] = { ...req.body, id };

    await writeData(TALKER_PATH, talkers);

    return res.status(200).json(talkers[i]);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
 },
);

app.delete('/talker/:id', validateToken, validateId, async (req, res) => {
  try {
    const talkers = await readData();
    const id = Number(req.params.id);
    const index = talkers.findIndex((talker) => talker.id === id);

    talkers.splice(index, 1);

    await writeData(TALKER_PATH, talkers);

    return res.status(204).end();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
 });

 app.patch('/talker/rate/:id', validateToken, validateId, patchRate, async (req, res) => {
  const { id } = req.params;
  const { rate } = req.body;

  try {
    const talkers = await readData();
    const i = talkers.findIndex((talker) => talker.id === Number(id));

    talkers[i].talk.rate = rate;
    await writeData(TALKER_PATH, talkers);

    return res.status(204).end();
  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: 'Erro interno do servidor' });
  }
});