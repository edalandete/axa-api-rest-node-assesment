const axios = require('axios');
const { localStorage } = require('../providers/cache-provider');
const {
  paginate, isUser, isAdmin, isSameClient
} = require('../helpers/commonHelpers');

function policiesController() {
  const token = localStorage.getItem('token');
  const type = localStorage.getItem('type');
  const role = localStorage.getItem('role');
  const clientId = localStorage.getItem('clientId');

  /**
   * This function gets all policies if the role is admin
   * This function gets all client's policies if the role is user and the user id is the
   * same as the logged user
   *
   * @param {object} req Request API Call includes:
   *  - query {object}
   *    - page:   {number} page to show
   *    - limit:  {number} registers per page to show
   *
   * @param {object} res Response API Call
   *  - Possible status:
   *   - 200: OK
   *   - 401: Unauthorized
   */

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

  /**
   *
   * Function that returns the policy data matching the id from params
   *
   * @param {*} req Request API Call includes:
   *  - params: {object}
   *    - id: {number} policy id
   * @param {*} res Response API Call
   *   - Possible status:
   *    - 200: OK
   *    - 401: Unauthorized
   *    - 403: Forbidden
   *    - 404: Not found
   */

  async function getById(req, res) {
    const { id } = req.params;
    const requestHeaders = { headers: { Authorization: `${type} ${token}` } };

    try {
      const { data } = await axios.get(process.env.POLICIES_API, requestHeaders);
      const policy = data.find((pol) => pol.id === id);

      if ((isUser(role) && isSameClient(clientId, policy.clientId)) || isAdmin(role)) {
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
