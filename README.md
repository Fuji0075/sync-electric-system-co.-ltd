# Sync Electric System — เว็บไซต์ใหม่

เว็บไซต์บริษัทและ Admin Console สำหรับ **บริษัท ซิงค์ อิเล็คทริค ซิสเต็ม จำกัด**
สร้างใหม่ทั้งหมดด้วย Next.js (แทนที่ระบบ WordPress เดิม)

## สแตกเทคโนโลยี

- **Next.js 16** (App Router, Server Actions)
- **Tailwind CSS 4**
- **Prisma 7** + SQLite (`dev.db`) — เปลี่ยนไปใช้ PostgreSQL ได้ง่ายตอน deploy จริงโดยแก้ `datasource` ใน `prisma/schema.prisma`
- Auth แบบ JWT cookie สำหรับ Admin Console (ไม่ได้ใช้ WordPress admin เดิม)

## เริ่มต้นใช้งาน

```bash
npm install
npx prisma generate
npx prisma migrate dev   # สร้างฐานข้อมูล + ตาราง
npm run seed              # ใส่ข้อมูลตัวอย่าง (หมวดหมู่, สินค้า, แบนเนอร์, ผู้ดูแลระบบ)
npm run dev
```

เปิด http://localhost:3000 สำหรับหน้าเว็บไซต์
เปิด http://localhost:3000/admin/login สำหรับ Admin Console

**บัญชี Admin เริ่มต้น** (สร้างจาก `npm run seed`):

- อีเมล: `admin@sync-electric.com`
- รหัสผ่าน: `SyncAdmin@2026`

> ⚠️ เปลี่ยนรหัสผ่านนี้ทันทีก่อนใช้งานจริง (แก้ไขได้ผ่าน seed script หรือ query ฐานข้อมูลโดยตรง)

## โครงสร้างหลัก

- `src/app/(site)/` — หน้าเว็บไซต์สาธารณะ (หน้าแรก, สินค้า, บทความ, แค็ตตาล็อก, เกี่ยวกับเรา, ติดต่อเรา)
- `src/app/admin/(auth)/` — หน้าล็อกอิน admin
- `src/app/admin/(dashboard)/` — Admin Console (จัดการแบนเนอร์, หมวดหมู่, สินค้า, บทความ, แค็ตตาล็อก, ข้อความติดต่อ, ตั้งค่าเว็บไซต์)
- `prisma/schema.prisma` — โครงสร้างฐานข้อมูล
- `prisma/seed.ts` — ข้อมูลตัวอย่าง/เริ่มต้น

## หมายเหตุเรื่อง Hosting

hosting เดิม (DirectAdmin, PHP + MySQL, FTP) ไม่รองรับ Node.js server ของ Next.js
เมื่อพร้อม deploy จริงต้องใช้ hosting ที่รองรับ Node.js (เช่น VPS, Vercel, Railway) หรือปรับ Prisma ให้ต่อกับฐานข้อมูล PostgreSQL ที่ hosting ใหม่รองรับ
