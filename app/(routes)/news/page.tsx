import Image from "next/image";
import Link from "next/link";

import { prisma } from "@/lib/prisma";

async function getPosts() {
  try {
    return await prisma.newsPost.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return [];
  }
}

function BreadcrumbHomeIcon() {
  return (
    <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="shrink-0"
    >
      <path d="M12 3.172 3 10.2V21h6v-6h6v6h6V10.2l-9-7.028Z" />
    </svg>
  );
}

export const metadata = {
  title: "News & Events | UGUIDE South Dakota",
  description: "Stay up to date with the latest news and events from UGUIDE South Dakota Pheasant Hunting.",
};

export default async function NewsPage() {
  const posts = await getPosts();

  return (
    <main className="min-h-screen bg-[#E7DCCF]">
 

      {/* Hero */}
      <section className="AvailabilityImage px-4 py-10 flex flex-col justify-center text-center md:px-6 md:py-20">
        <p className="text-xs font-bold tracking-widest uppercase text-orange-500 mb-2">Updates</p>
        <h1 className="text-3xl font-bold text-black sm:text-4xl md:text-5xl">News &amp; Events</h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-black/70 sm:text-base">
          Stay up to date with the latest news, hunting reports, and events from UGUIDE South Dakota Pheasant Hunting.
        </p>
      </section>

      {/* Posts Grid */}
      <section className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-16">
        {posts.length === 0 ? (
          <p className="text-center text-black/50">No posts published yet. Check back soon.</p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/news/${post.slug}`}
                className="group rounded-2xl border border-black/10 bg-white shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)]"
              >
                <div className="overflow-hidden rounded-t-2xl bg-black/10">
                  {post.imageUrl ? (
                    <Image
                      src={post.imageUrl}
                      alt={post.title}
                      width={600}
                      height={300}
                      className="h-52 w-full object-cover transition duration-500 group-hover:scale-105"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-52 items-center justify-center text-black/20">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <p className="text-xs text-black/50">
                    {new Date(post.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                  <h2 className="mt-2 text-lg font-semibold leading-snug text-black group-hover:text-orange-500 transition">
                    {post.title}
                  </h2>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-black/70">
                    {post.description}
                  </p>
                  <span className="mt-4 inline-block text-sm font-medium text-orange-500 group-hover:underline">
                    Read More »
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
