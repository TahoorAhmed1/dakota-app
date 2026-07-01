import React from "react";

function Page() {
  return (
    <div className="min-h-screen py-10 px-4 text-black">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold">
            West River Adventures Registration
          </h1>
          <p className="mt-2 text-gray-600">
            Download and complete the hunting liability waiver before your trip.
          </p>
        </div>

        {/* Download Card */}
        <section className="rounded-xl border border-gray-200 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold">
                UGUIDE West River Adventures Hunting Liability Waiver.pdf
              </h2>
              <p className="mt-1 text-gray-600">
                Download, complete, sign, and email your waiver before arrival.
              </p>
            </div>

            <a
              href="/pdf/WestRiverAdventures.pdf"
              download
              className="rounded-lg border border-black px-5 py-2 transition hover:bg-black hover:text-white"
            >
              Download PDF
            </a>
          </div>
        </section>

        {/* Instructions */}
        <section className="rounded-xl border border-gray-200 p-6">
          <h2 className="mb-4 text-2xl font-semibold">
            Liability Waiver Instructions
          </h2>

          <ul className="list-disc space-y-3 pl-5 text-gray-700">
            <li>
              All adults (18+) and minor guests (under 18) must complete
              <strong> Page 1</strong>.
            </li>
            <li>
              Parents or guardians must complete
              <strong> Page 2 (Indemnity Page)</strong>.
            </li>
            <li>
              Complete all required fields, including your name, address,
              signature, and date.
            </li>
            <li>
              Attach a legible photo ID to the lower-left corner of Page 1 or
              include it as a separate page.
            </li>
            <li>
              Attach any applicable proof of discount as a separate page.
            </li>
            <li>
              For minors, attach a birth certificate, school ID, or passport
              showing their date of birth.
            </li>
          </ul>
        </section>

        {/* Submission */}
        <section className="rounded-xl border border-gray-200 p-6">
          <h2 className="mb-4 text-2xl font-semibold">
            Document Submission
          </h2>

          <ul className="list-disc space-y-3 pl-5 text-gray-700">
            <li>Scan only the signed pages of the completed waiver.</li>
            <li>Accepted file formats: PDF, JPG, JPEG, and BMP.</li>
            <li>
              Email your completed documents to{" "}
              <span className="font-semibold text-black">
                chris@uguidesdpheasants.com
              </span>
            </li>
            <li>
              Clear photos of the signed pages are acceptable if they are
              legible.
            </li>
          </ul>

          <div className="mt-6 rounded-lg bg-black p-4 text-white">
            <strong>Important:</strong> Faxing, texting, or mailing waiver
            forms are <strong>NOT</strong> accepted.
          </div>
        </section>

        {/* Important Notes */}
        <section className="rounded-xl border border-gray-200 p-6">
          <h2 className="mb-4 text-2xl font-semibold">
            Other Important Notes
          </h2>

          <p className="leading-7 text-gray-700">
            All documents must be scanned and emailed. If you cannot scan and
            email your documents, please use a print/scan service (such as
            FedEx Office) or have another member of your group submit them for
            you.
          </p>

          <p className="mt-4 text-gray-700">
            If you have any questions, please contact your Group Coordinator.
          </p>
        </section>

        {/* Destination Pack */}
        <section className="rounded-xl border border-gray-200 p-6">
          <h2 className="mb-4 text-2xl font-semibold">
            After Registration
          </h2>

          <p className="mb-4 text-gray-700">
            Once full payment and registration are complete, UGUIDE will email
            the Group Coordinator a Destination Pack containing:
          </p>

          <ul className="grid gap-3 text-gray-700 sm:grid-cols-2">
            <li>• Landowner contact information</li>
            <li>• Directions to your destination</li>
            <li>• Pheasant camp amenities</li>
            <li>• Area amenities</li>
            <li>• Property maps (when available)</li>
            <li>• Packing tips</li>
            <li>• Hunting license instructions</li>
            <li>• Location-specific policies</li>
          </ul>
        </section>
      </div>
    </div>
  );
}

export default Page;