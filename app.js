require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const engine = require("ejs-mate");
const session = require("express-session");
const passport = require("passport");
const flash = require("connect-flash");

const User = require("./models/user");
const Maid = require("./models/maid");
const authRoutes = require("./routes/auth");
const pageRoutes = require("./routes/pages");
const maidRoutes = require("./routes/maid");
const bookingRoutes = require("./routes/bookings");

const app = express();

require("./config/passportConfig")(passport);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", engine);

app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const sessionOptions = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
};

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.user = null;
  res.locals.maid = null;

  if (req.user) {
    if (req.user instanceof User) {
      res.locals.user = req.user;
    } else if (req.user instanceof Maid) {
      res.locals.maid = req.user;
    }
  }

  next();
});

app.use(authRoutes);
app.use(pageRoutes);
app.use(maidRoutes);
app.use(bookingRoutes);

if (!process.env.MONGO_URL) {
  throw new Error("MONGO_URL is missing in .env");
}

if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET is missing in .env");
}

const mongooseUrl = process.env.MONGO_URL;

async function main() {
  await mongoose.connect(mongooseUrl);
}

main()
  .then(() => {
    console.log("Connected to db");
    app.listen(process.env.PORT, () => {
      console.log("Server is listening to port 3000");
    });
  })
  .catch((err) => {
    console.log("Error connecting to db:", err.message);
    process.exit(1);
  });
