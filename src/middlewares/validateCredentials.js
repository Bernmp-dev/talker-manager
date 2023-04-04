const validateName = ({ body: { name } }, res, next) => {
  if (!name) {
    return res.status(400).json({ message: 'O campo "name" é obrigatório' });
  }
  if (name.length < 3) {
    return res.status(400).json({ message: 'O "name" deve ter pelo menos 3 caracteres' });
  }
  return next();
};

const validateAge = ({ body: { age } }, res, next) => {
  if (!age) {
    return res.status(400).json({ message: 'O campo "age" é obrigatório' });
  }
  if (age < 18 || !Number.isInteger(age)) {
    return res.status(400)
    .json({ message: 'O campo "age" deve ser um número inteiro igual ou maior que 18' });
  }
  return next();
};

const validateTalk = (req, res, next) => {
  if (!req.body.talk) {
    return res.status(400).json({ message: 'O campo "talk" é obrigatório' });
  } 
  return next();
};

const validateWatchedAt = ({ body: { talk } }, res, next) => {
  if (!talk.watchedAt) {
    return res.status(400)
      .json({ message: 'O campo "watchedAt" é obrigatório' });
  }

  if (!/^(\d{2})\/(\d{2})\/(\d{4})$/.test(talk.watchedAt)) {    
    return res.status(400).json({
      message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"',
    });
  }
  return next();
};

const validateRate = ({ body: { talk } }, res, next) => {
  if (talk.rate === undefined) {
    return res.status(400).json({ message: 'O campo "rate" é obrigatório' });
  }

  if (!Number.isInteger(talk.rate) || talk.rate < 1 || talk.rate > 5) {
    return res.status(400).json({
      message: 'O campo "rate" deve ser um número inteiro entre 1 e 5',
    });
  }
  return next();
};

const validateCredentials = (req, res, next) => {
  validateName(req, res, () => {
    validateAge(req, res, () => {
      validateTalk(req, res, () => {
        validateWatchedAt(req, res, () => {
          validateRate(req, res, () => next());
        });
      });
    });
  });
};

module.exports = validateCredentials;
