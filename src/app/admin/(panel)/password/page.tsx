import type { Metadata } from "next";
import { AdminHeading, Card, Notice } from "@/components/admin/Layout";
import { SubmitButton } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin";
import { changePassword } from "./actions";

export const metadata: Metadata = { title: "Change Password" };

export default async function PasswordPage({ searchParams }: { searchParams: Promise<{ saved?: string; error?: string }> }) {
  const { saved, error } = await searchParams;
  await requireAdmin();
  return (
    <>
      <AdminHeading title="Change Password" tamil="உங்கள் கடவுச்சொல்லை மாற்றவும்" />
      <Notice saved={saved} error={error} />
      <Card className="max-w-md">
        <form action={changePassword} className="space-y-4">
          <div>
            <label className="label" htmlFor="password">New password</label>
            <input id="password" name="password" type="password" required minLength={8} autoComplete="new-password" className="input" />
            <p className="mt-1 text-xs text-gray-500">At least 8 characters.</p>
          </div>
          <div>
            <label className="label" htmlFor="confirm">Type it again</label>
            <input id="confirm" name="confirm" type="password" required minLength={8} autoComplete="new-password" className="input" />
          </div>
          <SubmitButton>Change password</SubmitButton>
        </form>
      </Card>
    </>
  );
}
