const axios = require('axios');
const { localStorage } = require('../providers/cache-provider');

function policiesController() {
  async function getAll(req, res) {
    const token = localStorage.getItem('token');
    const type = localStorage.getItem('type');
    const headers = { headers: { Authorization: `${type} ${token}` } };
    try {
      const { data } = await axios.get(process.env.POLICIES_API, headers);
      res.json(data);
    } catch (error) {
      res.status(401);
      res.send('Unautorized');
    }
  }

  return {
    getAll
  };
}

module.exports = policiesController;
