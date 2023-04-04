function filterByName(req, res, next) {
  const searchTerm = req.query.q;

  if (searchTerm) {
    const filteredTalkers = res.locals.talkers.filter((talker) => talker.name
      .toLowerCase().includes(searchTerm.toLowerCase()));
    
    res.locals.talkers = filteredTalkers;
  }

  next();
}

function filterByDate(req, res, next) {
  const { date } = req.query;

  if (date) {
    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (!dateRegex.test(date)) {
      return res.status(400)
        .json({ message: 'O parâmetro "date" deve ter o formato "dd/mm/aaaa"' });
    }

    const filteredTalkers = res.locals.talkers.filter((talker) => talker.talk.watchedAt === date);
    res.locals.talkers = filteredTalkers;
  }

  next();
}

function filterByRate(req, res, next) {
  const rate = Number(req.query.rate);

  if (Number.isInteger(rate) && rate >= 1 && rate <= 5) {
    const filteredTalkers = res.locals.talkers.filter((talker) => talker.talk.rate === rate);
    res.locals.talkers = filteredTalkers;
  } else if (req.query.rate !== undefined) {
    return res.status(400).json({
      message: 'O campo "rate" deve ser um número inteiro entre 1 e 5',
    });
  }

  next();
}

function applyFilters(req, res, next) {
  res.locals.talkers = res.locals.initialTalkers;
  
  filterByName(req, res, () => {
    filterByDate(req, res, () => {
      filterByRate(req, res, () => next());
    });
  });
}

module.exports = applyFilters;