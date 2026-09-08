import { prisma } from "@/lib/prisma";
import { encodeQuoteButtons } from "@/lib/chat-message";

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  summary: string;
  description: string;
  brand: string | null;
  sku: string | null;
  price: number | null;
  inStock: boolean;
  category: { name: string };
};

const GREETING_WORDS = ["สวัสดี", "หวัดดี", "hello", "hi"];
const COMPARE_WORDS = ["เปรียบเทียบ", "ต่างกัน", "แตกต่าง", "vs", "compare"];
const CONTACT_WORDS = ["ราคา", "เสนอราคา", "quotation", "quote", "สั่งซื้อ", "ติดต่อ"];
const SPEC_WORDS = ["สเปค", "สเปก", "spec", "specification", "คุณสมบัติ"];
const PRODUCT_WORDS = ["สินค้า", "product", "รุ่น", "อุปกรณ์"];
const GENERAL_INTENT_WORDS = [...COMPARE_WORDS, ...CONTACT_WORDS, ...SPEC_WORDS, ...PRODUCT_WORDS];

function normalize(text: string) {
  return text.toLowerCase().trim();
}

function scoreProduct(product: ProductRow, query: string) {
  const haystacks = [
    product.name,
    product.summary,
    product.description,
    product.category.name,
    product.brand ?? "",
    product.sku ?? "",
  ].map((s) => s.toLowerCase());

  let score = 0;

  // Direction 1: query word appears inside a product field. Works well when
  // the query itself is space-separated (English, or mixed Thai/English).
  const queryWords = query.split(/\s+/).filter((w) => w.length >= 2);
  for (const word of queryWords) {
    for (const h of haystacks) {
      if (h.includes(word)) score += 1;
    }
  }

  // Direction 2: a keyword pulled from the product (name/category words,
  // brand, sku) appears inside the raw query. Thai is written without
  // spaces between words, so a whole-sentence query like "มีมอเตอร์ไฟฟ้ามั้ย"
  // never matches direction 1 above — but "มอเตอร์ไฟฟ้า" as a substring of
  // that same query does.
  const productKeywords = [
    ...product.name.split(/[\s()/,-]+/),
    ...product.category.name.split(/[\s()/,-]+/),
    product.brand ?? "",
    product.sku ?? "",
  ]
    .map((w) => w.toLowerCase().trim())
    .filter((w) => w.length >= 2);

  for (const keyword of productKeywords) {
    if (query.includes(keyword)) score += 2;
  }

  return score;
}

function formatProductBlock(p: ProductRow, index: number) {
  // Reads like a person typing on LINE: short lines, no bullet/indent
  // formatting, stock and brand/sku woven into a natural sentence instead
  // of a labeled spec sheet.
  let stockLine = p.inStock ? "มีสินค้าพร้อมส่งค่ะ" : "ต้องขอเช็คสต๊อคให้อีกทีนะคะ";
  if (p.brand) stockLine += ` (แบรนด์ ${p.brand})`;
  if (p.sku) stockLine += ` รหัส ${p.sku}`;

  return `${index}. ${p.name} — ${p.category.name}\n${p.summary} ${stockLine}`;
}

/**
 * Rule-based, zero-cost auto-responder grounded in the real product
 * database (no external LLM call). Swap the body of this function for a
 * real model call (e.g. the Anthropic API) later without touching any
 * caller — the function signature is the integration point.
 */
export async function generateAiReply(message: string): Promise<string | null> {
  const query = normalize(message);
  if (!query) return null;

  if (GREETING_WORDS.some((w) => query.includes(w))) {
    return "สวัสดีค่ะ 😊 มีสินค้ารุ่นไหนหรืออยากสอบถามอะไรบอกได้เลยนะคะ";
  }

  const products = await prisma.product.findMany({
    include: { category: true },
    take: 200,
  });

  const scored = products
    .map((p) => ({ product: p, score: scoreProduct(p, query) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);

  const wantsCompare = COMPARE_WORDS.some((w) => query.includes(w));
  const wantsContact = CONTACT_WORDS.some((w) => query.includes(w));
  const wantsGeneralInfo = GENERAL_INTENT_WORDS.some((w) => query.includes(w));

  if (scored.length === 0) {
    if (wantsGeneralInfo) {
      const categories = await prisma.category.findMany({ orderBy: { order: "asc" } });
      const categoryList = categories.map((c) => c.name).join(", ");
      return `รบกวนบอกชื่อสินค้าหรือรุ่นที่สนใจหน่อยได้ไหมคะ จะได้ดูสเปค/ราคาให้ตรงรุ่นเลยค่ะ ตอนนี้มีสินค้ากลุ่ม ${categoryList} พิมพ์ชื่อกลุ่มหรือรุ่นที่สนใจมาได้เลยค่ะ`;
    }
    return null;
  }

  if (wantsCompare && scored.length >= 2) {
    const [a, b] = scored;
    const compareButtons = encodeQuoteButtons([
      { slug: a.product.slug, name: a.product.name },
      { slug: b.product.slug, name: b.product.name },
    ]);
    const compareText = [
      "เทียบให้ดูเลยนะคะ 😊",
      "",
      formatProductBlock(a.product, 1),
      "",
      formatProductBlock(b.product, 2),
      "",
      "สนใจรุ่นไหนเป็นพิเศษไหมคะ หรือให้จัดใบเสนอราคามาให้ดูเลยก็ได้ค่ะ",
    ].join("\n");
    return compareText + compareButtons;
  }

  const top = scored.slice(0, 3);
  const lines = top.map((r, i) => formatProductBlock(r.product, i + 1));
  const buttons = encodeQuoteButtons(
    top.map((r) => ({ slug: r.product.slug, name: r.product.name }))
  );

  const intro = wantsContact ? "เจอสินค้าที่ถามค่ะ 😊" : "เจอสินค้าที่เกี่ยวข้องค่ะ 😊";
  const suffix = "สนใจรุ่นไหนแจ้งชื่อมาได้เลยค่ะ เดี๋ยวจัดใบเสนอราคาให้ค่ะ";

  return [intro, "", lines.join("\n\n"), "", suffix].join("\n") + buttons;
}

/**
 * Scans every visitor message in a conversation and returns the products
 * that were most likely being asked about, for pre-filling a draft
 * quotation. Used by the "สร้างใบเสนอราคาจากแชทนี้" admin action.
 */
export async function findMatchedProductsForQuote(
  visitorMessages: string[],
  limit = 3
): Promise<ProductRow[]> {
  const combinedQuery = normalize(visitorMessages.join(" "));
  if (!combinedQuery) return [];

  const products = await prisma.product.findMany({
    include: { category: true },
    take: 200,
  });

  const scored = products
    .map((p) => ({ product: p, score: scoreProduct(p, combinedQuery) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);

  if (scored.length === 0) return [];

  // Only keep products that scored close to the best match, so a specific
  // product name doesn't drag in every loosely-related item from the same
  // category (e.g. asking about one gear motor shouldn't draft a line item
  // for every other gear motor too).
  const topScore = scored[0].score;
  return scored
    .filter((r) => r.score >= topScore * 0.6)
    .slice(0, limit)
    .map((r) => r.product);
}
