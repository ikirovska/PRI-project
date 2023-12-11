import "~/styles/globals.css";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import { TRPCReactProvider } from "~/trpc/react";
import Footer from "./_components/Footer";
import Header from "./_components/Header";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "European university search engine",
  description: "A European university search engine",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable}`}>
        <Header />

        <TRPCReactProvider cookies={cookies().toString()}>
          {children}
        </TRPCReactProvider>

        <Footer />
      </body>
    </html>
  );
}
