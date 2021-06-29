const axios = require('axios');
const passport = require('passport');
const { localStorage } = require('../providers/cache-provider');

function authController() {
  async function login(req, res) {
    const client_id = process.env.CLIENT_ID;
    const client_secret = process.env.SECRET_CLIENT_ID;
    const SECRET_PASSWORD = 'Axa12345';

    const { email, password } = req.body;
    try {
      if (SECRET_PASSWORD === password) {
        const { data } = await axios.post(process.env.LOGIN_API, { client_id, client_secret });
        const clientsData = await axios.get(process.env.CLIENTS_API, { headers: { Authorization: `${data.type} ${data.token}` } });
        const clientFound = clientsData.data.find((client) => client.email === email);

        if (clientFound) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('type', data.type);
          localStorage.setItem('role', clientFound.role);
          res.json(data);
        } else {
          res.status(400);
          res.send('Invalid username or password');
        }
      }
    } catch (error) {
      res.status(401);
      res.send('Invalid secret or client id');
    }
  }

  return {
    login
  };
}

module.exports = authController;
