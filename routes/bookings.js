const express = require("express");
const Booking = require("../models/booking");
const Maid = require("../models/maid");
const { isUser } = require("../middleware");
const catchAsync = require("../utils/catchAsync");

const router = express.Router();

const buildBookingDateTime = (date, timeSlot) => {
  if (!date || !timeSlot) {
    return null;
  }

  const selectedDateTime = new Date(`${date}T${timeSlot}`);
  return Number.isNaN(selectedDateTime.getTime()) ? null : selectedDateTime;
};

router.post("/book/:maidId", isUser, catchAsync(async (req, res) => {
  try {
    const { services, date, timeSlot } = req.body;
    const selectedServices = Array.isArray(services)
      ? services
      : services
      ? [services]
      : [];
    const selectedDateTime = buildBookingDateTime(date, timeSlot);

    if (!selectedDateTime) {
      req.flash("error", "Please select a valid booking date and time.");
      return res.redirect("/maidList");
    }

    if (selectedDateTime <= new Date()) {
      req.flash("error", "Please select a booking date and time in the future.");
      return res.redirect("/maidList");
    }

    const newBooking = new Booking({
      user: req.user._id,
      maid: req.params.maidId,
      services: selectedServices,
      date,
      timeSlot,
    });

    await newBooking.save();
    req.flash(
      "success",
      "Booking request sent successfully! The maid will review it."
    );
    res.redirect("/myBookings");
  } catch (err) {
    req.flash("error", "Failed to book appointment. Please try again.");
    res.redirect("/maidList");
  }
}));

router.post("/maid/:maidId/review", isUser, catchAsync(async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const maid = await Maid.findById(req.params.maidId);

    if (!maid) {
      req.flash("error", "Maid not found");
      return res.redirect("/maidList");
    }

    maid.reviews.push({
      rating: Number(rating),
      comment,
      author: req.user._id,
    });

    await maid.save();
    req.flash("success", "Review added successfully!");
    res.redirect(req.get("Referrer") || "/");
  } catch (err) {
    console.log(err);
    req.flash("error", "Could not add review. Ensure all fields are filled.");
    res.redirect(req.get("Referrer") || "/");
  }
}));

router.post("/maid/:maidId/review/:reviewId/delete", isUser, catchAsync(async (req, res) => {
  try {
    const { maidId, reviewId } = req.params;
    const maid = await Maid.findById(maidId);

    if (!maid) {
      req.flash("error", "Maid not found");
      return res.redirect(req.get("Referrer") || "/");
    }

    const review = maid.reviews.id(reviewId);
    if (!review || !review.author.equals(req.user._id)) {
      req.flash("error", "Unauthorized to delete this review");
      return res.redirect(req.get("Referrer") || "/");
    }

    await Maid.findByIdAndUpdate(maidId, {
      $pull: { reviews: { _id: reviewId } },
    });

    req.flash("success", "Review deleted successfully!");
    res.redirect(req.get("Referrer") || "/");
  } catch (err) {
    console.log(err);
    req.flash("error", "Could not delete review.");
    res.redirect(req.get("Referrer") || "/");
  }
}));

router.get("/myBookings", isUser, catchAsync(async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("maid", "username contact image")
      .sort({ date: 1 });

    res.render("pages/myBookings.ejs", { bookings });
  } catch (err) {
    req.flash("error", "Could not load your bookings.");
    res.redirect("/");
  }
}));

router.post("/user/booking/:id/cancel", isUser, catchAsync(async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);

    if (!booking || !booking.user.equals(req.user._id)) {
      req.flash("error", "Unauthorized or booking not found");
      return res.redirect("/myBookings");
    }

    if (["Pending", "Accepted"].includes(booking.status)) {
      booking.status = "Cancelled";
      await booking.save();
      req.flash("success", "Booking cancelled.");
    } else {
      req.flash("error", "Booking cannot be cancelled at this stage.");
    }

    res.redirect("/myBookings");
  } catch (err) {
    console.log(err);
    req.flash("error", "Action failed. Try again.");
    res.redirect("/myBookings");
  }
}));

module.exports = router;
