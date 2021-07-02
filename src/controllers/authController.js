const passport = require('passport');
const { localStorage } = require('../providers/cache-provider');

function authController() {
  /**
   *
   * Function that returns the token if the user is authenticated or error
   * if the user doesn't exist
   *
   * @param {object} req Request API Call includes:
   *  - login: function to authenticate to the app
   * @param {object} res Response API Call
   *  - Possible status:
   *    - 200: OK
   * @param {object} next Function Callback that will be called in case of error
   *
   */
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
