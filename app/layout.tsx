import type { Metadata } from "next";
import { Fraunces, Instrument_Sans } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz"],
  display: "swap",
});

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    template: "%s | GradEdge Academic Solutions",
    default: "GradEdge Academic Solutions | Graduate Research Coaching & Mentoring",
  },
  description:
    "Rigorous, ethical academic coaching, dissertation mentoring, research design, and data analysis support for postgraduate researchers worldwide.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${instrumentSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-paper text-tone-body font-sans">
        {children}
      </body>
    </html>
  );
}
