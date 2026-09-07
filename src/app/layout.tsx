import type { Metadata } from "next";
import { Noto_Sans_Thai } from "next/font/google";
import "./globals.css";

const notoSansThai = Noto_Sans_Thai({
  variable: "--font-noto-thai",
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "Sync Electric System | ผู้นำเข้าและจำหน่ายมอเตอร์ไฟฟ้าอุตสาหกรรม",
    template: "%s | Sync Electric System",
  },
  description:
    "บริษัท ซิงค์ อิเล็คทริค ซิสเต็ม จำกัด ผู้นำเข้าและจำหน่าย Induction Motor, Gear Motor, Inverter, Brake, Water Pump, Resistor สินค้าคุณภาพ มีสต๊อคพร้อมส่ง บริการหลังการขายตลอดอายุการใช้งาน",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="th" className={`${notoSansThai.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-foreground">
        {children}
      </body>
    </html>
  );
}
