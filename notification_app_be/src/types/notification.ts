export type NotifType = "Placement" | "Result" | "Event";

export interface ExternalNotification {
  ID: string;
  Type: NotifType;
  Message: string;
  Timestamp: string;
}

export interface NotificationQuery {
  page?: number;
  limit?: number;
  notification_type?: NotifType;
}
