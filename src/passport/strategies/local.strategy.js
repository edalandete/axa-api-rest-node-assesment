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

        // if (!user) {
        //   return done(null, false, { message: 'User not found' });
        // }

        // const validate = await user.verifyPassword(password);

        // if (!validate) {
        //   return done(null, false, { message: 'Wrong Password' });
        // }

        return done(null, user, { message: 'Logged in Successfully' });
      } catch (error) {
        return done(error);
      }
    }
  )
);
