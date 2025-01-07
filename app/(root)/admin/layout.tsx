import ErrorDiv from "@/components/shared/ErrorDiv";
import { checkUserIsAdmin } from "@/lib/actions/user.actions";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isAdmin, message } = await checkUserIsAdmin();

  if (!isAdmin) {
    return (
      <section className="w-full min-h-screen fl_center">
        <ErrorDiv errorMessage={message} />
      </section>
    );
  }

  return <>{children}</>;
}
