"use client";

const READ_IDS_KEY = "notification_read_ids";

export function getReadIds(): Set<string> {
  if (typeof window === "undefined") {
    return new Set<string>();
  }
  const raw = window.localStorage.getItem(READ_IDS_KEY);
  if (!raw) {
    return new Set<string>();
  }
  return new Set<string>(JSON.parse(raw) as string[]);
}

export function markAsRead(id: string): void {
  const readSet = getReadIds();
  readSet.add(id);
  window.localStorage.setItem(READ_IDS_KEY, JSON.stringify(Array.from(readSet)));
}

export function isRead(id: string): boolean {
  return getReadIds().has(id);
}
