import type { Metadata } from "next";
import "./globals.css";
import '@rainbow-me/rainbowkit/styles.css';
import { Toaster } from "sonner";
import { Web3Provider } from "@/providers/Web3Provider";
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
        <Web3Provider>
          {children}
          <Toaster richColors />
        </Web3Provider>
      </body>
    </html>
  );
}
