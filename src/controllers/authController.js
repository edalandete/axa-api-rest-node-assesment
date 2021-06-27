const axios = require('axios');

function authController() {
  async function login(req, res) {
    const { client_id, client_secret } = req.body;
    try {
      const { data } = await axios.post(process.env.LOGIN_API, { client_id, client_secret });
      res.json(data);
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
