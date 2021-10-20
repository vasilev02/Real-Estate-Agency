const router = require('express').Router();
const authService = require('../services/authService');
const { TOKEN_COOKIE_NAME } = require('../constants');
const isAuthenticated = require('../middlewares/isAuthenticated');
const isGuest = require("../middlewares/isGuest");

const getRegisterPage = (req, res) => {
  res.render('auth/register');
}

const getLoginPage = (req, res) => {
  res.render('auth/login');
}

const register = async (req, res) => {
  try {
    const { name, username, password, repeatPassword } = req.body;

    if (username.length < 5) {
      res.locals.error = 'Username must be at least 5 characters !'
      return res.render('auth/register');
    }
    
    if (password !== repeatPassword) {
      res.locals.error = 'Passwords should match!'
      return res.render('auth/register');
    }
    
    await authService.register({ name, username, password });
    res.redirect('/auth/login');

  } catch (error) {
    res.status(400).send(error);
  }
}

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const token = await authService.login(username, password);

    res.cookie(TOKEN_COOKIE_NAME, token);
    res.redirect('/');
  } catch (error) {
    res.status(400).send(error);
  }
}

const logout = (req, res) => {
  res.clearCookie(TOKEN_COOKIE_NAME);
  res.redirect('/');
}

router.get('/register', isGuest, getRegisterPage);
router.post('/register',isGuest, register);
router.get('/login',isGuest, getLoginPage);
router.post('/login',isGuest, login);
router.get('/logout',isAuthenticated, logout);

module.exports = router;