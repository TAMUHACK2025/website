import type { Metadata } from "next";
import "../styles/globals.css";
import "../index.css"; // or "../styles/globals.css" depending on which you want to use
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
