const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const maidSchema = new Schema({
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number], // [lng, lat]
    },
  },
  contact: {
    type: String,
    required: true,
  },
  image: {
    url: String,
    filename: String,
  },
  services: {
    type: [String],
    enum: ["cleaning", "laundry", "cooking", "dishWashing"],
    required: true,
  },
  experience: Number,

  rate: {
    type: Number,
    required: true,
    min: 0,
  },
  serviceArea: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  reviews: [
    {
      rating: { type: Number, min: 1, max: 5, required: true },
      comment: { type: String, required: true },
      author: { type: Schema.Types.ObjectId, ref: "User", required: true },
      createdAt: { type: Date, default: Date.now }
    }
  ],
});

maidSchema.index({ location: "2dsphere" });
maidSchema.plugin(passportLocalMongoose);

const Maid = mongoose.model("Maid", maidSchema);
module.exports = Maid;
