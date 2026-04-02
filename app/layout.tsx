import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";




const montserrat = Montserrat({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dakota",
  description: "Dakota",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable}  antialiased`}
      >
        {children}
        <Toaster
          position="top-right"
          richColors
          toastOptions={{
            classNames: {
              toast: "border border-black bg-white text-black shadow-[0_16px_40px_rgba(0,0,0,0.16)]",
              title: "text-black",
              description: "text-black/70",
              success: "border-orange-500",
              error: "border-black",
            },
          }}
        />
      </body>
    </html>
  );
}
