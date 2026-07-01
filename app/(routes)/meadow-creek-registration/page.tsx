import React from "react";

function Page() {
  return (
    <div className="min-h-screen bg-white text-black   pt-40py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="border-b border-gray-300 pb-6">
          <h1 className="text-4xl font-bold">
            Meadow Creek Registration
          </h1>
          <p className="mt-2 text-gray-600">
            Download and complete the Meadow Creek Hunting Liability Waiver
            before your trip.
          </p>
        </div>

        {/* Download Card */}
        <div className="mt-8 rounded-xl border p-6 shadow-sm">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-semibold">
                Meadow Creek Hunting Liability Waiver - Pheasant Hunting.pdf
              </h2>
              <p className="mt-1 text-gray-600">
                Download, complete, sign, and email the waiver before arrival.
              </p>
            </div>

            <a
              href="/pdf/MeadowCreek.pdf"
              download
              className="rounded-lg border border-black px-5 py-2 transition hover:bg-black hover:text-white"
            >
              Download PDF
            </a>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 rounded-xl border p-6">
          <h2 className="mb-4 text-2xl font-bold">
            Liability Waiver Instructions
          </h2>

          <ul className="list-disc space-y-3 pl-6 text-gray-700">
            <li>
              All adults (18+) and minor guests (under 18) must complete
              <strong> Page 1</strong>.
            </li>
            <li>
              Parents or guardians must complete
              <strong> Page 2 (Indemnity Page)</strong>.
            </li>
            <li>
              Complete all required fields including name, address, signature,
              and date.
            </li>
            <li>
              Attach a legible photo ID to Page 1 or as a separate page.
            </li>
            <li>
              Attach any applicable proof of discount separately if required.
            </li>
            <li>
              For minors, include a birth certificate, school ID, or passport
              showing the date of birth.
            </li>
          </ul>
        </div>

        {/* Submission */}
        <div className="mt-8 rounded-xl border p-6">
          <h2 className="mb-4 text-2xl font-bold">
            Submission Requirements
          </h2>

          <ul className="list-disc space-y-3 pl-6 text-gray-700">
            <li>Scan only the signed pages of the completed waiver.</li>
            <li>Accepted formats: PDF, JPG, JPEG, and BMP.</li>
            <li>
              Email all documents to{" "}
              <span className="font-semibold">
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
            forms is <strong>NOT</strong> accepted.
          </div>
        </div>

        {/* Important Notes */}
        <div className="mt-8 rounded-xl border p-6">
          <h2 className="mb-4 text-2xl font-bold">
            Other Important Notes
          </h2>

          <p className="leading-7 text-gray-700">
            If you cannot scan and email your documents, please use a print and
            scan service such as FedEx or ask another member of your group to
            submit them on your behalf.
          </p>

          <p className="mt-4 text-gray-700">
            If you have any questions, please contact your Group Coordinator.
          </p>
        </div>

        {/* Destination Pack */}
        <div className="mt-8 mb-10 rounded-xl border p-6">
          <h2 className="mb-4 text-2xl font-bold">
            After Registration
          </h2>

          <p className="mb-4 text-gray-700">
            Once full payment and registration are complete, the Group
            Coordinator will receive a Destination Pack containing:
          </p>

          <ul className="grid list-disc gap-3 pl-6 text-gray-700 sm:grid-cols-2">
            <li>Landowner contact information</li>
            <li>Directions to your destination</li>
            <li>Pheasant camp amenities</li>
            <li>Area amenities</li>
            <li>Property maps (when available)</li>
            <li>Packing tips</li>
            <li>Hunting license information</li>
            <li>Location-specific policies</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Page;