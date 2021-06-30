const axios = require('axios');
const {
  paginate, isAdmin, isUser, isSameClient
} = require('../helpers/commonHelpers');
const { localStorage } = require('../providers/cache-provider');

function clientsController() {
  const token = localStorage.getItem('token');
  const type = localStorage.getItem('type');
  const role = localStorage.getItem('role');
  const clientId = localStorage.getItem('clientId');

  async function getAll(req, res) {
    const { page, limit, name } = req.query;
    const requestHeaders = { headers: { Authorization: `${type} ${token}` } };

    try {
      const { data } = await axios.get(process.env.CLIENTS_API, requestHeaders);
      const clientsByName = name ? data.filter((client) => client.name === name) : data;
      if (isAdmin(role)) {
        const clients = paginate(clientsByName, page, limit);
        res.json(clients);
      } else {
        const clientFound = clientsByName.find((client) => client.id === clientId);
        res.json(clientFound);
      }
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
      const clientFound = data.find((client) => client.id === id);
      if (clientFound) {
        if ((isUser(role) && isSameClient(clientId, clientFound.id)) || isAdmin(role)) {
          res.json(clientFound);
        } else {
          res.status(403);
          res.send('Forbidden');
        }
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
      if ((isUser(role) && isSameClient(clientId, id)) || isAdmin(role)) {
        if (policies.length) {
          res.json(policies);
        } else {
          res.status(404);
          res.send(`No polices found matching the clientid ${id}`);
        }
      } else {
        res.status(403);
        res.send('Forbidden');
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
