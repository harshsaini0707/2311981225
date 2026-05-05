"use client";

import { Log } from "logging_middleware";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000/api/notifications";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(`${BASE_URL}${path}`, options);
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    const body = (await response.json()) as T;
    return body;
  } catch (error) {
    void Log("frontend", "ERROR", "api", `API request failed: ${String(error)}`);
    throw error;
  }
}

export async function fetchNotifications(page = 1, limit = 20, type?: string) {
  void Log("frontend", "INFO", "api", "Fetching notifications");
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (type && type !== "All") {
    params.set("notification_type", type);
  }
  return request<{ success: boolean; data: { notifications: unknown[]; total: number; page: number; limit: number } }>(
    `/?${params.toString()}`
  );
}

export async function fetchPriorityNotifications(n = 10) {
  void Log("frontend", "INFO", "api", `Fetching priority notifications for top ${n}`);
  return request<{ success: boolean; data: { notifications: unknown[]; n: number } }>(`/priority?n=${n}`);
}

export async function markRead(id: string) {
  void Log("frontend", "INFO", "api", `Marking notification ${id} as read`);
  return request<{ success: boolean; data: { id: string; isRead: boolean } }>(`/${id}/read`, { method: "PATCH" });
}

export async function markAllRead(studentId: string) {
  void Log("frontend", "INFO", "api", "Marking all notifications as read");
  return request<{ success: boolean; data: { studentId: string } }>("/read-all", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ studentId }),
  });
}
