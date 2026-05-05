import type { Metadata } from "next";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import NavBar from "@/components/NavBar";

export const metadata: Metadata = {
  title: "Campus Notification Platform",
  description: "Notification dashboard for campus updates",
};

const theme = createTheme({
  palette: {
    primary: { main: "#123B8A" },
    success: { main: "#2E7D32" },
    info: { main: "#1976D2" },
    warning: { main: "#ED6C02" },
  },
});

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <NavBar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
