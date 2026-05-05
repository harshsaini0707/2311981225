import type { Metadata } from "next";
import NavBar from "@/components/NavBar";
import ThemeRegistry from "@/components/ThemeRegistry";

export const metadata: Metadata = {
  title: "Campus Notification Platform",
  description: "Notification dashboard for campus updates",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          <NavBar />
          {children}
        </ThemeRegistry>
      </body>
    </html>
  );
}
