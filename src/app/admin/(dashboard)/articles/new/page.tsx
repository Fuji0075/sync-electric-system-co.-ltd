import ArticleForm from "../ArticleForm";
import { createArticle } from "../actions";
import { requireModuleAccess } from "@/lib/admin-permissions";

export default async function NewArticlePage() {
  await requireModuleAccess("articles");
  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-white">เพิ่มบทความ</h1>
      <ArticleForm action={createArticle} showSlug />
    </div>
  );
}
