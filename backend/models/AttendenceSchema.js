const mongoose = require("mongoose");
const AttendenceSchema = new mongoose.Schema({
  userId:{
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  eventId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Event",
    },
});
const Attendence = mongoose.model("Attendence", AttendenceSchema);
module.exports = Attendence;

