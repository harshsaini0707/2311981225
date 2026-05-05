import axios from "axios";
import { Log } from "logging_middleware";
import { NotificationQuery } from "../types/notification";

const api = axios.create({
  baseURL: process.env.EXTERNAL_API_BASE,
});

function authHeaders() {
  return {
    Authorization: `Bearer ${process.env.EXTERNAL_API_KEY ?? ""}`,
  };
}

export async function fetchNotifications(query: NotificationQuery) {
  void Log("backend", "INFO", "notificationService", "Fetching all notifications from external API");
  const { data } = await api.get("/notifications", { params: query, headers: authHeaders() });
  return data;
}

export async function fetchNotificationById(id: string) {
  void Log("backend", "INFO", "notificationService", `Fetching notification by id ${id}`);
  const { data } = await api.get("/notifications", {
    params: { id },
    headers: authHeaders(),
  });
  return data;
}
