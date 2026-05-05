"use client";

import { Box, Button, CircularProgress, Container, Pagination, Tab, Tabs, Typography } from "@mui/material";
import NotificationCard from "@/components/NotificationCard";
import { useNotifications } from "@/hooks/useNotifications";
import { isRead } from "@/lib/readStore";

const tabs = ["All", "Placement", "Result", "Event"] as const;

export default function HomePage() {
  const { notifications, loading, error, page, total, limit, filterType, setFilter, loadMore, markRead, markAllRead } =
    useNotifications();

  return (
    <Container sx={{ py: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h4">All Notifications</Typography>
        <Button variant="contained" onClick={() => void markAllRead("student-demo-id")}>
          Mark All Read
        </Button>
      </Box>

      <Tabs value={filterType} onChange={(_e, value) => setFilter(value)} sx={{ mb: 2 }}>
        {tabs.map((tab) => (
          <Tab key={tab} value={tab} label={tab} />
        ))}
      </Tabs>

      {loading ? <CircularProgress /> : null}
      {error ? <Typography color="error">{error}</Typography> : null}

      {!loading && notifications.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          No notifications found.
        </Typography>
      ) : null}

      <Box sx={{ display: "grid", gap: 2 }}>
        {notifications.map((item, index) => (
          <NotificationCard
            key={item.id}
            notification={item}
            isRead={isRead(item.id)}
            isNew={index === 0}
            onClick={(id) => void markRead(id)}
          />
        ))}
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <Pagination
          page={page}
          onChange={(_e, value) => void loadMore(value)}
          count={Math.max(1, Math.ceil(total / limit))}
          color="primary"
        />
      </Box>
    </Container>
  );
}
