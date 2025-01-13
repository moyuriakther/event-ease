const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  name:{
      type: String,
      required: true,
    },
  date: {
      type: String,
      required: true,
    },
  location: {
      type: String,
      required: true,
    },
  maxAttendees: {
      type: Number,
      required: true,
    },
  createdBy:{
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    },{
    timestamps: true,
  });

  const Event = mongoose.model("Event", EventSchema);
  module.exports = Event;