import Link from "next/link";

type Props = {
  searchParams?: {
    status?: string;
    quoteNumber?: string;
    message?: string;
  };
};

export default function PayPalConfirmationPage({ searchParams }: Props) {
  const status = searchParams?.status ?? "error";
  const quoteNumber = searchParams?.quoteNumber;
  const message = searchParams?.message
    ? decodeURIComponent(searchParams.message)
    : undefined;

  const isSuccess = status === "success";

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#f5f5f5] px-4 py-12 text-center sm:px-6">
      <div className="w-full max-w-3xl rounded-[18px] bg-white px-6 py-10 shadow-[0_18px_40px_rgba(0,0,0,0.12)] sm:px-10">
        <h1 className="text-[32px] font-bold uppercase tracking-[-0.03em] text-[#281703] sm:text-[42px]">
          {isSuccess ? "Payment Completed" : "Payment Not Completed"}
        </h1>
        <p className="mt-6 text-[16px] leading-8 text-[#4e4e4e]">
          {isSuccess
            ? "Thank you for your deposit. Your reservation quote has been recorded."
            : "There was a problem finalizing your PayPal payment. Please try again or contact us for assistance."}
        </p>
        {quoteNumber && (
          <p className="mt-4 text-[15px] font-semibold text-[#2b1a0f]">
            Quote Number: <span className="font-bold">{quoteNumber}</span>
          </p>
        )}
        {message && (
          <p className="mt-4 text-[14px] text-[#7a5a3a]">{message}</p>
        )}
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/quote-reserve"
            className="rounded-md bg-[#f26f2d] px-8 py-3 text-[15px] font-bold uppercase text-white transition hover:bg-[#e16528]"
          >
            Return to Booking
          </Link>
          <Link
            href="/"
            className="rounded-md border border-[#f26f2d] px-8 py-3 text-[15px] font-bold uppercase text-[#4c2c11] transition hover:bg-[#fbe9d9]"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
