import { requireModuleAccess } from "@/lib/admin-permissions";
import QuoteEditForm from "@/app/admin/(dashboard)/quotations/[id]/edit/QuoteEditForm";

type Params = Promise<{ id: string }>;

/**
 * Bare (no admin sidebar/header) version of the quote editor, meant to be
 * loaded inside an iframe modal (e.g. from the chat "สร้างใบเสนอราคา" button)
 * — living outside the (dashboard) layout group is what keeps it chrome-less,
 * same trick the print page uses.
 */
export default async function EditQuoteEmbedPage({ params }: { params: Params }) {
  await requireModuleAccess("quotations");
  const { id } = await params;
  return (
    <div className="mx-auto max-w-3xl p-6">
      <QuoteEditForm id={id} />
    </div>
  );
}
