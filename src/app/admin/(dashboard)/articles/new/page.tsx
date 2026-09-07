import ArticleForm from "../ArticleForm";
import { createArticle } from "../actions";

export default function NewArticlePage() {
  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-neutral-900">เพิ่มบทความ</h1>
      <ArticleForm action={createArticle} showSlug />
    </div>
  );
}
