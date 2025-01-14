const express = require("express");
const asyncHandler = require("express-async-handler");
const { admin, protect } = require("../middleware/Auth.js");
const Event = require("../models/EventModel");
const Attendence = require("../models/AttendenceSchema");


const eventRouter = express.Router();

eventRouter.post("/", protect, asyncHandler(async (req, res) => {
  console.log(req.body, "body")
  const { name, date, location, maxAttendees } = req.body;
  try {
    const event = new Event({
      name,
      date,
      location,
      maxAttendees,
      createdBy: req.user.id,
    });
    console.log(event, "event")
    await event.save();
    req.io.emit("event_created", event); // event creation notification
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
  if (!event) return res.status(404).send("Event not found");

 // Check if user is already registered
  const existingAttendee = await Attendence.findOne({ 
    userId: req.user.id, 
    eventId: event._id 
  });
  if (existingAttendee) {
        // Emit the already registered event
    req.io.emit("already_registered", {
      name: event.name,
      userId: req.user.id
    });
    return res.status(400).json({ 
      error: `You are already registered for "${event.name}"` 
    });
  }

  // Check if seats are available
  if (event.maxAttendees <= 0) {
     req.io.emit("event_full", {
        name: event.name
      });
        return res.status(400).json({ 
      error: `Seats are full On "${event.name} Event"` 
    });
  }

  try {
    const attendee = new Attendence({ userId: req.user.id, eventId: event._id });
    await attendee.save();
     // Update event's maxAttendees
    await Event.findByIdAndUpdate(
      id,
      { maxAttendees: event.maxAttendees - 1 },
      { new: true }
    );
    req.io.emit("attendee_registered", attendee); //attendee registration notification
    res.status(201).json(attendee);
  } catch (err) {
    res.status(400).json({ error: "Error registering for event" });
  }
}));

module.exports = eventRouter;