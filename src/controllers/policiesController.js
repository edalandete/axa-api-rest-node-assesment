const axios = require('axios');
const { localStorage } = require('../providers/cache-provider');

function policiesController() {
  async function getAll(req, res) {
    const token = localStorage.getItem('token');
    const type = localStorage.getItem('type');
    const requestHeaders = { headers: { Authorization: `${type} ${token}` } };
    try {
      const { data } = await axios.get(process.env.POLICIES_API, requestHeaders);
      res.json(data);
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
      const { data } = await axios.get(process.env.POLICIES_API, requestHeaders);
      const policy = data.find((pol) => pol.id === id);
      res.json(policy);
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

module.exports = policiesController;
