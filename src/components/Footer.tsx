import Link from "next/link";
import Logo from "@/components/Logo";
import { getSiteSettings } from "@/lib/settings";

export default async function Footer() {
  const s = await getSiteSettings();

  return (
    <footer className="bg-brand-darker text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-4 text-sm leading-relaxed text-white/80">
            {s.company_name_th}
            <br />
            {s.company_name_en}
          </p>
          <p className="mt-3 text-xs text-white/60">
            ผู้นำเข้าและจำหน่ายมอเตอร์ไฟฟ้าอุตสาหกรรม สินค้าคุณภาพ มีสต๊อคพร้อมส่ง
            บริการหลังการขายตลอดอายุการใช้งาน โดยทีมงานผู้เชี่ยวชาญกว่า 20 ปี
          </p>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-white">เมนู</h3>
          <ul className="space-y-2 text-sm text-white/75">
            <li><Link href="/products" className="hover:text-white">สินค้าทั้งหมด</Link></li>
            <li><Link href="/catalog" className="hover:text-white">แค็ตตาล็อก</Link></li>
            <li><Link href="/articles" className="hover:text-white">บทความ</Link></li>
            <li><Link href="/about" className="hover:text-white">เกี่ยวกับเรา</Link></li>
            <li><Link href="/contact" className="hover:text-white">ติดต่อเรา</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-white">กลุ่มสินค้า</h3>
          <ul className="space-y-2 text-sm text-white/75">
            <li>Induction Motor</li>
            <li>Gear Motor</li>
            <li>Inverter</li>
            <li>Brake</li>
            <li>Water Pump &amp; Resistor</li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-white">ติดต่อเรา</h3>
          <ul className="space-y-2 text-sm text-white/75">
            <li>{s.address_th}</li>
            <li>โทร: {s.phone}</li>
            <li>มือถือ: {s.mobile}</li>
            <li>อีเมล: {s.email}</li>
            <li>Line ID: {s.line_id}</li>
            <li>Facebook: {s.facebook}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">
        © {new Date().getFullYear()} {s.company_name_en} — สงวนลิขสิทธิ์ทุกประการ
      </div>
    </footer>
  );
}
