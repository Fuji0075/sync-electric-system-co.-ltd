import { redirect } from "next/navigation";
import { getCustomerSession } from "@/lib/customer-auth";
import LoginForm from "./LoginForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "เข้าสู่ระบบ" };

export default async function LoginPage() {
  const session = await getCustomerSession();
  if (session) redirect("/account");

  return (
    <div className="mx-auto max-w-sm px-4 py-14 sm:px-6">
      <h1 className="mb-6 text-center text-xl font-bold text-neutral-900">เข้าสู่ระบบ</h1>
      <LoginForm />
    </div>
  );
}
