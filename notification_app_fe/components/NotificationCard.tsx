"use client";

import { Badge, Box, Card, CardContent, Chip, Typography } from "@mui/material";
import { UINotification } from "@/hooks/useNotifications";

interface NotificationCardProps {
  notification: UINotification;
  isRead: boolean;
  isNew: boolean;
  onClick: (id: string) => void;
}

const borderColorByType = {
  Placement: "#2E7D32",
  Result: "#1976D2",
  Event: "#ED6C02",
} as const;

function formatRelativeTime(timestamp: string): string {
  const diffMs = Date.now() - new Date(timestamp).getTime();
  const hours = Math.floor(diffMs / 3_600_000);
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

export default function NotificationCard({ notification, isRead, isNew, onClick }: NotificationCardProps) {
  return (
    <Card
      sx={{
        borderLeft: `5px solid ${isRead ? "#ddd" : borderColorByType[notification.type]}`,
        opacity: isRead ? 0.75 : 1,
        cursor: "pointer",
      }}
      onClick={() => onClick(notification.id)}
    >
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Badge color="error" variant="dot" invisible={isRead}>
              <Typography variant="h6" sx={{ fontWeight: isRead ? 400 : 700 }}>
                {notification.message}
              </Typography>
            </Badge>
            {isNew ? <Chip color="secondary" size="small" label="NEW" /> : null}
          </Box>
          <Chip size="small" label={notification.type} />
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {formatRelativeTime(notification.timestamp)}
        </Typography>
      </CardContent>
    </Card>
  );
}
