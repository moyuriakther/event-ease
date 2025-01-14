const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");
const connectDatabase = require("./config/MongoDB.js");
const { errorHandler, notFound } = require("./middleware/Error.js");
const userRouter = require("./routes/UserRoute.js");
const eventRouter = require("./routes/EventRoute.js");

dotenv.config();
connectDatabase();

const app = express();
const port = process.env.PORT || 5000;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"], // Frontend origin
    credentials: true,
  },
});

// middle wires
app.use(
  cors({
    credentials: true,
    origin: [      
      "http://localhost:3000"
    ],
  })
);
app.use(express.json());
app.use(cors());

// Share the io instance with routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use("/api/events", eventRouter);
app.use("/api/users", userRouter);

// error handlers
app.use(notFound);
app.use(errorHandler);

// Handle Socket.IO connections
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
 