const axios = require('axios');
const cron = require('node-cron');

const { localStorage } = require('../providers/cache-provider');

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

const getToken = async () => {
  const client_id = process.env.CLIENT_ID;
  const client_secret = process.env.SECRET_CLIENT_ID;

  try {
    const { data } = await axios.post(process.env.LOGIN_API, { client_id, client_secret });

    localStorage.setItem('token', data.token);
    localStorage.setItem('type', data.type);

    return data;
  } catch (error) {
    return { status: 401, message: 'Invalid client or secret id' };
  }
};

cron.schedule('*/5 * * * *', () => {
  getToken();
});

const isUser = (role) => role === process.env.USER_ROLE;
const isAdmin = (role) => role === process.env.ADMIN_ROLE;

module.exports = {
  paginate,
  getToken,
  isUser,
  isAdmin
};
