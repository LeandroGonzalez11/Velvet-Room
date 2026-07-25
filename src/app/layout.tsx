import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Velvet Room | Boutique íntima", template: "%s | Velvet Room" },
  description: "Una selección íntima, elegante y discreta.",
  metadataBase: new URL("https://velvetroom.uy"),
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}
