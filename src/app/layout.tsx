import { geistSans, geistMono } from "@/lib/design";
import { baseMetadata, viewport } from "@/lib/metadata";
import "./globals.css";
import { RootProvider } from "@/contexts/RootContext";
import { AudioPlayer } from "@/components/AudioPlayer";

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
        <RootProvider>
          {children}
          <AudioPlayer />
        </RootProvider>
      </body>
    </html>
  );
}
