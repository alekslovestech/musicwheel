import { geistSans, geistMono } from "@/lib/design";
import { baseMetadata, viewport } from "@/lib/metadata";
import "./globals.css";
import { AnalyticsProvider } from "@/lib/tracking/AnalyticsProvider";

export { viewport };
export const metadata = baseMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AnalyticsProvider>{children}</AnalyticsProvider>
      </body>
    </html>
  );
}
