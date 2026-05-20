import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "nou ae",
  description: "개인 운영 시스템"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
