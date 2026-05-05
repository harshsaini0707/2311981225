import { Log } from "logging_middleware";
import { ExternalNotification, NotifType } from "../types/notification";

const WEIGHTS: Record<NotifType, number> = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

function score(notification: ExternalNotification): number {
  const ageHours = (Date.now() - new Date(notification.Timestamp).getTime()) / 3_600_000;
  return WEIGHTS[notification.Type] / (1 + ageHours);
}

export function getTopN(notifications: ExternalNotification[], n: number): ExternalNotification[] {
  void Log(
    "backend",
    "INFO",
    "priorityService",
    `Ranking top ${n} from ${notifications.length} notifications`
  );
  return [...notifications].sort((a, b) => score(b) - score(a)).slice(0, n);
}
