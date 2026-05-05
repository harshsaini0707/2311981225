"use client";

import { Box, Button, CircularProgress, Container, Pagination, Typography } from "@mui/material";
import FilterTabs from "@/components/FilterTabs";
import NotificationList from "@/components/NotificationList";
import { useNotifications } from "@/hooks/useNotifications";

export default function HomePage() {
  const { notifications, loading, error, page, total, limit, filterType, setFilter, loadMore, markRead, markAllRead } =
    useNotifications();

  return (
    <Container sx={{ py: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h4">All Notifications</Typography>
        <Button variant="contained" onClick={() => void markAllRead()}>
          Mark All Read
        </Button>
      </Box>

      <FilterTabs value={filterType} onChange={setFilter} />

      {loading ? <CircularProgress /> : null}
      {error ? <Typography color="error">{error}</Typography> : null}

      {!loading ? <NotificationList items={notifications} onMarkRead={(id) => void markRead(id)} /> : null}

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
