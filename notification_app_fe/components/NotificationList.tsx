"use client";

import { Box, Typography } from "@mui/material";
import { UINotification } from "@/hooks/useNotifications";
import { isRead } from "@/lib/readStore";
import NotificationCard from "./NotificationCard";

interface NotificationListProps {
  items: UINotification[];
  onMarkRead: (id: string) => void;
}

export default function NotificationList({ items, onMarkRead }: NotificationListProps) {
  if (items.length === 0) {
    return (
      <Typography variant="body1" color="text.secondary">
        No notifications found.
      </Typography>
    );
  }

  return (
    <Box sx={{ display: "grid", gap: 2 }}>
      {items.map((item, index) => (
        <NotificationCard
          key={item.id}
          notification={item}
          isRead={isRead(item.id)}
          isNew={index === 0}
          onClick={onMarkRead}
        />
      ))}
    </Box>
  );
}
