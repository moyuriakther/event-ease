const express = require("express");
const asyncHandler = require("express-async-handler");
const { admin, protect } = require("../middleware/Auth.js");
const Event = require("../models/EventModel");
const Attendence = require("../models/AttendenceSchema");


const eventRouter = express.Router();

eventRouter.post("/", protect, asyncHandler(async (req, res) => {
  const { name, date, location, maxAttendees } = req.body;
  console.log(req.body)
  try {
    const event = new Event({
      name,
      date,
      location,
      maxAttendees,
      createdBy: req.user.id,
    });
    console.log({event})
    await event.save();
    io.emit("event_created", event); // event creation notification
    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ error: "Error creating event" });
  }
}));

eventRouter.get("/", protect, asyncHandler(async (req, res) => {
  const events = await Event.find();
  res.json(events);
}));

eventRouter.post("/:id/register", protect, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const event = await Event.findById(id);
  console.log({event})
  if (!event) return res.status(404).send("Event not found");

  const attendeesCount = await Attendence.countDocuments({ eventId: event._id });
  if (attendeesCount >= event.maxAttendees) return res.status(400).send("Seats are full in this Event");

  try {
    const attendee = new Attendence({ userId: req.user.id, eventId: event._id });
    await attendee.save();
    io.emit("attendee_registered", attendee); //attendee registration notification
    res.status(201).json(attendee);
  } catch (err) {
    res.status(400).json({ error: "Error registering for event" });
  }
}));

module.exports = eventRouter;