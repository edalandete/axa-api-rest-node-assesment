const axios = require('axios');
const { paginate } = require('../helpers/commonHelpers');
const { localStorage } = require('../providers/cache-provider');

function clientsController() {
  const token = localStorage.getItem('token');
  const type = localStorage.getItem('type');
  const role = localStorage.getItem('role');
  const clientId = localStorage.getItem('clientId');

  async function getAll(req, res) {
    const { page, limit } = req.query;
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
  async function getPoliciesFromClientId(req, res) {
    const { id } = req.params;
    const requestHeaders = { headers: { Authorization: `${type} ${token}` } };

    try {
      const { data } = await axios.get(process.env.POLICIES_API, requestHeaders);
      const policies = data.filter((policy) => policy.clientId === id);
      if (policies.length) {
        res.json(policies);
      } else {
        res.status(404);
        res.send(`No polices found matching the clientid ${id}`);
      }
    } catch (error) {
      res.status(401);
      res.send('Unauthorized');
    }
  }

  return {
    getAll,
    getById,
    getPoliciesFromClientId
  };
}

module.exports = clientsController;
