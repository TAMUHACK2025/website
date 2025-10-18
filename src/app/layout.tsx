import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "Spotify to Physical Media",
  description: "Transform your Spotify library into physical media - vinyl, CDs, and cassettes",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
