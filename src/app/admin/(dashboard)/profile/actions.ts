"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

const MAX_SIGNATURE_BYTES = 500 * 1024; // ~500KB, plenty for a signature image

export type ProfileFormState = {
  error?: string;
  success?: boolean;
};

export async function updateAdminProfile(
  _prevState: ProfileFormState,
  formData: FormData
): Promise<ProfileFormState> {
  const session = await getSession();
  if (!session) return { error: "กรุณาเข้าสู่ระบบใหม่" };

  const phone = String(formData.get("phone") ?? "").trim() || null;
  const signatureDataUrl = String(formData.get("signatureDataUrl") ?? "").trim();
  const removeSignature = formData.get("removeSignature") === "on";

  if (signatureDataUrl && signatureDataUrl.length > MAX_SIGNATURE_BYTES * 1.4) {
    // base64 is ~4/3 the size of the original bytes
    return { error: "ไฟล์รูปลายเซ็นใหญ่เกินไป (ไม่เกิน 500KB)" };
  }

  await prisma.adminUser.update({
    where: { id: session.sub },
    data: {
      phone,
      ...(removeSignature
        ? { signatureUrl: null }
        : signatureDataUrl
          ? { signatureUrl: signatureDataUrl }
          : {}),
    },
  });

  revalidatePath("/admin/profile");
  return { success: true };
}
