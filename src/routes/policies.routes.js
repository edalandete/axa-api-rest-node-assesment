const { Router } = require('express');

const policiesController = require('../controllers/policiesController')();

function policiesRouter() {
  const routes = Router();

  routes.route('/')
    .get(policiesController.getAll);

  return routes;
}

module.exports = policiesRouter();
