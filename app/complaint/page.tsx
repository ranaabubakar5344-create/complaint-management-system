// import { prisma } from "@/lib/prisma";
// import ComplaintForm from "./ComplaintForm";
// export const dynamic = "force-dynamic";
// export const revalidate = 0;
// export default async function ComplaintPage() {
//   const settings = await prisma.systemSetting.upsert({
//     where: {
//       id: 1,
//     },
//     update: {},
//     create: {
//       id: 1,
//     },
//   });

//   return (
//     <ComplaintForm
//       organizationName={settings.organizationName}
//       systemTitle={settings.systemTitle}
//       allowAnonymous={settings.allowAnonymous}
//       requirePhone={settings.requirePhone}
//     />
//   );
// }


import ComplaintForm from "./ComplaintForm";

export const dynamic = "force-dynamic";

export default function ComplaintPage() {
  return (
    <ComplaintForm
      organizationName="Complaint Management System"
      systemTitle="Complaint & Suggestion Form"
      allowAnonymous={true}
      requirePhone={false}
    />
  );
}