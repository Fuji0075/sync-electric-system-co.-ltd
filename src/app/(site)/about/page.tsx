import { getSiteSettings } from "@/lib/settings";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "เกี่ยวกับเรา" };

const VALUES = [
  { icon: "🏆", title: "คุณภาพมาตรฐาน", desc: "คัดสรรสินค้าที่ได้มาตรฐาน มีคุณภาพเชื่อถือได้" },
  { icon: "📦", title: "มีสต๊อคพร้อมส่ง", desc: "สินค้าหลากหลายพร้อมจัดส่งให้ทันเวลาที่คุณต้องการ" },
  { icon: "🛠️", title: "บริการหลังการขาย", desc: "ดูแลลูกค้าตลอดอายุการใช้งานของสินค้า" },
  { icon: "👨‍🔧", title: "ทีมงานผู้เชี่ยวชาญ", desc: "ประสบการณ์ด้านสินค้าอุตสาหกรรมกว่า 20 ปี" },
];

export default async function AboutPage() {
  const s = await getSiteSettings();

  return (
    <div>
      <div className="bg-gradient-to-br from-brand-darker via-brand to-accent py-16 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h1 className="text-2xl font-extrabold sm:text-3xl">เกี่ยวกับเรา</h1>
          <p className="mt-3 text-sm text-white/85 sm:text-base">
            {s.company_name_th} ({s.company_name_en})
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <p className="text-base leading-relaxed text-neutral-700">
          {s.company_name_th} เป็นผู้นำเข้าและจำหน่ายมอเตอร์ไฟฟ้าเหนี่ยวนำ (Induction Motor),
          มอเตอร์เกียร์ (Helical Gear, Cyclo Drive Gear, Gear Box, Planetary Gear, Worm Gear),
          อินเวอร์เตอร์ (Inverter), เบรก (Brake), ปั๊มน้ำ (Water Pump), ตัวต้านทาน (Resistor)
          และอุปกรณ์อุตสาหกรรมอื่นๆ อีกมากมาย สินค้าของเรามีคุณภาพ ได้มาตรฐาน มีสต๊อคพร้อมส่ง
          และมีบริการหลังการขายตลอดอายุการใช้งาน โดยทีมงานที่เชี่ยวชาญด้านสินค้าอุตสาหกรรมมากว่า
          20 ปี พร้อมให้คำปรึกษาและเลือกสินค้าที่เหมาะสมกับหน้างานของคุณ
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {VALUES.map((v) => (
            <div
              key={v.title}
              className="flex gap-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm"
            >
              <span className="text-3xl">{v.icon}</span>
              <div>
                <h3 className="font-semibold text-neutral-900">{v.title}</h3>
                <p className="mt-1 text-sm text-neutral-500">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl bg-neutral-50 p-6">
          <h2 className="mb-3 font-semibold text-neutral-900">ข้อมูลติดต่อ</h2>
          <ul className="space-y-1.5 text-sm text-neutral-600">
            <li>📍 {s.address_th}</li>
            <li>📞 {s.phone} / {s.mobile}</li>
            <li>✉️ {s.email}</li>
            <li>💬 Line: {s.line_id}</li>
            <li>📘 Facebook: {s.facebook}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
