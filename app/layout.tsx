import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { AuthProvider } from "@/components/auth/auth-provider";
import { AppShell } from "@/components/layout/app-shell";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-be-vietnam-pro",
});

export const metadata: Metadata = {
  title: "Học tiếng Hàn EPS",
  description:
    "Luyện nghe và trả lời câu hỏi phỏng vấn tiếng Hàn cho lao động EPS.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi" className={beVietnamPro.variable} suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <AuthProvider>
            <AppShell>{children}</AppShell>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
