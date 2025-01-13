const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDatabase = require("./config/MongoDB.js");
const { errorHandler, notFound } = require("./middleware/Error.js");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const http = require("http");
const { Server } = require("socket.io");
const userRouter = require("./routes/UserRoute.js");
const eventRouter = require("./routes/EventRoute.js");

dotenv.config();
connectDatabase();

const app = express();
const port = process.env.PORT || 5000;

// middle wires
app.use(
  cors({
    credentials: true,
    origin: [      
      "http://localhost:5173"
    ],
  })
);
app.use(express.json());
app.use(cors());


app.use("/api/events", eventRouter);
app.use("/api/users", userRouter);

// error handlers
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
 