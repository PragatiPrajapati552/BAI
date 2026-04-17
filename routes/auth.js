const express = require("express");
const passport = require("passport");
const User = require("../models/user");
const Maid = require("../models/maid");

const router = express.Router();

router.get("/signup", (req, res) => {
  res.render("authentication/signup.ejs");
});

router.post("/signup", async (req, res, next) => {
  const { username, password, email, contact, area, city, country } = req.body;

  if (!username || !password || !area || !city || !country) {
    req.flash("error", "All required fields must be filled");
    return res.redirect("/signup");
  }

  try {
    const newUser = new User({ username, email, contact, area, city, country });
    const registerdUser = await User.register(newUser, password);

    req.login(registerdUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to our website <3");
      res.redirect("/");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
});

router.get("/login", (req, res) => {
  res.render("authentication/login.ejs");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async (req, res) => {
    req.flash("success", "Logged in successfully");
    res.redirect("/");
  }
);

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "Logged out successfully");
    res.redirect("/");
  });
});

router.get("/maidSignup", (req, res) => {
  res.render("authentication/maidSignup");
});

router.post("/maidSignup", async (req, res, next) => {
  const {
    username,
    password,
    contact,
    image,
    services,
    experience,
    rate,
    serviceArea,
    city,
    country,
    lat,
    lng,
  } = req.body;

  if (!username || !password || !contact || !serviceArea || !city || !country) {
    req.flash("error", "All required fields must be filled");
    return res.redirect("/maidSignup");
  }

  if (rate < 0 || experience < 0) {
    req.flash("error", "Rate and experience cannot be negative");
    return res.redirect("/maidSignup");
  }

  let locationData;
  if (lat && lng) {
    locationData = {
      type: "Point",
      coordinates: [parseFloat(lng), parseFloat(lat)],
    };
  }

  const newMaid = new Maid({
    username,
    contact,
    image,
    services,
    experience,
    rate,
    serviceArea,
    city,
    country,
    location: locationData,
  });

  try {
    const registerdMaid = await Maid.register(newMaid, password);

    req.login(registerdMaid, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to our website <3");
      res.redirect("/maid/home");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/maidSignup");
  }
});

router.get("/maidLogin", (req, res) => {
  res.render("authentication/maidLogin.ejs");
});

router.post(
  "/maidLogin",
  passport.authenticate("maid", {
    failureRedirect: "/maidLogin",
    failureFlash: true,
  }),
  async (req, res) => {
    req.flash("success", "Logged in successfully");
    res.redirect("/maid/home");
  }
);

module.exports = router;
