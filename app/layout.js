import { ThemeProvider } from "@/context/ThemeContext";
import "@fontsource/inter/index.css";
import "./globals.css";

export const metadata = {
  title: "Enma Nexus",
  description: "Anime & Manga Hub",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}