import { redirect } from "next/navigation";
import { getCustomerSession } from "@/lib/customer-auth";
import RegisterForm from "./RegisterForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "สมัครสมาชิก" };

export default async function RegisterPage() {
  const session = await getCustomerSession();
  if (session) redirect("/account");

  return (
    <div className="mx-auto max-w-sm px-4 py-14 sm:px-6">
      <h1 className="mb-6 text-center text-xl font-bold text-neutral-900">สมัครสมาชิก</h1>
      <RegisterForm />
    </div>
  );
}
