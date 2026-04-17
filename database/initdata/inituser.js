require("dotenv").config();
const mongoose = require("mongoose");
const { sampleUserData } = require("../userData");
const userSchema = require("../../models/user.js");

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
  await userSchema.deleteMany({});
  await userSchema.insertMany(sampleUserData);
  console.log("User Data initialized");
}

entry();
