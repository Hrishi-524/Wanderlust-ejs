const mongoose = require("mongoose");
const MONGOOSE_URL = "mongodb://127.0.0.1:27017/wanderlust";
async function main() {
  await mongoose.connect(MONGOOSE_URL);
}
main()
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err);
  });

const initData = require("./data.js");
const Listing = require("../models/listing.js");
const Reviews = require("../models/review.js");

const initDB = async () => {
  await Reviews.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "677d2bb3d129599184ab686e",
  }));
  await Listing.deleteMany({});
  console.log("data deleted");
  await Listing.insertMany(initData.data);
  console.log("data initialized");
};

initDB();
