"use client";

import { io } from "socket.io-client";

// export const socket = io();




const socket = io("http://localhost:5000", {
  autoConnect: false, // Prevents auto-connect
});

export default socket;
