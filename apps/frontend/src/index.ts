import { serve } from "bun";
import index from "./index.html";

const server = serve({
  routes: {
    "/*": index,
  },
  development: process.env.NODE_ENV !== "production",
  port: Number(process.env.PORT || 5173),
});

console.log(`🚀 Agrovia Frontend running at http://localhost:${server.port}`);
