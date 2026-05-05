import { Request, Response } from "express";
import { Log } from "logging_middleware";
import { prisma } from "../lib/prisma";
import { emitNewNotification } from "../socket";
import { fetchNotificationById, fetchNotifications } from "../services/notificationService";
import { enqueueBulkJobs } from "../services/queueService";
import { getTopN } from "../services/priorityService";

function parseIntOrDefault(value: string | undefined, fallback: number): number {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isNaN(parsed) ? fallback : parsed;
}

function clampExternalLimit(limit: number): number {
  return Math.max(5, Math.min(10, limit));
}

export async function fetchAll(req: Request, res: Response) {
  void Log("backend", "INFO", "notificationController", "fetchAll entered");
  try {
    const page = parseIntOrDefault(req.query.page as string, 1);
    const requestedLimit = parseIntOrDefault(req.query.limit as string, 10);
    const limit = clampExternalLimit(requestedLimit);
    const notification_type = req.query.notification_type as "Event" | "Result" | "Placement" | undefined;
    const data = await fetchNotifications({ page, limit, notification_type });
    void Log("backend", "INFO", "notificationController", "fetchAll success");
    return res.status(200).json({ success: true, data });
  } catch (error) {
    void Log("backend", "ERROR", "notificationController", `fetchAll error: ${String(error)}`);
    return res.status(500).json({ success: false, error: "Unable to fetch notifications" });
  }
}

export async function fetchById(req: Request, res: Response) {
  void Log("backend", "INFO", "notificationController", "fetchById entered");
  try {
    const { id } = req.params;
    const data = await fetchNotificationById(id);
    void Log("backend", "INFO", "notificationController", "fetchById success");
    return res.status(200).json({ success: true, data });
  } catch (error) {
    void Log("backend", "ERROR", "notificationController", `fetchById error: ${String(error)}`);
    return res.status(500).json({ success: false, error: "Unable to fetch notification" });
  }
}

export async function createNotification(req: Request, res: Response) {
  void Log("backend", "INFO", "notificationController", "createNotification entered");
  try {
    const { studentId, type, message } = req.body as {
      studentId: string;
      type: "Event" | "Result" | "Placement";
      message: string;
    };

    const notification = await prisma.notification.create({
      data: { studentId, type, message },
    });

    emitNewNotification(notification);
    void Log("backend", "INFO", "notificationController", `createNotification success ${notification.id}`);
    return res.status(201).json({ success: true, data: notification });
  } catch (error) {
    void Log("backend", "ERROR", "notificationController", `createNotification error: ${String(error)}`);
    return res.status(500).json({ success: false, error: "Unable to create notification" });
  }
}

export async function markRead(req: Request, res: Response) {
  void Log("backend", "INFO", "notificationController", "markRead entered");
  try {
    const { id } = req.params;
    const updated = await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
    void Log("backend", "INFO", "notificationController", `markRead success ${id}`);
    return res.status(200).json({ success: true, data: { id: updated.id, isRead: updated.isRead } });
  } catch (error) {
    void Log("backend", "ERROR", "notificationController", `markRead error: ${String(error)}`);
    return res.status(500).json({ success: false, error: "Unable to mark notification as read" });
  }
}

export async function markAllRead(req: Request, res: Response) {
  void Log("backend", "INFO", "notificationController", "markAllRead entered");
  try {
    const { studentId } = req.body as { studentId: string };
    await prisma.notification.updateMany({
      where: { studentId },
      data: { isRead: true },
    });
    void Log("backend", "INFO", "notificationController", `markAllRead success for ${studentId}`);
    return res.status(200).json({ success: true, data: { studentId } });
  } catch (error) {
    void Log("backend", "ERROR", "notificationController", `markAllRead error: ${String(error)}`);
    return res.status(500).json({ success: false, error: "Unable to mark all notifications as read" });
  }
}

export async function deleteNotification(req: Request, res: Response) {
  void Log("backend", "INFO", "notificationController", "deleteNotification entered");
  try {
    const { id } = req.params;
    await prisma.notification.delete({ where: { id } });
    void Log("backend", "INFO", "notificationController", `deleteNotification success ${id}`);
    return res.status(200).json({ success: true, data: { id } });
  } catch (error) {
    void Log("backend", "ERROR", "notificationController", `deleteNotification error: ${String(error)}`);
    return res.status(500).json({ success: false, error: "Unable to delete notification" });
  }
}

export async function getPriority(req: Request, res: Response) {
  void Log("backend", "INFO", "notificationController", "getPriority entered");
  try {
    const n = parseIntOrDefault(req.query.n as string, 10);
    const pageSize = 10;
    const pagesNeeded = Math.max(1, Math.ceil(n / pageSize));
    const batches = await Promise.all(
      Array.from({ length: pagesNeeded }, (_, idx) =>
        fetchNotifications({ page: idx + 1, limit: pageSize })
      )
    );
    const notifications = batches.flatMap((batch) => batch.notifications ?? []);
    const ranked = getTopN(notifications, n);
    void Log("backend", "INFO", "notificationController", "getPriority success");
    return res.status(200).json({ success: true, data: { notifications: ranked, n } });
  } catch (error) {
    void Log("backend", "ERROR", "notificationController", `getPriority error: ${String(error)}`);
    return res.status(500).json({ success: false, error: "Unable to compute priority notifications" });
  }
}

export async function bulkNotify(req: Request, res: Response) {
  void Log("backend", "INFO", "notificationController", "bulkNotify entered");
  try {
    const { studentIds, message, type } = req.body as {
      studentIds: string[];
      message: string;
      type: "Event" | "Result" | "Placement";
    };

    await prisma.notification.createMany({
      data: studentIds.map((studentId) => ({ studentId, message, type })),
    });

    await enqueueBulkJobs(studentIds, message);
    void Log("backend", "INFO", "notificationController", `bulkNotify queued ${studentIds.length} jobs`);
    return res.status(202).json({ success: true, data: { queued: studentIds.length } });
  } catch (error) {
    void Log("backend", "ERROR", "notificationController", `bulkNotify error: ${String(error)}`);
    return res.status(500).json({ success: false, error: "Unable to process bulk notification" });
  }
}
