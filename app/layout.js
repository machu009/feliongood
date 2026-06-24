// app/layout.js
import "./globals.css";

export const metadata = {
  title: "Granger Lancers",
  description: "Granger Lancers baseball team management",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
