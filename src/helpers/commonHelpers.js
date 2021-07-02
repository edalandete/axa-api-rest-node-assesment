const axios = require('axios');
const cron = require('node-cron');
const { localStorage } = require('../providers/cache-provider');
/**
 * This function will accept an array of data
 * with the next page and the number of registers per page
 * and return a new object with the results paginated
 *
 * @param {Array} model The data to be paginated
 * @param {number} _page The page to be shown
 * @param {number} _limit The results per page
 * @returns {Object} The page object
 */
const paginate = (model, _page, _limit) => {
  const page = parseInt(_page, 10) || 1;
  const limit = parseInt(_limit, 10) || 10;

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const result = {};
  if (endIndex < model.length) result.next = { page: page + 1, limit };
  if (startIndex > 0) result.previous = { page: page - 1, limit };

  result.results = model.slice(startIndex, endIndex);

  return result;
};

/**
 * This function will return the token
 *
 * @returns {Object} If the request is correct returns an object with the token
 * else returns an object with an error.
 */
const getToken = async () => {
  const client_id = process.env.CLIENT_ID;
  const client_secret = process.env.SECRET_CLIENT_ID;

  try {
    const { data } = await axios.post(process.env.LOGIN_API, { client_id, client_secret });
    return data;
  } catch (error) {
    return { status: 401, message: 'Invalid client or secret id' };
  }
};

cron.schedule('*/5 * * * *', () => {
  if (localStorage.getItem('clientId')) {
    getToken();
  }
});

/**
 *
 * @param {string} role The role of the logged user
 * @returns a boolean to know if the role corresponds to user
 */
const isUser = (role) => role === process.env.USER_ROLE;
/**
 *
 * @param {string} role The role of the logged user
 * @returns a boolean to know if the role corresponds to admin
 */
const isAdmin = (role) => role === process.env.ADMIN_ROLE;
/**
 *
 * @param {string} storedClientId The clientId of the logged user
 * @param {string} clientFoundId The clientId of the found user
 * @returns a boolean to know if the client found and the logged client are the
 * same
 */
const isSameClient = (storedClientId, clientFoundId) => storedClientId === clientFoundId;

module.exports = {
  paginate,
  getToken,
  isUser,
  isAdmin,
  isSameClient
};
