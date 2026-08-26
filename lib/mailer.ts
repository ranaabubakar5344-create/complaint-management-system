import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type ComplaintEmailData = {
  userEmail?: string | null;
  userName?: string | null;
  phone?: string | null;
  referenceNo: string;
  subject: string;
  description: string;
  isAnonymous: boolean;
};

export async function sendComplaintEmails({
  userEmail,
  userName,
  phone,
  referenceNo,
  subject,
  description,
  isAnonymous,
}: ComplaintEmailData) {
  const managerEmail = process.env.MANAGER_EMAIL;

  if (!managerEmail) {
    throw new Error("MANAGER_EMAIL is not configured.");
  }

  // Manager email
  await resend.emails.send({
    from: "Complaint Management <onboarding@resend.dev>",
    to: managerEmail,
    subject: `New Complaint Received - ${referenceNo}`,
    html: `
      <h2>New Complaint Received</h2>
      <p><strong>Reference:</strong> ${referenceNo}</p>
      <p><strong>Submitted By:</strong> ${
        isAnonymous ? "Anonymous" : userName || "Not provided"
      }</p>
      ${
        !isAnonymous
          ? `
          <p><strong>Email:</strong> ${userEmail || "Not provided"}</p>
          <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
        `
          : ""
      }
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Details:</strong></p>
      <p>${description}</p>
    `,
  });

  // User confirmation
  if (!isAnonymous && userEmail) {
    await resend.emails.send({
      from: "Complaint Management <onboarding@resend.dev>",
      to: userEmail,
      subject: `Complaint Received - ${referenceNo}`,
      html: `
        <h2>Complaint Received</h2>
        <p>Dear ${userName || "User"},</p>
        <p>Your complaint has been successfully received.</p>
        <p><strong>Reference Number:</strong> ${referenceNo}</p>
        <p>An authorized representative will review your complaint and contact you regarding the matter.</p>
        <p>Please keep this reference number for future correspondence.</p>
      `,
    });
  }
}