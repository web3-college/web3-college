import type { Metadata } from "next";
import { RainbowProvider } from "@/providers/rainbow-provider";
import "./globals.css";
import '@rainbow-me/rainbowkit/styles.css';
import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  title: "Web3 College",
  description: "Learn about Web3 and blockchain technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <RainbowProvider>
          <Navbar />
          <main>
            {children}
          </main>
        </RainbowProvider>
      </body>
    </html>
  );
}
