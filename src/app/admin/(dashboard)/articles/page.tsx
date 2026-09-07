import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteArticle } from "./actions";

export default async function AdminArticlesPage() {
  const articles = await prisma.article.findMany({ orderBy: { publishedAt: "desc" } });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-neutral-900">บทความ</h1>
        <Link
          href="/admin/articles/new"
          className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          + เพิ่มบทความ
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-left text-xs uppercase text-neutral-500">
            <tr>
              <th className="px-4 py-3">หัวข้อ</th>
              <th className="px-4 py-3">วันที่เผยแพร่</th>
              <th className="px-4 py-3">สถานะ</th>
              <th className="px-4 py-3 text-right">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {articles.map((a) => (
              <tr key={a.id}>
                <td className="px-4 py-3 font-medium text-neutral-800">{a.title}</td>
                <td className="px-4 py-3 text-neutral-500">
                  {new Date(a.publishedAt).toLocaleDateString("th-TH")}
                </td>
                <td className="px-4 py-3">
                  {a.published ? (
                    <span className="text-brand-dark">เผยแพร่แล้ว</span>
                  ) : (
                    <span className="text-neutral-400">ฉบับร่าง</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-3">
                    <Link href={`/admin/articles/${a.id}/edit`} className="text-brand-dark hover:underline">
                      แก้ไข
                    </Link>
                    <form
                      action={async () => {
                        "use server";
                        await deleteArticle(a.id);
                      }}
                    >
                      <button type="submit" className="text-red-500 hover:underline">
                        ลบ
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {articles.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-neutral-400">
                  ยังไม่มีบทความ
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
