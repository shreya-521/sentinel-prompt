import type { Metadata } from "next";
import { Inter, Rajdhani } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700"],
});

const rajdhani = Rajdhani({
  subsets: ["latin"],
  variable: "--font-rajdhani",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "SentinelPrompt — AI Security Guardian",
  description:
    "Real-time AI-powered security scanner that detects vulnerabilities in AI-generated code. Powered by Gemini Flash.",
  keywords: [
    "AI security",
    "code scanner",
    "vulnerability detection",
    "OWASP",
    "Gemini AI",
    "cybersecurity",
  ],
  authors: [{ name: "SentinelPrompt" }],
  openGraph: {
    title: "SentinelPrompt — AI Security Guardian",
    description:
      "Scan AI-generated code for vulnerabilities instantly. Powered by Gemini Flash.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${rajdhani.variable}`}>
      <body className="font-inter antialiased">{children}</body>
    </html>
  );
}
