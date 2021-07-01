const axios = require('axios');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const { getToken } = require('../../helpers/commonHelpers');

const { localStorage } = require('../../providers/cache-provider');

passport.use(
  'login',
  new LocalStrategy.Strategy(
    {
      usernameField: process.env.USERNAME_FIELD,
      passwordField: process.env.PASSWORD_FIELD
    },
    async (email, password, done) => {
      try {
        const token = await getToken();
        const { data } = await axios.get(process.env.CLIENTS_API, { headers: { Authorization: `Bearer ${token.token}` } });

        const user = data.find((client) => client.email === email);

        if (!user) {
          return done(null, false, { status: 400, message: 'Invalid Credentials' });
        }

        const validate = process.env.SECRET_PASSWORD === password;

        if (!validate) {
          return done(null, false, { status: 400, message: 'Invalid Credentials' });
        }

        localStorage.setItem('role', user.role);
        localStorage.setItem('clientId', user.id);

        return done(null, token, { status: 200, message: 'Logged in Successfully' });
      } catch (error) {
        return done(error);
      }
    }
  )
);
