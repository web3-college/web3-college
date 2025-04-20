import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { Web3Provider } from "@/providers/Web3Provider";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";


export const metadata: Metadata = {
  title: "Web3 College",
  description: "Learn about Web3 and blockchain technology",
  icons: {
    icon: "/icon.jpeg",
  },
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider>
          <Web3Provider locale={locale}>
            {children}
            <Toaster richColors />
          </Web3Provider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
