const passport = require('passport');
const LocalStrategy = require('passport-local');

passport.use(
  'login',
  new LocalStrategy.Strategy(
    {
      usernameField: process.env.USERNAME_FIELD,
      passwordField: process.env.PASSWORD_FIELD
    },
    async (email, password, done) => {
      try {
        const user = { email, password };
        return done(null, user, { message: 'Logged in Successfully' });
      } catch (error) {
        return done(error);
      }
    }
  )
);
