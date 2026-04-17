const User = require("./models/user");
const Maid = require("./models/maid");

module.exports.isUser = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "Please login first");
    return res.redirect("/login");
  }

  if (req.user && !(req.user instanceof User)) {
    req.flash("error", "Only users can access this page");
    return res.redirect("/maid/home");
  }

  next();
};

module.exports.isMaid = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "Please login first");
    return res.redirect("/maidLogin");
  }

  if (req.user && !(req.user instanceof Maid)) {
    req.flash("error", "Only maids can access this page");
    return res.redirect("/");
  }

  next();
};
