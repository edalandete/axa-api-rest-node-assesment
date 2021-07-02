const axios = require('axios');
const {
  paginate, isAdmin, isUser, isSameClient
} = require('../helpers/commonHelpers');
const { localStorage } = require('../providers/cache-provider');

/**
 *
 * @returns All the functions used in the controller
 */

function clientsController() {
  const token = localStorage.getItem('token');
  const type = localStorage.getItem('type');
  const role = localStorage.getItem('role');
  const clientId = localStorage.getItem('clientId');

  /**
   * This function gets all clients if the role is admin
   * This function gets one client if the role is user and the user id is the
   * same as the logged user
   *
   * @param {object} req Request API Call includes:
   *  - query {object}
   *    - page:   {number} page to show
   *    - limit:  {number} registers per page to show
   *    - name:   {string} client name
   *
   * @param {object} res Response API Call
   *  - Possible status:
   *   - 200: OK
   *   - 401: Unauthorized
   */

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

  /**
   *
   * Function that returns the client data matching the id from params
   *
   * @param {*} req Request API Call includes:
   *  - params: {object}
   *    - id: {number} client id
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

  /**
   *
   * Function that returns all the policies matching one clientId
   *
   * @param {object} req Request API call includes
   *  - params: {object}
   *    - id: {number} client id
   * @param {object} res Response API call
   *   - Possible status:
   *    - 200: OK
   *    - 401: Unauthorized
   *    - 403: Forbidden
   *    - 404: Not found
   */
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
