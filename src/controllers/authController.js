const axios = require('axios');
const { getToken } = require('../helpers/commonHelpers');
const { localStorage } = require('../providers/cache-provider');

function authController() {
  async function login(req, res) {
    const { email, password } = req.body;
    try {
      if (process.env.SECRET_PASSWORD === password) {
        const data = await getToken();
        const clientsData = await axios.get(process.env.CLIENTS_API, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
        const clientFound = clientsData.data.find((client) => client.email === email);

        if (clientFound) {
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
