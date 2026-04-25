const express = require("express");
const Maid = require("../models/maid");
const { isUser } = require("../middleware");
const catchAsync = require("../utils/catchAsync");

const router = express.Router();

const serviceRoutes = ["/cleaning", "/cooking", "/laundry", "/dishWashing"];

router.get("/", (req, res) => {
  res.render("pages/home.ejs");
});

serviceRoutes.forEach((routePath) => {
  router.get(routePath, isUser, (req, res) => {
    const { service } = req.query;
    res.render("pages/addon.ejs", { service });
  });
});

router.get("/maidList", catchAsync(async (req, res) => {
  try {
    let services = req.query.services;
    const { lat, lng } = req.query;

    if (!services) services = [];
    if (!Array.isArray(services)) services = [services];

    const query = { services: { $in: services } };

    if (lat && lng) {
      query.location = {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          $maxDistance: 10000,
        },
      };
    }

    const filterMaid = await Maid.find(query).populate(
      "reviews.author",
      "username"
    );
    res.render("pages/maidList", { filterMaid });
  } catch (error) {
    console.log("Database Search Error:", error);

    let services = req.query.services || [];
    if (!Array.isArray(services)) services = [services];

    const fallbackMaids = await Maid.find({
      services: { $in: services },
    }).populate("reviews.author", "username");

    res.render("pages/maidList", { filterMaid: fallbackMaids });
  }
}));

module.exports = router;
