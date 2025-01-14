const mongoose = require("mongoose");

console.log(process.env.MONGO_URL);
const connectDatabase = async () => {
  try {
    mongoose.set("strictQuery", false);
    const connection = await mongoose.connect(process.env.MONGO_URL);
    console.log("mongo connected");
  } catch (err) {
    console.log(`Error: ${err.message}`);
    process.exit(1);
  }
};
module.exports = connectDatabase;
