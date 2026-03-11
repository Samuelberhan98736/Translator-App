import type { Metadata } from "next";
import Script from "next/script";
import { Manrope } from "next/font/google";
import AuthSessionSync from "@/components/auth/AuthSessionSync";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import PageContainer from "@/components/layout/PageContainer";
import "../styles/globals.css";

const manrope = Manrope({ subsets: ["latin"] });

const themeInitScript = `
(function() {
  try {
    var key = 'translator-theme';
    var stored = localStorage.getItem(key);
    var dark = stored ? stored === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (dark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  } catch (e) {}
})();`;

export const metadata: Metadata = {
  title: "Translator App",
  description: "Resume translation and skill-gap analysis workspace"
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={manrope.className}>
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
        <AuthSessionSync />

        <div className="min-h-screen md:grid md:grid-cols-[270px_1fr]">
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
