import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import PageContainer from "@/components/layout/PageContainer";
import "../styles/globals.css";

const manrope = Manrope({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Educational Sandbox Lab",
  description: "Translator Agent MVP"
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={manrope.className}>
        <div className="min-h-screen md:grid md:grid-cols-[240px_1fr]">
          <Sidebar />
          <div className="grid min-h-screen grid-rows-[auto_1fr]">
            <Navbar />
            <PageContainer>{children}</PageContainer>
          </div>
        </div>
      </body>
    </html>
  );
}
