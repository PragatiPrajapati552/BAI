const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");
const Maid = require("../models/maid");

module.exports = function (passport) {
  // Strategies
  passport.use(new LocalStrategy(User.authenticate()));
  passport.use("maid", new LocalStrategy(Maid.authenticate()));

  // Serialization
  passport.serializeUser(function (user, done) {
    if (user instanceof User) {
      done(null, { id: user.id, type: "User" });
    } else if (user instanceof Maid) {
      done(null, { id: user.id, type: "Maid" });
    }
  });

  // Deserialization
  passport.deserializeUser(function (obj, done) {
    if (obj.type === "User") {
      User.findById(obj.id)
        .then((user) => done(null, user))
        .catch(done);
    } else if (obj.type === "Maid") {
      Maid.findById(obj.id)
        .then((maid) => done(null, maid))
        .catch(done);
    }
  });
};
