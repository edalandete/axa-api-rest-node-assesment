const { Router } = require('express');

const authController = require('../controllers/authController')();

function authRouter() {
  const routes = Router();

  routes.route('/login')
    .post(authController.login);

  return routes;
}

module.exports = authRouter();
