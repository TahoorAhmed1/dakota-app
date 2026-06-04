import Link from "next/link";

export default function PaymentsPage() {
  return (
    <main className="flex flex-col">
      <section
      className="relative flex min-h-85 items-center justify-center bg-[#E7DCCF] px-4 py-24 text-center sm:px-6 sm:py-32 md:min-h-128"
      style={{
        backgroundImage:
          "radial-gradient(circle at top, rgba(241,103,36,0.18), transparent 35%)",
      }}
    >
        <div className="absolute inset-0" />
        <div className="relative z-10 mx-auto max-w-4xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-[#4a2b12]">
            Payments
          </p>
          <h1 className="mb-6 text-4xl font-bold text-[#281703] sm:text-5xl">
            Secure payment and booking options
          </h1>
          <p className="mx-auto max-w-3xl text-sm leading-7 text-[#3c2f26] sm:text-base">
            Choose from secure payment options and review the deposit structure for your UGUIDE reservation. If you need help completing a payment, contact us and we will walk you through the process.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/quote-reserve"
              className="rounded-full bg-[#f26f2d] px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#de671f]"
            >
              Request a quote
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-[#f26f2d] bg-white px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-[#281703] transition hover:border-[#d35b1f] hover:text-[#d35b1f]"
            >
              Contact support
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16 sm:px-6 md:px-8">
        <div className="mx-auto max-w-6xl space-y-10">
          <div className="rounded-3xl border border-[#dfd3c8] bg-[#fbf2e8] p-8 shadow-sm">
            <h2 className="mb-4 text-2xl font-bold text-[#281703]">Payment Overview</h2>
            <p className="text-sm leading-7 text-[#4d3c2f]">
              UGUIDE deposits are processed securely via PayPal and are applied directly to your reservation. You can review your quote and make a deposit using the Quote-Reserve flow, or contact our team if you prefer assistance.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-[#dfd3c8] bg-white p-6 shadow-sm">
              <h3 className="mb-3 text-lg font-bold text-[#281703]">Deposit</h3>
              <p className="text-sm leading-7 text-[#4d3c2f]">
                A deposit secures your camp reservation and starts the booking process. The exact amount is calculated during quote submission.
              </p>
            </div>
            <div className="rounded-3xl border border-[#dfd3c8] bg-white p-6 shadow-sm">
              <h3 className="mb-3 text-lg font-bold text-[#281703]">Secure Checkout</h3>
              <p className="text-sm leading-7 text-[#4d3c2f]">
                Payments are processed through a secure PayPal integration. You do not need a PayPal account to complete checkout when using a credit or debit card.
              </p>
            </div>
            <div className="rounded-3xl border border-[#dfd3c8] bg-white p-6 shadow-sm">
              <h3 className="mb-3 text-lg font-bold text-[#281703]">Need Help?</h3>
              <p className="text-sm leading-7 text-[#4d3c2f]">
                If you need payment assistance, we are available to help you finalize your booking and confirm your selected week and camp.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
