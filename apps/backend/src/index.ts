import { app } from "./app.js";
import { env } from "./config/env.js";

const server = app.listen(env.PORT, () => {
  console.log(`🚀 Backend Auth Service running on http://localhost:${env.PORT}`);
  console.log(`📍 Environment: ${env.NODE_ENV}`);
  console.log(`📡 Health Check: http://localhost:${env.PORT}/health`);
});

// Graceful shutdown handling
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully...");
  server.close(() => {
    console.log("Process terminated.");
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully...");
  server.close(() => {
    console.log("Process terminated.");
  });
});
