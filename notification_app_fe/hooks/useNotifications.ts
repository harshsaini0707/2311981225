"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchNotifications, markAllRead, markRead } from "@/lib/api";
import { markAsRead } from "@/lib/readStore";
import { useSocket } from "./useSocket";

export interface UINotification {
  id: string;
  type: "Placement" | "Result" | "Event";
  message: string;
  timestamp: string;
}

interface ApiNotification {
  ID: string;
  Type: "Placement" | "Result" | "Event";
  Message: string;
  Timestamp: string;
}

function normalizeNotification(item: ApiNotification): UINotification {
  return {
    id: item.ID,
    type: item.Type,
    message: item.Message,
    timestamp: item.Timestamp,
  };
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<UINotification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(20);
  const [total, setTotal] = useState<number>(0);
  const [filterType, setFilterType] = useState<"All" | "Placement" | "Result" | "Event">("All");
  const { newNotification } = useSocket<UINotification>();

  async function loadData(nextPage = page, nextType = filterType) {
    try {
      setLoading(true);
      setError("");
      const response = await fetchNotifications(nextPage, limit, nextType);
      const items = (response.data.notifications as ApiNotification[]).map(normalizeNotification);
      setNotifications(items);
      setTotal(response.data.total ?? items.length);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData(1, filterType);
  }, [filterType]);

  useEffect(() => {
    if (!newNotification) {
      return;
    }
    setNotifications((prev) => [newNotification, ...prev]);
  }, [newNotification]);

  async function onMarkRead(id: string) {
    await markRead(id);
    markAsRead(id);
    setNotifications((prev) => prev.map((item) => (item.id === id ? { ...item } : item)));
  }

  async function onMarkAllRead(studentId: string) {
    await markAllRead(studentId);
    notifications.forEach((item) => markAsRead(item.id));
    setNotifications((prev) => [...prev]);
  }

  function setFilter(type: "All" | "Placement" | "Result" | "Event") {
    setPage(1);
    setFilterType(type);
  }

  async function loadMore(nextPage: number) {
    setPage(nextPage);
    await loadData(nextPage, filterType);
  }

  const unreadCount = useMemo(() => notifications.length, [notifications]);

  return {
    notifications,
    loading,
    error,
    page,
    total,
    limit,
    filterType,
    unreadCount,
    loadMore,
    setFilter,
    markRead: onMarkRead,
    markAllRead: onMarkAllRead,
  };
}
