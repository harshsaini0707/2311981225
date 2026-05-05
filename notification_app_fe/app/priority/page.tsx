"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  MenuItem,
  Select,
  Slider,
  Typography,
} from "@mui/material";
import { fetchPriorityNotifications } from "@/lib/api";

interface PriorityItem {
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

export default function PriorityPage() {
  const [topN, setTopN] = useState<number>(10);
  const [filterType, setFilterType] = useState<"All" | PriorityItem["Type"]>("All");
  const [items, setItems] = useState<PriorityItem[]>([]);

  async function loadPriority() {
    const response = await fetchPriorityNotifications(topN);
    setItems(response.data.notifications as PriorityItem[]);
  }

  useEffect(() => {
    void loadPriority();
  }, [topN]);

  const visibleItems = useMemo(() => {
    if (filterType === "All") {
      return items;
    }
    return items.filter((item) => item.Type === filterType);
  }, [items, filterType]);

  return (
    <Container sx={{ py: 3 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Priority Inbox
      </Typography>

      <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 3, flexWrap: "wrap" }}>
        <Box sx={{ width: 250 }}>
          <Typography gutterBottom>Top N: {topN}</Typography>
          <Slider
            value={topN}
            marks={[
              { value: 10, label: "10" },
              { value: 15, label: "15" },
              { value: 20, label: "20" },
            ]}
            step={5}
            min={10}
            max={20}
            onChange={(_e, value) => setTopN(value as number)}
          />
        </Box>
        <FormControl sx={{ minWidth: 160 }}>
          <InputLabel>Type</InputLabel>
          <Select value={filterType} label="Type" onChange={(e) => setFilterType(e.target.value as "All")}>
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Placement">Placement</MenuItem>
            <MenuItem value="Result">Result</MenuItem>
            <MenuItem value="Event">Event</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" onClick={() => void loadPriority()}>
          Refresh
        </Button>
      </Box>

      <List>
        {visibleItems.map((item, idx) => (
          <ListItem key={item.ID} divider>
            <ListItemAvatar>
              <Avatar>#{idx + 1}</Avatar>
            </ListItemAvatar>
            <ListItemText primary={item.Message} secondary={new Date(item.Timestamp).toLocaleString()} />
            <Chip color={typeColor[item.Type]} label={item.Type} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
}
