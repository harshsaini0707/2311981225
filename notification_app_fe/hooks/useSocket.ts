"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Log } from "logging_middleware";

export function useSocket<T>() {
  const [newNotification, setNewNotification] = useState<T | null>(null);

  useEffect(() => {
    const socket = io("http://localhost:4000");

    socket.on("connect", () => {
      void Log("frontend", "INFO", "socket", `Connected ${socket.id}`);
    });

    socket.on("disconnect", () => {
      void Log("frontend", "INFO", "socket", "Disconnected from websocket");
    });

    socket.on("notification:new", ({ notification }) => {
      setNewNotification(notification as T);
      void Log("frontend", "INFO", "socket", "Received notification:new event");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return { newNotification };
}
