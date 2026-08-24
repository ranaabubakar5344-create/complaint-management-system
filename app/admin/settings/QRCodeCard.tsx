"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Download, QrCode } from "lucide-react";

export default function QRCodeCard({
  complaintFormUrl,
}: {
  complaintFormUrl: string;
}) {
  const [qrCode, setQrCode] = useState("");

  useEffect(() => {
    if (!complaintFormUrl) {
      setQrCode("");
      return;
    }

    QRCode.toDataURL(complaintFormUrl, {
      width: 500,
      margin: 2,
    })
      .then(setQrCode)
      .catch((error) => {
        console.error("QR Code generation failed:", error);
      });
  }, [complaintFormUrl]);

  function downloadQR() {
    if (!qrCode) return;

    const link = document.createElement("a");
    link.href = qrCode;
    link.download = "complaint-form-qr-code.png";
    link.click();
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
          <QrCode size={22} />
        </div>

        <div>
          <h2 className="font-bold">Complaint Form QR Code</h2>
          <p className="text-sm text-slate-500">
            Scan this QR code to open the complaint form.
          </p>
        </div>
      </div>

      {!complaintFormUrl ? (
        <div className="mt-6 rounded-xl bg-amber-50 p-4 text-sm text-amber-700">
          Add the Complaint Form URL in Settings first.
        </div>
      ) : (
        <div className="mt-6">
          <div className="flex justify-center rounded-2xl border border-slate-200 bg-white p-6">
            {qrCode && (
              <img
                src={qrCode}
                alt="Complaint Form QR Code"
                className="h-64 w-64"
              />
            )}
          </div>

          <div className="mt-4 rounded-xl bg-slate-50 p-4">
            <p className="break-all text-sm text-slate-600">
              {complaintFormUrl}
            </p>
          </div>

          <button
            type="button"
            onClick={downloadQR}
            disabled={!qrCode}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            <Download size={18} />
            Download QR Code
          </button>
        </div>
      )}
    </section>
  );
}