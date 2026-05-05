"use client";

import { Tab, Tabs } from "@mui/material";

export type NotificationFilter = "All" | "Placement" | "Result" | "Event";

interface FilterTabsProps {
  value: NotificationFilter;
  onChange: (value: NotificationFilter) => void;
}

const tabs: NotificationFilter[] = ["All", "Placement", "Result", "Event"];

export default function FilterTabs({ value, onChange }: FilterTabsProps) {
  return (
    <Tabs value={value} onChange={(_event, nextValue) => onChange(nextValue as NotificationFilter)} sx={{ mb: 2 }}>
      {tabs.map((tab) => (
        <Tab key={tab} value={tab} label={tab} />
      ))}
    </Tabs>
  );
}
