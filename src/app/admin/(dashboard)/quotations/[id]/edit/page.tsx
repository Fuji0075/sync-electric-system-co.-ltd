import { requireModuleAccess } from "@/lib/admin-permissions";
import QuoteEditForm from "./QuoteEditForm";

type Params = Promise<{ id: string }>;

export default async function EditQuoteDocumentPage({ params }: { params: Params }) {
  await requireModuleAccess("quotations");
  const { id } = await params;
  return <QuoteEditForm id={id} showBackLink />;
}
