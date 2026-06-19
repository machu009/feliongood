import { Bebas_Neue, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const display = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

export const metadata = {
  title: "Felion Good Baseball",
  description: "Sign-ups, camps, and lessons with Coach Felion.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${display.variable} ${body.variable} ${mono.variable} font-body bg-chalk text-ink antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
