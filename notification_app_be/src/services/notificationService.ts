import axios from "axios";
import { Log } from "logging_middleware";
import { NotificationQuery } from "../types/notification";

const api = axios.create({
  baseURL: process.env.EXTERNAL_API_BASE,
});

let cachedToken: string | null = process.env.EXTERNAL_API_KEY ?? null;

async function getAccessToken(): Promise<string> {
  if (cachedToken) {
    return cachedToken;
  }

  const authPayload = {
    email: process.env.AFFORD_EMAIL,
    name: process.env.AFFORD_NAME,
    rollNo: process.env.AFFORD_ROLLNO,
    accessCode: process.env.AFFORD_ACCESS_CODE,
    clientID: process.env.AFFORD_CLIENT_ID,
    clientSecret: process.env.AFFORD_CLIENT_SECRET,
  };

  const { data } = await api.post("/auth", authPayload);
  cachedToken = data.access_token as string;
  return cachedToken;
}

async function authHeaders() {
  const token = await getAccessToken();
  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function fetchNotifications(query: NotificationQuery) {
  void Log("backend", "INFO", "notificationService", "Fetching all notifications from external API");
  try {
    const { data } = await api.get("/notifications", { params: query, headers: await authHeaders() });
    return data;
  } catch (error) {
    cachedToken = null;
    const { data } = await api.get("/notifications", { params: query, headers: await authHeaders() });
    return data;
  }
}

export async function fetchNotificationById(id: string) {
  void Log("backend", "INFO", "notificationService", `Fetching notification by id ${id}`);
  try {
    const { data } = await api.get("/notifications", {
      params: { id },
      headers: await authHeaders(),
    });
    return data;
  } catch (error) {
    cachedToken = null;
    const { data } = await api.get("/notifications", {
      params: { id },
      headers: await authHeaders(),
    });
    return data;
  }
}
