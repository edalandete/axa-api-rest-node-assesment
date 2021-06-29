const { Router } = require('express');

const clientsController = require('../controllers/clientsController')();

function clientsRouter() {
  const routes = Router();

  routes.route('/')
    .get(clientsController.getAll);
  routes.route('/:id')
    .get(clientsController.getById);
  routes.route('/:id/policies')
    .get(clientsController.getPoliciesFromClientId);

  return routes;
}

module.exports = clientsRouter();
