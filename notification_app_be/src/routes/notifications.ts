import { Router } from "express";
import {
  bulkNotify,
  createNotification,
  deleteNotification,
  fetchAll,
  fetchById,
  getPriority,
  markAllRead,
  markRead,
} from "../controllers/notificationController";

const router = Router();

router.get("/", fetchAll);
router.get("/priority", getPriority);
router.get("/:id", fetchById);
router.post("/", createNotification);
router.post("/bulk", bulkNotify);
router.patch("/:id/read", markRead);
router.patch("/read-all", markAllRead);
router.delete("/:id", deleteNotification);

export default router;
