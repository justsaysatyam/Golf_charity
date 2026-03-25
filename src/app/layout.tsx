import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth/provider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "GolfCharity - Play Golf, Win Prizes, Make a Difference",
  description:
    "A subscription-based golf platform where you enter scores, participate in monthly prize draws, and contribute to meaningful charities. Join the community today!",
  keywords: ["golf", "charity", "subscription", "prize draw", "sports"],
  openGraph: {
    title: "GolfCharity - Play Golf, Win Prizes, Make a Difference",
    description:
      "Enter your golf scores, win monthly prizes, and support charities you love.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
