"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  Typography,
} from "@mui/material";
import PriorityList, { PriorityItem } from "@/components/PriorityList";
import { fetchPriorityNotifications } from "@/lib/api";

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

      <PriorityList items={visibleItems} />
    </Container>
  );
}
