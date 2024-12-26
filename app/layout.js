import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Henry-hub-ID-verify",
  description: "Seamless Institution Experience: Identity, Payments, and Access",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="max-w-screen-2xl mx-auto">
          <Providers>{children}</Providers>
        </div>
      </body>
    </html>
  );
}
