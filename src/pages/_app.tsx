import { type AppType } from "next/app";
import { Inter } from "next/font/google";
import { WalletContextProvider } from "@/hooks/WalletContext";

import "@/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <main className={`font-sans ${inter.variable}`}>
      <WalletContextProvider>
        <Component {...pageProps} />
      </WalletContextProvider>
    </main>
  );
};

export default MyApp;
