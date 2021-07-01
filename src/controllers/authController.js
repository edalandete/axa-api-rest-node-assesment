const passport = require('passport');
const { localStorage } = require('../providers/cache-provider');

function authController() {
  async function login(req, res, next) {
    passport.authenticate(
      'login',
      async (err, token) => {
        try {
          if (err || !token) {
            const error = new Error('An error occurred.');

            return next(error);
          }

          req.login(
            token,
            { session: false },
            async (error) => {
              if (error) return next(error);

              localStorage.setItem('token', token.token);
              localStorage.setItem('type', token.type);
              return res.json(token);
            }
          );
        } catch (error) {
          return next(error);
        }
      }
    )(req, res, next);
  }

  return {
    login
  };
}

module.exports = authController;
