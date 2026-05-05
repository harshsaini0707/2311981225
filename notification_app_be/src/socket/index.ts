import { Server } from "socket.io";
import { Log } from "logging_middleware";
import { prisma } from "../lib/prisma";

let ioRef: Server | null = null;

export function initSocket(io: Server) {
  ioRef = io;

  io.on("connection", (socket) => {
    void Log("backend", "INFO", "socket", `Client connected: ${socket.id}`);

    socket.on("notification:read", async ({ id }: { id: string }) => {
      try {
        await prisma.notification.update({
          where: { id },
          data: { isRead: true },
        });
        io.emit("notification:read", { id });
        void Log("backend", "INFO", "socket", `Marked notification ${id} as read`);
      } catch (error) {
        void Log("backend", "ERROR", "socket", `notification:read failed: ${String(error)}`);
      }
    });

    socket.on("notification:read-all", async ({ studentId }: { studentId: string }) => {
      try {
        await prisma.notification.updateMany({
          where: { studentId },
          data: { isRead: true },
        });
        io.emit("notification:read-all", { studentId });
        void Log("backend", "INFO", "socket", `Marked all as read for ${studentId}`);
      } catch (error) {
        void Log("backend", "ERROR", "socket", `notification:read-all failed: ${String(error)}`);
      }
    });

    socket.on("disconnect", () => {
      void Log("backend", "INFO", "socket", `Client disconnected: ${socket.id}`);
    });
  });
}

export function emitNewNotification(notification: unknown) {
  ioRef?.emit("notification:new", { notification });
}
