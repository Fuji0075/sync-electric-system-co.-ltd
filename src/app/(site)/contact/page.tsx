import { getSiteSettings } from "@/lib/settings";
import ContactForm from "@/components/ContactForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "ติดต่อเรา" };

export default async function ContactPage() {
  const s = await getSiteSettings();

  const infoItems = [
    {
      icon: "📍",
      label: "ที่อยู่",
      content: (
        <>
          <div className="mt-0.5 text-neutral-600">{s.address_th}</div>
          <div className="text-xs text-neutral-400">{s.address_en}</div>
        </>
      ),
    },
    {
      icon: "📞",
      label: "โทรศัพท์",
      content: (
        <>
          <div className="mt-0.5 text-neutral-600">{s.phone}</div>
          <div className="text-neutral-600">มือถือ: {s.mobile}</div>
        </>
      ),
    },
    {
      icon: "✉️",
      label: "อีเมล",
      content: (
        <a href={`mailto:${s.email}`} className="mt-0.5 block font-medium text-brand-dark hover:underline">
          {s.email}
        </a>
      ),
    },
    {
      icon: "💬",
      label: "Line / Facebook",
      content: (
        <>
          <div className="mt-0.5 text-neutral-600">Line: {s.line_id}</div>
          <div className="text-neutral-600">Facebook: {s.facebook}</div>
        </>
      ),
    },
  ];

  return (
    <div>
      <div className="bg-gradient-to-br from-brand-darker via-brand to-accent py-16 text-white">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
          <span className="text-xs font-bold uppercase tracking-widest text-white/70">Get in touch</span>
          <h1 className="mt-2 text-2xl font-extrabold sm:text-3xl">ติดต่อเรา</h1>
          <p className="mt-3 text-sm text-white/85 sm:text-base">
            สอบถามสินค้า ขอใบเสนอราคา หรือปรึกษาการเลือกอุปกรณ์ ทีมงานพร้อมให้บริการ
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <div className="grid gap-4 sm:grid-cols-2">
              {infoItems.map((item) => (
                <div key={item.label} className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-brand/10 text-lg">
                    {item.icon}
                  </span>
                  <div className="mt-3 text-sm">
                    <div className="font-semibold text-neutral-900">{item.label}</div>
                    {item.content}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 aspect-video overflow-hidden rounded-2xl border border-neutral-200">
              <iframe
                title="แผนที่บริษัท"
                className="h-full w-full"
                loading="lazy"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(
                  s.address_th
                )}&output=embed`}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 font-bold text-neutral-900">ส่งข้อความถึงเรา</h2>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
