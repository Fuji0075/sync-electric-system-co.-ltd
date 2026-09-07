import { prisma } from "@/lib/prisma";

export type SiteSettings = Record<string, string>;

const DEFAULTS: SiteSettings = {
  company_name_th: "บริษัท ซิงค์ อิเล็คทริค ซิสเต็ม จำกัด",
  company_name_en: "Sync Electric System Co., Ltd.",
  address_th:
    "23/49 หมู่ 5 ถ.พุทธรักษา ต.แพรกษาใหม่ อ.เมืองสมุทรปราการ จ.สมุทรปราการ 10280",
  address_en:
    "23/49 Moo. 5 Phuttaraksa Rd., T.Phraeksamai, A.MuangSamutprakarn, Samutprakarn, 10280 Thailand.",
  phone: "02-3474318-9, 02-3474173-4",
  fax: "02-7037325",
  mobile: "081-573-4588",
  email: "sales03@sync-electric.com",
  line_id: "@sync",
  facebook: "SYNC Electric System",
  sales_email: "sales03@sync-electric.com",
};

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const rows = await prisma.siteSetting.findMany();
    const map: SiteSettings = { ...DEFAULTS };
    for (const r of rows) map[r.key] = r.value;
    return map;
  } catch {
    return DEFAULTS;
  }
}
