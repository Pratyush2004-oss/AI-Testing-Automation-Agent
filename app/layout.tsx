import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import type { Metadata } from "next";
import Provider from "./provider";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "AI Testing Automation Agent",
  description: "AI-powered test generation, execution, and workspace management for modern QA teams.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body suppressHydrationWarning style={{ margin: 0, padding: 0 }} className="bg-background text-foreground">
        <ClerkProvider>
          <Provider>
            {children}
          </Provider>
          <Toaster />
        </ClerkProvider>
      </body>
    </html>
  );
}
