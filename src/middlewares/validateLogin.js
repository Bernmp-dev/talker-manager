const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

switch (true) {
  case !email:
    return res.status(400).json({ message: 'O campo \"email\" é obrigatório' });
  case !password:
    return res.status(400).json({ message: 'O campo \"password\" é obrigatório' });
  case !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email):
    return res.status(400).json({ message: 'O \"email\" deve ter o formato \"email@email.com\"' });
  case password.length < 6:
    return res.status(400).json({ message: 'O \"password\" deve ter pelo menos 6 caracteres' });
}
return next()
};

module.exports = validateLogin;