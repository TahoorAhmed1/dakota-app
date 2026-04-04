import Link from "next/link";

import { prisma } from "@/lib/prisma";

export default async function PackagesSection() {
  let packages: Awaited<ReturnType<typeof prisma.packageOption.findMany>> = [];
  let minGroupData: { name: string; minGroupSize: number }[] = [];

  try {
    packages = await prisma.packageOption.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: "asc" },
    });

    const camps = await prisma.camp.findMany({
      where: { isActive: true },
      select: {
        name: true,
        pricingRows: {
          where: { isAvailable: true },
          select: { minGroupSize: true },
          orderBy: { minGroupSize: "asc" },
          take: 1,
        },
      },
      orderBy: { displayOrder: "asc" },
    });

    minGroupData = camps
      .filter((c) => c.pricingRows.length > 0)
      .map((c) => ({ name: c.name, minGroupSize: c.pricingRows[0].minGroupSize }));
  } catch {
    // Database unavailable – render section with empty data
  }

  return (
    <section className="bg-white px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        {/* Packages */}
        <div className="text-center">
          <p className="mb-2 text-xs font-bold tracking-widest uppercase text-orange-500">
            What&apos;s Included
          </p>
          <h2 className="text-3xl font-bold uppercase text-black sm:text-4xl">
            Hunt Packages
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-black/70 sm:text-base">
            All packages include lodging, daily guided-area hunts, and full camp services. Add extra hunt days or lodge nights to any package.
          </p>
        </div>

        {packages.length > 0 ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 sm:mt-12">
            {packages.map((pkg, i) => (
              <div
                key={pkg.id}
                className={`flex flex-col rounded-xl border p-8 text-center shadow-sm ${
                  i === 1
                    ? "border-orange-400 bg-orange-500 text-white"
                    : "border-[#d7c8b6] bg-white text-[#281703]"
                }`}
              >
                <p
                  className={`text-xs font-bold tracking-widest uppercase ${
                    i === 1 ? "text-white/80" : "text-orange-500"
                  }`}
                >
                  {i === 1 ? "Most Popular" : "Package"}
                </p>
                <h3 className="mt-2 text-2xl font-bold">{pkg.label}</h3>
                <div className="mt-6 flex items-center justify-center gap-8">
                  <span className="flex flex-col items-center">
                    <strong className="text-4xl font-bold">{pkg.days}</strong>
                    <span className={`text-xs font-semibold uppercase tracking-wide mt-1 ${i === 1 ? "text-white/70" : "text-[#281703]/60"}`}>
                      Days
                    </span>
                  </span>
                  <span className={`h-10 w-px ${i === 1 ? "bg-white/30" : "bg-[#d7c8b6]"}`} />
                  <span className="flex flex-col items-center">
                    <strong className="text-4xl font-bold">{pkg.nights}</strong>
                    <span className={`text-xs font-semibold uppercase tracking-wide mt-1 ${i === 1 ? "text-white/70" : "text-[#281703]/60"}`}>
                      Nights
                    </span>
                  </span>
                </div>
                <Link
                  href="/quote-reserve"
                  className={`mt-8 rounded-md px-6 py-3 text-sm font-semibold transition-colors ${
                    i === 1
                      ? "bg-white text-orange-600 hover:bg-orange-50"
                      : "bg-orange-500 text-white hover:bg-orange-400"
                  }`}
                >
                  Book This Package
                </Link>
              </div>
            ))}
          </div>
        ) : null}

        <div className="mt-4 text-center">
          <Link
            href="/rates"
            className="text-xs font-semibold uppercase tracking-wide text-orange-500 underline underline-offset-4 hover:text-orange-400"
          >
            View Full Rates & Pricing →
          </Link>
        </div>

        {/* Minimum Group Sizes */}
        {minGroupData.length > 0 && (
          <div className="mt-14">
            <div className="text-center">
              <p className="mb-2 text-xs font-bold tracking-widest uppercase text-orange-500">
                Group Requirements
              </p>
              <h2 className="text-3xl font-bold uppercase text-black sm:text-4xl">
                Minimum Group Sizes
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-black/70 sm:text-base">
                Each camp has a minimum hunter count to reserve your week. Groups of 7+ hunters receive volume discount savings per head.
              </p>
            </div>

            <div className="mt-10 overflow-x-auto sm:mt-12">
              <table className="w-full min-w-105 rounded-xl border border-[#d7c8b6] bg-white text-sm">
                <thead>
                  <tr className="border-b border-[#d7c8b6] bg-[#f5efe7]">
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wide text-[#281703]">
                      Camp
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-bold uppercase tracking-wide text-[#281703]">
                      Min. Hunters
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-bold uppercase tracking-wide text-[#281703]">
                      Max. Hunters
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {minGroupData.map((row, i) => (
                    <tr key={i} className="border-b border-[#e8ddd2] last:border-0 hover:bg-[#fdf8f3]">
                      <td className="px-6 py-4 font-medium text-[#281703]">{row.name}</td>
                      <td className="px-6 py-4 text-center font-bold text-orange-600">
                        {row.minGroupSize}
                      </td>
                      <td className="px-6 py-4 text-center text-[#281703]/70">9</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-4 text-center text-xs text-[#281703]/60">
              Volume discounts apply for groups of 7, 8, 9, and 10+ hunters.{" "}
              <Link href="/discounts" className="underline hover:text-orange-500">
                See all discounts →
              </Link>
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
