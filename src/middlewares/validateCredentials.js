// 
const validateName = ({ body: { name } }, res) => {
  if (!name) {
    return res.status(400).json({ message: 'O campo "name" é obrigatório' });
  }
  if (name.length < 3) {
    return res.status(400).json({ message: 'O "name" deve ter pelo menos 3 caracteres' });
  }
};

const validateAge = ({ body: { age } }, res) => {
  if (!age) {
    return res.status(400).json({ message: 'O campo "age" é obrigatório' });
  }
  if (!Number(age) >= 18) {
    return res.status(400)
    .json({ message: 'O campo "age" deve ser um número inteiro igual ou maior que 18' });
  }
};

const validateTalk = (req, res) => {
  if (!req.body.talk) {
    return res.status(400).json({ message: 'O campo "talk" é obrigatório' });
  } 
};

const valdiateWatchedAt = ({ body: { talk } }, res) => {
  if (!talk.watchedAt) {
    return res.status(400)
      .json({ message: 'O campo "watchedAt" é obrigatório' });
  }

  if (!/^(\d{2})\/(\d{2})\/(\d{4})$/.test(talk.watchedAt)) {    
    return res.status(400).json({
      message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"',
    });
  }
};

const validateRate = ({ body: { talk } }, res) => {
  if (!talk.rate) {
    return res.status(400).json({ message: 'O campo "rate" é obrigatório' });
  }

  if (!Number.isInteger(talk.rate) || talk.rate < 1 || talk.rate > 5) {
    return res.status(400).json({
      message: 'O campo "rate" deve ser um número inteiro entre 1 e 5',
    });
    }
};

const validateCredentials = (req, res, next) => {
  validateName(req, res);
  validateAge(req, res);
  validateTalk(req, res);
  valdiateWatchedAt(req, res);
  validateRate(req, res);
  return next();
};

module.exports = validateCredentials;
