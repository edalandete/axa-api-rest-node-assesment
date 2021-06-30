const axios = require('axios');
const { localStorage } = require('../providers/cache-provider');
const {
  paginate, isUser, isAdmin, isUserPolicy
} = require('../helpers/commonHelpers');

function policiesController() {
  const token = localStorage.getItem('token');
  const type = localStorage.getItem('type');
  const role = localStorage.getItem('role');
  const clientId = localStorage.getItem('clientId');

  async function getAll(req, res) {
    const { page, limit } = req.query;
    const requestHeaders = { headers: { Authorization: `${type} ${token}` } };

    try {
      const { data } = await axios.get(process.env.POLICIES_API, requestHeaders);

      const policies = isUser(role)
        ? data.filter((policy) => policy.clientId === clientId)
        : data;
      const paginatedPolicies = paginate(policies, page, limit);

      res.json(paginatedPolicies);
    } catch (error) {
      res.status(401);
      res.send('Unauthorized');
    }
  }
  async function getById(req, res) {
    const { id } = req.params;
    const requestHeaders = { headers: { Authorization: `${type} ${token}` } };

    try {
      const { data } = await axios.get(process.env.POLICIES_API, requestHeaders);
      const policy = data.find((pol) => pol.id === id);

      if ((isUser(role) && isUserPolicy(policy, clientId)) || isAdmin(role)) {
        res.json(policy);
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
    getById
  };
}

module.exports = policiesController;
