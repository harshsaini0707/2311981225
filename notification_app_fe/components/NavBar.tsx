"use client";

import Link from "next/link";
import { AppBar, Badge, Box, Button, Toolbar, Typography } from "@mui/material";

export default function NavBar() {
  return (
    <AppBar position="sticky">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6">Campus Notification Platform</Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button color="inherit" component={Link} href="/">
            <Badge color="error" variant="dot" invisible>
              All Notifications
            </Badge>
          </Button>
          <Button color="inherit" component={Link} href="/priority">
            Priority Inbox
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
