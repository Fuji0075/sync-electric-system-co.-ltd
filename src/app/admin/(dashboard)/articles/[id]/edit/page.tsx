import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ArticleForm from "../../ArticleForm";
import { updateArticle } from "../../actions";
import { requireModuleAccess } from "@/lib/admin-permissions";

type Params = Promise<{ id: string }>;

export default async function EditArticlePage({ params }: { params: Params }) {
  await requireModuleAccess("articles");
  const { id } = await params;
  const article = await prisma.article.findUnique({ where: { id } });
  if (!article) notFound();

  const action = updateArticle.bind(null, id);

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-[var(--admin-text)]">แก้ไขบทความ</h1>
      <ArticleForm action={action} defaultValues={article} />
    </div>
  );
}
