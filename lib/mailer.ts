import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type ComplaintEmailData = {
  managerEmail?: string | null;
  userEmail?: string | null;
  userName?: string | null;
  phone?: string | null;
  referenceNo: string;
  subject: string;
  description: string;
  isAnonymous: boolean;
};

export async function sendComplaintEmails({
  managerEmail,
  userEmail,
  userName,
  phone,
  referenceNo,
  subject,
  description,
  isAnonymous,
}: ComplaintEmailData) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not configured.");
  }

  const notificationEmail =
    managerEmail || process.env.MANAGER_EMAIL;

  if (!notificationEmail) {
    throw new Error(
      "Manager notification email is not configured."
    );
  }

  // -----------------------------
  // MANAGER EMAIL
  // -----------------------------
  const managerResult = await resend.emails.send({
    from: "Complaint Management <onboarding@resend.dev>",
    to: notificationEmail,
    subject: `New Complaint Received - ${referenceNo}`,
    html: `
      <div
        style="
          font-family: Arial, sans-serif;
          max-width: 650px;
          margin: 0 auto;
          color: #1e293b;
          line-height: 1.6;
        "
      >
        <div
          style="
            background: #0b1d3a;
            color: white;
            padding: 24px;
            border-radius: 12px 12px 0 0;
          "
        >
          <h2 style="margin: 0;">
            New Complaint & Suggestion Received
          </h2>
        </div>

        <div
          style="
            border: 1px solid #e2e8f0;
            border-top: 0;
            padding: 24px;
            border-radius: 0 0 12px 12px;
          "
        >
          <p>
            A new complaint or suggestion has been submitted.
          </p>

          <table
            style="
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            "
          >
            <tr>
              <td
                style="
                  padding: 10px;
                  font-weight: bold;
                  border-bottom: 1px solid #e2e8f0;
                "
              >
                Reference
              </td>

              <td
                style="
                  padding: 10px;
                  border-bottom: 1px solid #e2e8f0;
                "
              >
                ${referenceNo}
              </td>
            </tr>

            <tr>
              <td
                style="
                  padding: 10px;
                  font-weight: bold;
                  border-bottom: 1px solid #e2e8f0;
                "
              >
                Submitted By
              </td>

              <td
                style="
                  padding: 10px;
                  border-bottom: 1px solid #e2e8f0;
                "
              >
                ${
                  isAnonymous
                    ? "Anonymous"
                    : userName || "Not provided"
                }
              </td>
            </tr>

            ${
              !isAnonymous
                ? `
                  <tr>
                    <td
                      style="
                        padding: 10px;
                        font-weight: bold;
                        border-bottom: 1px solid #e2e8f0;
                      "
                    >
                      Email
                    </td>

                    <td
                      style="
                        padding: 10px;
                        border-bottom: 1px solid #e2e8f0;
                      "
                    >
                      ${userEmail || "Not provided"}
                    </td>
                  </tr>

                  <tr>
                    <td
                      style="
                        padding: 10px;
                        font-weight: bold;
                        border-bottom: 1px solid #e2e8f0;
                      "
                    >
                      Phone
                    </td>

                    <td
                      style="
                        padding: 10px;
                        border-bottom: 1px solid #e2e8f0;
                      "
                    >
                      ${phone || "Not provided"}
                    </td>
                  </tr>
                `
                : ""
            }

            <tr>
              <td
                style="
                  padding: 10px;
                  font-weight: bold;
                  border-bottom: 1px solid #e2e8f0;
                "
              >
                Subject
              </td>

              <td
                style="
                  padding: 10px;
                  border-bottom: 1px solid #e2e8f0;
                "
              >
                ${subject}
              </td>
            </tr>
          </table>

          <div
            style="
              margin-top: 24px;
              background: #f8fafc;
              padding: 18px;
              border-radius: 10px;
            "
          >
            <strong>Complaint Details</strong>

            <p style="margin-bottom: 0;">
              ${description}
            </p>
          </div>

          <p
            style="
              margin-top: 24px;
              color: #64748b;
              font-size: 13px;
            "
          >
            Please review this complaint in the management dashboard.
          </p>
        </div>
      </div>
    `,
  });

  if (managerResult.error) {
    throw new Error(
      `Resend manager email failed: ${managerResult.error.message}`
    );
  }

  console.log(
    "Manager email sent successfully:",
    managerResult.data?.id
  );

  // -----------------------------
  // USER CONFIRMATION EMAIL
  // -----------------------------
  if (!isAnonymous && userEmail) {
    const userResult = await resend.emails.send({
      from: "Complaint Management <onboarding@resend.dev>",
      to: userEmail,
      subject: `Complaint Received - ${referenceNo}`,
      html: `
        <div
          style="
            font-family: Arial, sans-serif;
            max-width: 650px;
            margin: 0 auto;
            color: #1e293b;
            line-height: 1.6;
          "
        >
          <div
            style="
              background: #0b1d3a;
              color: white;
              padding: 24px;
              border-radius: 12px 12px 0 0;
            "
          >
            <h2 style="margin: 0;">
              Complaint Received
            </h2>
          </div>

          <div
            style="
              border: 1px solid #e2e8f0;
              border-top: 0;
              padding: 24px;
              border-radius: 0 0 12px 12px;
            "
          >
            <p>
              Dear ${userName || "User"},
            </p>

            <p>
              Your complaint or suggestion has been received successfully.
            </p>

            <div
              style="
                margin: 24px 0;
                background: #f1f5f9;
                padding: 20px;
                border-radius: 10px;
                text-align: center;
              "
            >
              <p
                style="
                  margin: 0;
                  color: #64748b;
                  font-size: 13px;
                "
              >
                Reference Number
              </p>

              <p
                style="
                  margin: 6px 0 0;
                  font-size: 22px;
                  font-weight: bold;
                  color: #0b1d3a;
                "
              >
                ${referenceNo}
              </p>
            </div>

            <p>
              An authorized representative will review your submission
              and contact you regarding the matter when required.
            </p>

            <p>
              Please keep your reference number for future correspondence.
            </p>

            <p
              style="
                margin-top: 28px;
                color: #64748b;
                font-size: 13px;
              "
            >
              Complaint Management System
            </p>
          </div>
        </div>
      `,
    });

    if (userResult.error) {
      throw new Error(
        `Resend user email failed: ${userResult.error.message}`
      );
    }

    console.log(
      "User email sent successfully:",
      userResult.data?.id
    );
  }
}