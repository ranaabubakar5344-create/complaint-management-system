import { redirect } from "next/navigation";
import { getManagerSession } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getManagerSession();

  if (!session) {
    redirect("/manager/login");
  }

  return <>{children}</>;
}