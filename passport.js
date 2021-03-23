const passport = require("passport");
const { Strategy } = require("passport-local");
const bcrypt = require("bcrypt");
const _ = require("lodash");

const arr = [];

const autenticat = (email, password, done) => {
  const user = arr.find((user) => user.email === email);
  if (!user) return done(null, false, { message: "user not found" });
  bcrypt.compare(password, user.password, (err, same) => {
    if (err) return done(err);
    if (same) return done(null, user);
    done(null, false, { message: "incorect pasword" });
  });
};

passport.use(new Strategy({ usernameField: 'email' }), autenticat);
passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser((_id, done) => done(null, _.find(arr, { _id })));

module.exports = passport;

