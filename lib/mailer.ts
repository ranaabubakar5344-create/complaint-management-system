import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === "true",

  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

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

  // 1. Manager ko email
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: managerEmail,
    subject: `New Complaint Received - ${referenceNo}`,
    html: `
      <h2>New Complaint Received</h2>

      <p><strong>Reference Number:</strong> ${referenceNo}</p>

      <p>
        <strong>Submitted By:</strong>
        ${isAnonymous ? "Anonymous" : userName || "Not provided"}
      </p>

      ${
        !isAnonymous
          ? `
            <p><strong>Email:</strong> ${userEmail || "Not provided"}</p>
            <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
          `
          : ""
      }

      <p><strong>Subject:</strong> ${subject}</p>

      <p><strong>Complaint Details:</strong></p>
      <p>${description}</p>

      <hr />

      <p>
        Please review this complaint and contact the complainant
        where contact information has been provided.
      </p>
    `,
  });

  // 2. Complainant ko confirmation email
  if (!isAnonymous && userEmail) {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: userEmail,
      subject: `Complaint Received - ${referenceNo}`,
      html: `
        <h2>Complaint Received</h2>

        <p>Dear ${userName || "User"},</p>

        <p>
          Your complaint has been successfully received.
        </p>

        <p>
          <strong>Complaint Reference:</strong>
          ${referenceNo}
        </p>

        <p>
          An authorized representative will review your complaint
          and contact you regarding the matter.
        </p>

        <p>
          Please keep this reference number for future correspondence.
        </p>

        <p>
          Regards,<br />
          Complaint Management Team
        </p>
      `,
    });
  }
}