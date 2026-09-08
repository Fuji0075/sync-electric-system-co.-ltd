import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { resolveSqliteUrl } from "../src/lib/db-path";
import bcrypt from "bcryptjs";

const adapter = new PrismaBetterSqlite3({
  url: resolveSqliteUrl(process.env.DATABASE_URL),
});
const prisma = new PrismaClient({ adapter });

const categoryGroups = [
  { name: "มอเตอร์และเกียร์", slug: "motors-gears", order: 0 },
  { name: "ระบบควบคุมและอุปกรณ์", slug: "control-accessories", order: 1 },
  { name: "ปั๊มน้ำ", slug: "pumps", order: 2 },
];

const categories = [
  { name: "มอเตอร์ไฟฟ้า (Induction Motor)", slug: "induction-motor", groupSlug: "motors-gears" },
  { name: "มอเตอร์เกียร์ (Gear Motor)", slug: "gear-motor", groupSlug: "motors-gears" },
  { name: "อินเวอร์เตอร์ (Inverter)", slug: "inverter", groupSlug: "control-accessories" },
  { name: "เบรก (Brake)", slug: "brake", groupSlug: "control-accessories" },
  { name: "ปั๊มน้ำ (Water Pump)", slug: "water-pump", groupSlug: "pumps" },
  { name: "ตัวต้านทาน (Resistor)", slug: "resistor", groupSlug: "control-accessories" },
];

const productsByCategory: Record<
  string,
  { name: string; summary: string; price: number }[]
