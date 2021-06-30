const passport = require("passport");
const { Strategy, ExtractJwt } = require("passport-jwt");
require("dotenv").config();

const { user: service } = require("../services");
const { TOKEN_KEY } = process.env;

const settings = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: TOKEN_KEY,
};

passport.use(
  new Strategy(settings, async (payload, done) => {
    try {
      const user = await service.getUserById(payload.id);

      if (!user) {
        return done(new Error("User not found"));
      }

      if (!user.token) {
        return done(null, false);
      }

      return done(null, user);
    } catch (err) {
      done(err);
    }
  })
);
