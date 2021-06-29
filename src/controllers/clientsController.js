const axios = require('axios');
const { paginate } = require('../helpers/commonHelpers');
const { localStorage } = require('../providers/cache-provider');

function clientsController() {
  async function getAll(req, res) {
    const { page, limit } = req.query;
    const token = localStorage.getItem('token');
    const type = localStorage.getItem('type');
    const requestHeaders = { headers: { Authorization: `${type} ${token}` } };
    try {
      const { data } = await axios.get(process.env.CLIENTS_API, requestHeaders);
      const clients = paginate(data, page, limit);
      res.json(clients);
    } catch (error) {
      res.status(401);
      res.send('Unauthorized');
    }
  }
  async function getById(req, res) {
    const { id } = req.params;
    const token = localStorage.getItem('token');
    const type = localStorage.getItem('type');
    const requestHeaders = { headers: { Authorization: `${type} ${token}` } };
    try {
      const { data } = await axios.get(process.env.CLIENTS_API, requestHeaders);
      const client = data.find((pol) => pol.id === id);
      if (client) {
        res.json(client);
      } else {
        res.status(404);
        res.send('Client not found');
      }
    } catch (error) {
      res.status(401);
      res.send('Unauthorized');
    }
  }

  return {
    getAll,
    getById
  };
}

module.exports = clientsController;
