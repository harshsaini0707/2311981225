import "dotenv/config";
import http from "http";
import cors from "cors";
import express from "express";
import { Server } from "socket.io";
import { Log } from "logging_middleware";
import notificationsRouter from "./routes/notifications";
import { requestLogger } from "./middleware/logger";
import { initSocket } from "./socket";
import { startWorkers } from "./services/queueService";

const app = express();
app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.get("/health", (_req, res) => {
  res.status(200).json({ ok: true });
});

app.use("/api/notifications", notificationsRouter);

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

initSocket(io);
startWorkers();

const PORT = Number(process.env.PORT ?? 4000);
server.listen(PORT, () => {
  void Log("backend", "INFO", "server", `Backend listening on port ${PORT}`);
});
