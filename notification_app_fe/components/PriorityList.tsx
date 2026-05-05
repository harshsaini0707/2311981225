"use client";

import { Avatar, Chip, List, ListItem, ListItemAvatar, ListItemText } from "@mui/material";

export interface PriorityItem {
  ID: string;
  Type: "Placement" | "Result" | "Event";
  Message: string;
  Timestamp: string;
}

const typeColor: Record<PriorityItem["Type"], "success" | "info" | "warning"> = {
  Placement: "success",
  Result: "info",
  Event: "warning",
};

interface PriorityListProps {
  items: PriorityItem[];
}

export default function PriorityList({ items }: PriorityListProps) {
  return (
    <List>
      {items.map((item, idx) => (
        <ListItem key={item.ID} divider>
          <ListItemAvatar>
            <Avatar>#{idx + 1}</Avatar>
          </ListItemAvatar>
          <ListItemText primary={item.Message} secondary={new Date(item.Timestamp).toLocaleString()} />
          <Chip color={typeColor[item.Type]} label={item.Type} />
        </ListItem>
      ))}
    </List>
  );
}
