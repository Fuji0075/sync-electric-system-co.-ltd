import { getSiteSettings } from "@/lib/settings";
import ContactForm from "@/components/ContactForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "ติดต่อเรา" };

export default async function ContactPage() {
  const s = await getSiteSettings();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <h1 className="mb-8 text-2xl font-bold text-neutral-900">ติดต่อเรา</h1>

      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <div className="space-y-4 text-sm text-neutral-700">
            <div className="flex gap-3">
              <span className="text-xl">📍</span>
              <div>
                <div className="font-semibold text-neutral-900">ที่อยู่</div>
                <div className="mt-0.5 text-neutral-600">{s.address_th}</div>
                <div className="text-xs text-neutral-400">{s.address_en}</div>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-xl">📞</span>
              <div>
                <div className="font-semibold text-neutral-900">โทรศัพท์</div>
                <div className="mt-0.5 text-neutral-600">{s.phone}</div>
                <div className="text-neutral-600">มือถือ: {s.mobile}</div>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-xl">✉️</span>
              <div>
                <div className="font-semibold text-neutral-900">อีเมล</div>
                <a href={`mailto:${s.email}`} className="mt-0.5 block text-brand-dark hover:underline">
                  {s.email}
                </a>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-xl">💬</span>
              <div>
                <div className="font-semibold text-neutral-900">Line / Facebook</div>
                <div className="mt-0.5 text-neutral-600">Line: {s.line_id}</div>
                <div className="text-neutral-600">Facebook: {s.facebook}</div>
              </div>
            </div>
          </div>

          <div className="mt-8 aspect-video overflow-hidden rounded-2xl border border-neutral-200">
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
          <h2 className="mb-4 font-semibold text-neutral-900">ส่งข้อความถึงเรา</h2>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
