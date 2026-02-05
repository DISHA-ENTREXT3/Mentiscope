import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mentiscope - Understanding Learning Beyond Grades",
  description: "AI-powered platform that helps parents understand their child's learning, habits, and well-being—so they can support growth before problems appear.",
  icons: {
    icon: "/mentiscope-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Mentiscope',
    url: 'https://mentiscope.vercel.app',
    logo: 'https://mentiscope.vercel.app/mentiscope-logo.png',
    description: 'Understanding learning beyond grades through AI-powered child development tracking.',
    sameAs: [
      'https://twitter.com/mentiscope',
      'https://linkedin.com/company/mentiscope'
    ]
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
