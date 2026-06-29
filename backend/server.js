import { createApp } from "./app.js";

const PORT = Number(process.env.PORT || process.env.API_PORT || 4000);
const server = createApp();

server.listen(PORT, () => {
  console.log(`Nexus API microservice listening on http://localhost:${PORT}`);
});
