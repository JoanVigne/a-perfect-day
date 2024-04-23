import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import "@/css/lists.css";
import "@/css/form.css";
import "@/css/animation.css";
import "@/css/modal.css";
import "@/css/stats.css";
import "@/css/calendar.css";
import "@/css/improve.css";
import { AuthContextProvider } from "@/context/AuthContext";
import Head from "next/head";

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
      <Head>
        <title>{metadata.title as string}</title>
        <meta name="description" content={metadata.description as string} />
        <link rel="icon" href="/path/to/your/favicon.ico" />
        <meta property="og:title" content={metadata.title as string} />
        <meta
          property="og:description"
          content={metadata.description as string}
        />
        <meta property="og:image" content="/path/to/your/preview-image.jpg" />
        <meta property="og:url" content="https://your-website.com" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <body className={inter.className}>
        <AuthContextProvider>{children}</AuthContextProvider>
      </body>
    </html>
  );
}
