require("dotenv").config();
const mongoose = require("mongoose");
const { sampleMaidData } = require("../maidData.js");
const maidSchema = require("../../models/maid.js");

const mongooseUrl = process.env.MONGO_URL;
async function main() {
  mongoose.connect(mongooseUrl);
}

main()
  .then((res) => {
    console.log("Connected to db");
  })
  .catch((err) => {
    console.log("Error connecting to db");
  });

async function entry() {
  await maidSchema.deleteMany({});
  await maidSchema.insertMany(sampleMaidData);
  console.log("Maid Data initialized");
}

entry();
