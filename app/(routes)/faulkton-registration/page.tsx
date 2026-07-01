import React from "react";

export default function Page() {
  return (
    <div className="min-h-screen  text-black   pt-40">
      <div className="mx-auto max-w-5xl px-6 py-12">
        {/* Header */}
        <div className="border-b border-black pb-6">
          <h1 className="text-4xl font-bold">
            Faulkton Registration Download
          </h1>
          <p className="mt-2 text-gray-600">
            UGUIDE Liability Waiver – Faulkton Pheasant Camp
          </p>
        </div>

        {/* Download Card */}
        <div className="mt-8 rounded-xl border border-black p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold">
                UGUIDE Liability Waiver - Faulkton Pheasant Camp.pdf
              </h2>
              <p className="mt-1 text-gray-600">
                Download, complete, sign, and email the waiver before arrival.
              </p>
            </div>

            <a
              href="/pdf/FaulktonPheasant.pdf"
              download
              className="rounded-lg border border-black px-5 py-2 transition hover:bg-black hover:text-white"
            >
              Download PDF
            </a>
          </div>
        </div>

        {/* Main Content */}
        <div className="mt-10 space-y-8">
          {/* Form Requirements */}
          <section className="rounded-lg border border-black p-6">
            <h2 className="mb-4 text-2xl font-semibold">
              Liability Waiver Form
            </h2>

            <ul className="list-disc space-y-3 pl-5 text-gray-700">
              <li>
                All adults (18+) and minor guests (under 18) must complete
                <strong> Pages 1 & 2</strong>.
              </li>
              <li>
                Parents or guardians must complete
                <strong> Page 3 (Indemnity Page)</strong>.
              </li>
              <li>
                Complete all required fields including name, address,
                signature, and date.
              </li>
              <li>
                Attach a legible photo ID to the lower-left corner of Page 1 or
                as a separate page.
              </li>
              <li>
                Attach any applicable proof of discount as a separate page.
              </li>
              <li>
                For minors, attach a birth certificate, school ID, or passport
                showing the date of birth.
              </li>
            </ul>
          </section>

          {/* Submission */}
          <section className="rounded-lg border border-black p-6">
            <h2 className="mb-4 text-2xl font-semibold">
              Document Submission
            </h2>

            <ul className="list-disc space-y-3 pl-5 text-gray-700">
              <li>Scan only the signed pages of the completed waiver.</li>
              <li>Accepted formats: PDF, JPG, JPEG, BMP.</li>
              <li>
                Email all documents to:
                <span className="ml-2 font-semibold">
                  chris@uguidesdpheasants.com
                </span>
              </li>
              <li>
                Taking a clear photo of the signed pages is acceptable if they
                are legible.
              </li>
              <li className="font-medium text-black">
                Text messages are NOT accepted.
              </li>
            </ul>
          </section>

          {/* Important Notes */}
          <section className="rounded-lg border border-black p-6">
            <h2 className="mb-4 text-2xl font-semibold">
              Important Notes
            </h2>

            <p className="leading-8 text-gray-700">
              All documents must be scanned and emailed. If you are unable to
              scan your documents, you may use services such as FedEx or Kinko's
              or send them to another member of your group who can scan and
              email them.
            </p>

            <div className="mt-5 rounded-md border border-black bg-black p-4 text-white">
              Faxing, texting, or mailing waiver forms are <strong>NOT</strong>{" "}
              accepted.
            </div>

            <p className="mt-5 text-gray-700">
              If you have any questions, please contact your Group Coordinator.
            </p>
          </section>

          {/* Destination Pack */}
          <section className="rounded-lg border border-black p-6">
            <h2 className="mb-4 text-2xl font-semibold">
              After Registration
            </h2>

            <p className="mb-4 text-gray-700">
              Once full payment and registration have been completed, UGUIDE
              will email the Group Coordinator a Destination Pack containing:
            </p>

            <ul className="list-disc space-y-3 pl-5 text-gray-700">
              <li>Landowner contact information.</li>
              <li>Directions to your destination.</li>
              <li>Pheasant camp amenities.</li>
              <li>Area amenities.</li>
              <li>Property maps (when available).</li>
              <li>Packing tips.</li>
              <li>Instructions for obtaining your hunting license.</li>
              <li>Location-specific policies and information.</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}