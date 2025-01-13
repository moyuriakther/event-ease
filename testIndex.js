// Setting up the "EventEase" project with Express.js for backend

// 1. Initialize the project
// Run these commands in your terminal to set up the project directory and dependencies:
// mkdir eventease && cd eventease
// npm init -y
// npm install express cors body-parser jsonwebtoken bcryptjs socket.io mongoose

// 2. Set up the project structure:
// eventease/
// ├── backend/
// │   ├── server.js
// │   ├── controllers/
// │   ├── middlewares/
// │   ├── models/
// │   └── routes/
// ├── frontend/
// │   ├── pages/
// │   ├── components/
// │   └── styles/

// 3. Backend Code

// backend/server.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/eventease", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const EventSchema = new mongoose.Schema({
  name: String,
  date: String,
  location: String,
  maxAttendees: Number,
  createdBy: mongoose.Schema.Types.ObjectId,
});

const AttendeeSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  eventId: mongoose.Schema.Types.ObjectId,
});

const User = mongoose.model("User", UserSchema);
const Event = mongoose.model("Event", EventSchema);
const Attendee = mongoose.model("Attendee", AttendeeSchema);

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Authentication Middleware
const authenticate = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).send("Access Denied");

  jwt.verify(token, "secret_key", (err, user) => {
    if (err) return res.status(403).send("Invalid Token");
    req.user = user;
    next();
  });
};

// Routes
app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = new User({ email, password: hashedPassword });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: "User already exists" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).send("Invalid Credentials");
  }
  const token = jwt.sign({ id: user._id }, "secret_key", { expiresIn: "1h" });
  res.json({ token });
});

app.post("/events", authenticate, async (req, res) => {
  const { name, date, location, maxAttendees } = req.body;
  try {
    const event = new Event({
      name,
      date,
      location,
      maxAttendees,
      createdBy: req.user.id,
    });
    await event.save();
    io.emit("event_created", event);
    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ error: "Error creating event" });
  }
});

app.get("/events", authenticate, async (req, res) => {
  const events = await Event.find();
  res.json(events);
});

app.post("/events/:id/register", authenticate, async (req, res) => {
  const { id } = req.params;
  const event = await Event.findById(id);
  if (!event) return res.status(404).send("Event not found");

  const attendeesCount = await Attendee.countDocuments({ eventId: event._id });
  if (attendeesCount >= event.maxAttendees) return res.status(400).send("Event is full");

  try {
    const attendee = new Attendee({ userId: req.user.id, eventId: event._id });
    await attendee.save();
    io.emit("attendee_registered", attendee);
    res.status(201).json(attendee);
  } catch (err) {
    res.status(400).json({ error: "Error registering for event" });
  }
});

// Real-time updates with Socket.IO
io.on("connection", (socket) => {
  console.log("A user connected");
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Start the server
server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
