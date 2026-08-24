import { prisma } from "@/lib/prisma";
import ComplaintForm from "./ComplaintForm";

export default async function ComplaintPage() {
  const settings = await prisma.systemSetting.upsert({
    where: {
      id: 1,
    },
    update: {},
    create: {
      id: 1,
    },
  });

  return (
    <ComplaintForm
      organizationName={settings.organizationName}
      systemTitle={settings.systemTitle}
      allowAnonymous={settings.allowAnonymous}
      requirePhone={settings.requirePhone}
    />
  );
}