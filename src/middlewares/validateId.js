const express = require('express');
const { readData } = require('../utils/fsUtils');

const app = express();

app.use(express.json());

const validateId = async (req, res, next) => {
  const id = +req.params.id;
  const talkers = await readData();
  const findTalker = talkers.some((team) => team.id === id);

  if (!findTalker) {
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  }  
    return next();
};

module.exports = validateId;