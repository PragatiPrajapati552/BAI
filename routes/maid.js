const express = require("express");
const Booking = require("../models/booking");
const { isMaid } = require("../middleware");
const catchAsync = require("../utils/catchAsync");

const router = express.Router();

router.get("/maid/home", isMaid, (req, res) => {
  if (req.user) {
    const maidData = req.user;
    res.render("maidPages/maidHome.ejs", { maidData });
  } else {
    res.redirect("/maidLogin");
  }
});

router.get("/maidCalendar", isMaid, catchAsync(async (req, res) => {
  if (!req.user) {
    req.flash("error", "You must be logged in as a Maid to view this page.");
    return res.redirect("/maidLogin");
  }

  try {
    const bookings = await Booking.find({ maid: req.user._id })
      .populate("user", "username email contact area city country")
      .sort({ date: 1 });

    res.render("maidPages/maidCalendar.ejs", { bookings, maidData: req.user });
  } catch (err) {
    console.log(err);
    req.flash("error", "Could not load your calendar.");
    res.redirect("/maid/home");
  }
}));

router.post("/booking/:id/:status", isMaid, catchAsync(async (req, res) => {
  try {
    const { id, status } = req.params;

    if (["Pending", "Accepted", "Rejected", "Completed"].includes(status)) {
      const updateData = { status };

      if (status === "Accepted" && req.body.acceptedServices) {
        updateData.services = Array.isArray(req.body.acceptedServices)
          ? req.body.acceptedServices
          : [req.body.acceptedServices];
      }

      await Booking.findByIdAndUpdate(id, updateData);
      req.flash("success", `Booking safely marked as ${status}`);
    } else {
      req.flash("error", "Invalid status update.");
    }

    res.redirect("/maidCalendar");
  } catch (err) {
    req.flash("error", "Action failed. Try again.");
    res.redirect("/maidCalendar");
  }
}));

module.exports = router;
