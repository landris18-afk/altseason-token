import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { MuteProvider } from '@/games/components/context/MuteContext';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Altseason Token",
  description: "The next generation of meme tokens",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MuteProvider>
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
          <ScrollToTop />
        </MuteProvider>
      </body>
    </html>
  );
}
