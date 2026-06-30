import React from "react";

function Page() {
  return (
    <div className="min-h-screen bg-white text-black   pt-40py-10 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="border-b border-gray-300 pb-6">
          <h1 className="text-4xl font-bold">
            Gunners Haven Registration
          </h1>
          <p className="mt-2 text-gray-600">
            Download and complete the UGUIDE Liability Waiver before your trip.
          </p>
        </div>

        {/* Download Card */}
        <div className="mt-8 border rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between flex-col sm:flex-row gap-4">
            <div>
              <h2 className="text-xl font-semibold">
                UGUIDE Liability Waiver - Gunners Haven.pdf
              </h2>
              <p className="text-gray-600 mt-1">
                Download, complete, sign, and email the waiver before arrival.
              </p>
            </div>

            <button className="border border-black px-5 py-2 rounded-lg hover:bg-black hover:text-white transition">
              Download PDF
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 border rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-4">
            Liability Waiver Instructions
          </h2>

          <ul className="list-disc pl-6 space-y-3 text-gray-700">
            <li>All adults (18+) and minor guests (under 18) must complete Pages 1 & 2.</li>
            <li>Parents or guardians must complete Page 3 (Indemnity Page).</li>
            <li>Complete all required fields including name, address, signature, and date.</li>
            <li>Attach a legible photo ID to Page 1 or as a separate page.</li>
            <li>Attach any proof of discount separately if applicable.</li>
            <li>
              Minors must include a birth certificate, school ID, or passport
              showing their date of birth.
            </li>
          </ul>
        </div>

        {/* Submission */}
        <div className="mt-8 border rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-4">
            Submission Requirements
          </h2>

          <ul className="list-disc pl-6 space-y-3 text-gray-700">
            <li>Scan only the signed pages of the completed waiver.</li>
            <li>Accepted formats: PDF, JPG, JPEG, and BMP.</li>
            <li>
              Email all documents to{" "}
              <span className="font-semibold">
                chris@uguidesdpheasants.com
              </span>
            </li>
            <li>
              You may send clear photos of the signed pages if they are fully
              legible.
            </li>
          </ul>

          <div className="mt-6 border border-black bg-black text-white rounded-lg p-4">
            <strong>Important:</strong> Texting, faxing, or mailing waiver
            forms is <strong>NOT</strong> accepted.
          </div>
        </div>

        {/* Important Notes */}
        <div className="mt-8 border rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-4">
            Other Important Notes
          </h2>

          <p className="text-gray-700 leading-7">
            If you cannot scan and email your documents, please use services
            such as FedEx or another print/scan center, or ask someone in your
            group to submit them on your behalf.
          </p>

          <p className="mt-4 text-gray-700">
            If you have any questions, please contact your Group Coordinator.
          </p>
        </div>

        {/* Destination Pack */}
        <div className="mt-8 border rounded-xl p-6 mb-10">
          <h2 className="text-2xl font-bold mb-4">
            After Registration
          </h2>

          <p className="text-gray-700 mb-4">
            Once full payment and registration are complete, the Group
            Coordinator will receive a Destination Pack containing:
          </p>

          <ul className="grid gap-3 sm:grid-cols-2 list-disc pl-6 text-gray-700">
            <li>Landowner contact information</li>
            <li>Directions to your destination</li>
            <li>Pheasant camp amenities</li>
            <li>Area amenities</li>
            <li>Property maps (where available)</li>
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