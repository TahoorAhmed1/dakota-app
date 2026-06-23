"use client";

import { Link } from "lucide-react";
import React, { useState } from "react";

const PAYPAL_FEE_RATE = 0.03;

function fmt(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export default function Page() {
  const [coordinator, setCoordinator] = useState("");
  const [instructions, setInstructions] = useState("");
  const [amount, setAmount] = useState("");
  const [calculated, setCalculated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const raw = parseFloat(amount) || 0;
  const fee = raw * PAYPAL_FEE_RATE;
  const total = raw + fee;

  function calculate() {
    const errs: Record<string, string> = {};
    if (!coordinator.trim())
      errs.coordinator = "Please enter the Group Coordinator Name.";
    if (!amount || raw <= 0)
      errs.amount = "Please enter a valid deposit amount.";
    setErrors(errs);
    if (Object.keys(errs).length === 0) setCalculated(true);
  }

  async function handlePayPalSubmit() {
    setIsSubmitting(true);
    setSubmitMessage("");
    try {
      const response = await fetch("/api/quote/paypal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          coordinatorName: coordinator,
          instructions,
          depositAmount: raw,
          totalAmount: total,
          processingFee: fee,
        }),
      });
      const data = await response.json();
      if (response.ok && data.approvalUrl) {
        window.location.href = data.approvalUrl;
        return;
      }
      setSubmitMessage(data.error || "Unable to start PayPal checkout.");
    } catch {
      setSubmitMessage("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <section
        className="relative flex min-h-85 items-center justify-center bg-[#E7DCCF] px-4 py-24 text-center sm:px-6 sm:py-32 md:min-h-128"
        style={{
          backgroundImage:
            "radial-gradient(circle at top, rgba(241,103,36,0.18), transparent 35%)",
        }}
      >
        <div className="absolute inset-0" />
        <div className="relative z-10 mx-auto max-w-4xl mt-20">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-[#4a2b12]">
            Payments
          </p>
          <h1 className="mb-6 text-4xl font-bold text-[#281703] sm:text-5xl">
            Secure payment and booking options
          </h1>
          <p className="mx-auto max-w-3xl text-sm leading-7 text-[#3c2f26] sm:text-base">
            Choose from secure payment options and review the deposit structure
            for your UGUIDE reservation. If you need help completing a payment,
            contact us and we will walk you through the process.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 py-8 font-sans text-black">
        {/* Page title */}
        <h1 className="text-3xl font-extrabold uppercase tracking-tight mb-6 text-black">
          Make a UGUIDE Pheasant Hunting Payment
        </h1>

        {/* Payment options */}
        <p className="font-bold mb-2">PAYMENTS OPTIONS:</p>
        <ul className="mb-5 space-y-1.5 text-sm leading-snug">
          {[
            <>
              VENMO <strong>&quot;@Chris-Hitzeman&quot;</strong> - (Preferred-No
              Fee),
            </>,
            <>
              ZELLE - Send to{" "}
              <strong>&quot;chris@uguidesdpheasants.com&quot;</strong>
            </>,
            <>
              Checks (No fee) - Make Payable to:{" "}
              <strong>&quot;Chris Hitzeman&quot;</strong> Mail to: 38274 286th
              St Lake Andes SD 57356 (Allow 14 days for delivery and processing
              if using USPS). Enter Group Coordinators Last Name, only, in the
              notes field of your check.
            </>,
            <>PAYPAL (Below) 3% Fee</>,
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-[#f26f2d] font-bold mt-0.5">✓</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        {/* Numbered instructions */}
        <div className="space-y-2 mb-6 text-sm leading-relaxed">
          <p>
            <strong>1.</strong> First, enter your{" "}
            <strong>
              <u>Group Coordinators Name</u>
            </strong>{" "}
            in the first field below.
          </p>
          <p>
            <strong>2.</strong> Then, enter any specials instructions in the{" "}
            <strong>
              <u>&quot;Payment Instructions&quot;</u>
            </strong>{" "}
            field like &quot;Split between Steve and Bob&quot; or &quot;This is
            for Steve Jones&quot;.
          </p>
          <p>
            <strong>3.</strong> Next, enter your deposit amount and select the
            &quot;Calculate Processing Fee&quot; button. Your total payment will
            be displayed.
          </p>
          <p>
            <strong>4.</strong> Hit &quot;Submit Payment&quot; and you will be
            taken to Paypal&apos;s secure payment site where you can use your
            Paypal account or just a credit card to submit payment.
          </p>
        </div>

        {/* Form fields */}
        <div className="space-y-3 mb-5">
          {/* Coordinator */}
          <div className="flex items-center gap-3">
            <label className="w-52 text-right text-sm shrink-0">
              Group Coordinator Name
            </label>
            <div className="flex-1">
              <input
                type="text"
                value={coordinator}
                onChange={(e) => {
                  setCoordinator(e.target.value);
                  setErrors((p) => ({ ...p, coordinator: "" }));
                  setCalculated(false);
                }}
                className={`w-full border px-2 py-1.5 text-sm outline-none focus:border-blue-500 ${
                  errors.coordinator ? "border-red-500" : "border-gray-400"
                }`}
              />
              {errors.coordinator && (
                <p className="text-xs text-red-600 mt-0.5">
                  {errors.coordinator}
                </p>
              )}
            </div>
          </div>

          {/* Payment Instructions */}
          <div className="flex items-center gap-3">
            <label className="w-52 text-right text-sm shrink-0">
              Payment Instructions
            </label>
            <input
              type="text"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="flex-1 border border-gray-400 px-2 py-1.5 text-sm outline-none focus:border-blue-500"
            />
          </div>

          {/* Deposit Amount */}
          <div className="flex items-center gap-3">
            <label className="w-52 text-right text-sm shrink-0">
              Deposit Amount
            </label>
            <div className="flex-1">
              <input
                type="number"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setCalculated(false);
                  setSubmitMessage("");
                  setErrors((p) => ({ ...p, amount: "" }));
                }}
                placeholder=""
                min="0"
                step="0.01"
                className={`w-full border px-2 py-1.5 text-sm outline-none focus:border-blue-500 ${
                  errors.amount ? "border-red-500" : "border-gray-400"
                }`}
              />
              {errors.amount && (
                <p className="text-xs text-[#f26f2d] mt-0.5">{errors.amount}</p>
              )}
            </div>
          </div>
        </div>

        {/* Calculate button */}
        <div className="flex justify-center mb-5">
          <button
            onClick={calculate}
            className="bg-[#f26f2d] hover:bg-[#f26f2d] active:scale-95 text-white font-bold px-8 py-2.5 text-sm transition"
          >
            Calculate Processing Fee
          </button>
        </div>

        {/* Result table */}
        {calculated && raw > 0 && (
          <div className="mb-5 border border-gray-300 text-sm">
            <table className="w-full">
              <tbody>
                <tr className="border-b border-gray-300">
                  <td className="px-4 py-2 font-semibold bg-gray-50 w-48">
                    Deposit Amount
                  </td>
                  <td className="px-4 py-2">{fmt(raw)}</td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="px-4 py-2 font-semibold bg-gray-50">
                    Processing Fee (3%)
                  </td>
                  <td className="px-4 py-2">{fmt(fee)}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-bold bg-gray-50">
                    Total Payment
                  </td>
                  <td className="px-4 py-2 font-bold text-red-800 text-base">
                    {fmt(total)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Submit Payment button */}
        {calculated && raw > 0 && (
          <div className="flex justify-center">
            <button
              onClick={handlePayPalSubmit}
              disabled={isSubmitting}
              className="bg-[#f26f2d] hover:bg-[#f26f2d] active:scale-95 text-white font-bold px-8 py-2.5 text-sm transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Connecting to PayPal…" : "Submit Payment"}
            </button>
          </div>
        )}

        {submitMessage && (
          <p className="text-sm text-red-600 text-center mt-3">
            {submitMessage}
          </p>
        )}
      </div>
    </div>
  );
}