> = {
  "induction-motor": [
    {
      name: "Induction Motor 3 Phase",
      summary: "มอเตอร์ไฟฟ้าเหนี่ยวนำ 3 เฟส ทนทาน ใช้งานในอุตสาหกรรมหนัก",
      price: 4500,
    },
    {
      name: "Induction Motor 1 Phase",
      summary: "มอเตอร์ไฟฟ้าเหนี่ยวนำ 1 เฟส เหมาะกับงานขนาดเล็กถึงกลาง",
      price: 3200,
    },
  ],
  "gear-motor": [
    {
      name: "Helical Gear Motor",
      summary: "มอเตอร์เกียร์เฮลิคอล ส่งกำลังเรียบ เสียงเงียบ ประสิทธิภาพสูง",
      price: 5490,
    },
    {
      name: "Cyclo Drive Gear",
      summary: "เกียร์ทดรอบ Cyclo Drive รับแรงบิดสูง เหมาะกับงานหนัก",
      price: 8900,
    },
    {
      name: "Planetary Gear",
      summary: "เกียร์ดาวเคราะห์ ขนาดกะทัดรัด อัตราทดสูง แม่นยำ",
      price: 6750,
    },
    {
      name: "Worm Gear Box",
      summary: "เกียร์บ็อกซ์เวิร์ม โครงสร้างแข็งแรง ราคาคุ้มค่า",
      price: 3900,
    },
  ],
  inverter: [
    {
      name: "Inverter VFD",
      summary: "อินเวอร์เตอร์ควบคุมความเร็วรอบมอเตอร์ ประหยัดพลังงาน",
      price: 4200,
    },
  ],
  brake: [
    {
      name: "Electromagnetic Brake",
      summary: "เบรกไฟฟ้าสำหรับมอเตอร์ หยุดแม่นยำ ปลอดภัยสูง",
      price: 2800,
    },
  ],
  "water-pump": [
    {
      name: "Industrial Water Pump",
      summary: "ปั๊มน้ำสำหรับงานอุตสาหกรรม ทนทาน แรงดันสูง",
      price: 7300,
    },
  ],
  resistor: [
    {
      name: "Braking Resistor",
      summary: "ตัวต้านทานเบรกสำหรับระบบขับเคลื่อนมอเตอร์และอินเวอร์เตอร์",
      price: 1500,
    },
  ],
};

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function main() {
  // Admin user
  const passwordHash = await bcrypt.hash("SyncAdmin@2026", 10);
  await prisma.adminUser.upsert({
    where: { email: "admin@sync-electric.com" },
    update: { role: "super_admin" },
    create: {
      email: "admin@sync-electric.com",
      passwordHash,
      name: "Sync Electric Admin",
      role: "super_admin",
    },
  });

  // Category groups
  const groupsBySlug = new Map<string, string>();
  for (const g of categoryGroups) {
    const group = await prisma.categoryGroup.upsert({
      where: { slug: g.slug },
      update: { name: g.name, order: g.order },
      create: { name: g.name, slug: g.slug, order: g.order },
    });
    groupsBySlug.set(g.slug, group.id);
  }

  // Categories + products
  for (const cat of categories) {
    const groupId = groupsBySlug.get(cat.groupSlug) ?? null;
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, groupId },
      create: { name: cat.name, slug: cat.slug, groupId },
    });

    const products = productsByCategory[cat.slug] ?? [];
    for (const p of products) {
      const slug = slugify(`${cat.slug}-${p.name}`);
      await prisma.product.upsert({
        where: { slug },
        update: { price: p.price },
        create: {
          name: p.name,
          slug,
          summary: p.summary,
          description: `${p.summary}\n\nสินค้าคุณภาพมาตรฐาน มีสต๊อคพร้อมส่ง พร้อมบริการหลังการขายตลอดอายุการใช้งาน โดยทีมงานผู้เชี่ยวชาญด้านสินค้าอุตสาหกรรมกว่า 20 ปี สอบถามข้อมูลเพิ่มเติมหรือขอใบเสนอราคาได้ที่ทีมขาย Sync Electric System`,
          categoryId: category.id,
          price: p.price,
          featured: true,
        },
      });
    }
  }

  // Banners
  const banners = [
    {
      title: "ผู้นำเข้าและจำหน่ายมอเตอร์ไฟฟ้าอุตสาหกรรม",
      subtitle: "Induction Motor, Gear Motor, Inverter, Brake และอุปกรณ์อุตสาหกรรมครบวงจร",
      imageUrl: "/banners/banner-1.svg",
      order: 1,
    },
    {
      title: "สินค้าคุณภาพ มีสต๊อคพร้อมส่ง",
      subtitle: "บริการหลังการขายตลอดอายุการใช้งาน โดยทีมงานผู้เชี่ยวชาญกว่า 20 ปี",
      imageUrl: "/banners/banner-2.svg",
      order: 2,
    },
    {
      title: "ปรึกษาและขอใบเสนอราคาฟรี",
      subtitle: "ทีมงานพร้อมให้คำแนะนำด้านเทคนิคและเลือกสินค้าที่เหมาะกับงานของคุณ",
      imageUrl: "/banners/banner-3.svg",
      order: 3,
    },
  ];
  for (const b of banners) {
    const existing = await prisma.banner.findFirst({ where: { title: b.title } });
    if (!existing) {
      await prisma.banner.create({ data: b });
    }
  }

  // Catalog files
  const catalogFiles = [
    {
      title: "Helical Gear Motor Catalogue",
      fileUrl: "/catalogs/helical-gear-motor-catalogue.pdf",
      coverImage: "/catalogs/covers/helical-gear-motor-catalogue.jpg",
      order: 1,
    },
    {
      title: "Worm Gear Reducer Catalogue",
      fileUrl: "/catalogs/worm-gear-reducer-catalogue.pdf",
      coverImage: "/catalogs/covers/worm-gear-reducer-catalogue.jpg",
      order: 2,
    },
    {
      title: "Cyclo Drive Catalogue",
      fileUrl: "/catalogs/cyclo-drive-catalogue.pdf",
      coverImage: "/catalogs/covers/cyclo-drive-catalogue.jpg",
      order: 3,
    },
    {
      title: "Aluminium Worm Gear Catalogue",
      fileUrl: "/catalogs/aluminium-worm-gear-catalogue.pdf",
      coverImage: "/catalogs/covers/aluminium-worm-gear-catalogue.jpg",
      order: 4,
    },
    {
      title: "FAG Induction Motor Catalogue",
      fileUrl: "/catalogs/fag-induction-motor-catalogue.pdf",
      coverImage: "/catalogs/covers/fag-induction-motor-catalogue.jpg",
      order: 5,
    },
  ];
  for (const c of catalogFiles) {
    const existing = await prisma.catalogFile.findFirst({ where: { title: c.title } });
    if (existing) {
      await prisma.catalogFile.update({ where: { id: existing.id }, data: c });
    } else {
      await prisma.catalogFile.create({ data: c });
    }
  }

  // Articles
  const articles = [
    {
      title: "วิธีเลือกมอเตอร์ไฟฟ้าให้เหมาะกับงานอุตสาหกรรม",
      slug: "how-to-choose-induction-motor",
      excerpt: "แนวทางการเลือกมอเตอร์ไฟฟ้าเหนี่ยวนำให้เหมาะกับโหลดและลักษณะงานของโรงงาน",
      content:
        "การเลือกมอเตอร์ไฟฟ้าที่เหมาะสมกับงานอุตสาหกรรมควรพิจารณาหลายปัจจัย เช่น กำลังไฟฟ้า (kW/HP), ความเร็วรอบ, แรงบิด, สภาพแวดล้อมการใช้งาน และมาตรฐานความปลอดภัย ทีมงาน Sync Electric System พร้อมให้คำปรึกษาเพื่อเลือกมอเตอร์ที่เหมาะสมที่สุดกับหน้างานของคุณ",
    },
    {
      title: "ความแตกต่างระหว่างเกียร์มอเตอร์แต่ละประเภท",
      slug: "gear-motor-types-comparison",
      excerpt: "เปรียบเทียบ Helical Gear, Cyclo Drive, Planetary Gear และ Worm Gear",
      content:
        "เกียร์มอเตอร์แต่ละประเภทมีจุดเด่นต่างกัน Helical Gear ให้ประสิทธิภาพสูงและเสียงเงียบ Cyclo Drive รับแรงบิดสูงเหมาะกับงานหนัก Planetary Gear มีขนาดกะทัดรัดและแม่นยำ ส่วน Worm Gear มีโครงสร้างแข็งแรงและราคาคุ้มค่า การเลือกใช้ขึ้นอยู่กับลักษณะงานและงบประมาณ",
    },
  ];
  for (const a of articles) {
    await prisma.article.upsert({
      where: { slug: a.slug },
      update: {},
      create: a,
    });
  }

  // Site settings
  const settings = [
    { key: "company_name_th", value: "บริษัท ซิงค์ อิเล็คทริค ซิสเต็ม จำกัด" },
    { key: "company_name_en", value: "Sync Electric System Co., Ltd." },
    {
      key: "address_th",
      value: "23/49 หมู่ 5 ถ.พุทธรักษา ต.แพรกษาใหม่ อ.เมืองสมุทรปราการ จ.สมุทรปราการ 10280",
    },
    {
      key: "address_en",
      value: "23/49 Moo. 5 Phuttaraksa Rd., T.Phraeksamai, A.MuangSamutprakarn, Samutprakarn, 10280 Thailand.",
    },
    { key: "phone", value: "02-3474318-9, 02-3474173-4" },
    { key: "fax", value: "02-7037325" },
    { key: "mobile", value: "081-573-4588" },
    { key: "email", value: "sales03@sync-electric.com" },
    { key: "line_id", value: "@sync" },
    { key: "facebook", value: "SYNC Electric System" },
    { key: "sales_email", value: "sales03@sync-electric.com" },
  ];
  for (const s of settings) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    });
  }

  console.log("Seed complete. Admin login: admin@sync-electric.com / SyncAdmin@2026");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
