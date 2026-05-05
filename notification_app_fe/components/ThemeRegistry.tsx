"use client";

import { PropsWithChildren } from "react";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: { main: "#123B8A" },
    success: { main: "#2E7D32" },
    info: { main: "#1976D2" },
    warning: { main: "#ED6C02" },
  },
});

export default function ThemeRegistry({ children }: PropsWithChildren) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
