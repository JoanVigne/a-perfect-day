import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./css/lists.css";
import "./css/form.css";

import { AuthContextProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "A perfect day",
  description: `"The real courage is not to do what you want, but to do what you ought to do, even when you don't want to do it" - Winston Churchill. "Es handelt sich nicht darum, zu wollen oder nicht zu wollen, sondern zu müssen" - Friedrich Nietzsche. "Fais ce que tu dois et advienne que pourra." `,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthContextProvider>{children}</AuthContextProvider>
      </body>
    </html>
  );
}
