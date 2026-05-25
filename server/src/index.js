import http from "node:http";
import dotenv from "dotenv";
import { Server } from "socket.io";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";
import { registerSocketHandlers } from "./sockets/index.js";

dotenv.config();

const startServer = async () => {
  await connectDB();

  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: env.allowedOrigins,
      credentials: true
    }
  });

  app.set("io", io);
  registerSocketHandlers(io);

  server.listen(env.port, "0.0.0.0", () => {
    console.log(`QuickKart API running on port ${env.port}`);
  });
};

startServer().catch((error) => {
  console.error("Failed to start QuickKart API", error);
  process.exit(1);
});
