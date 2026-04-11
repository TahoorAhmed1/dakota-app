import Image from "next/image";
import Link from "next/link";

import { prisma } from "@/lib/prisma";

async function getLatestPosts() {
  try {
    return await prisma.newsPost.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
      take: 3,
      select: { id: true, slug: true, title: true, description: true, imageUrl: true, createdAt: true },
    });
  } catch {
    return [];
  }
}

export default async function LatestNews() {
  const posts = await getLatestPosts();

  if (posts.length === 0) return null;

  return (
    <section className="w-full bg-[#E7DCCF] px-4 py-8 md:px-6 md:py-16">
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-xs tracking-[3px] text-orange-500 uppercase mb-3 font-medium">Updates</p>

        <h2 className="text-3xl font-bold text-[#2b2b2b] sm:text-4xl">
          Latest News &amp; Events
        </h2>

        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-[#4b4b4b] sm:text-base">
          UGUIDE South Dakota Pheasant Hunting is South Dakota&apos;s leader in wild-reared self guided
          and unguided pheasant hunting.
        </p>

        <div className="mt-10 grid gap-6 text-left sm:mt-12 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link key={post.id} href={`/news/${post.slug}`} className="group rounded-sm">
              <div className="overflow-hidden rounded-sm bg-black/10">
                {post.imageUrl ? (
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    width={600}
                    height={210}
                    className="h-52.5 w-full object-cover transition duration-500 group-hover:scale-105"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-52 items-center justify-center text-black/20">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>

              <p className="text-xs text-gray-600 mt-4">
                {new Date(post.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}{" "}
                by UGUIDE South Dakota
              </p>

              <h3 className="text-lg font-semibold text-[#2b2b2b] mt-2 leading-snug group-hover:text-orange-500 transition">
                {post.title}
              </h3>

              <p className="text-sm text-gray-700 mt-3 leading-relaxed line-clamp-3">
                {post.description}
              </p>

              <span className="mt-4 inline-block text-sm font-medium text-orange-500 group-hover:underline">
                Read More 
              </span>
            </Link>
          ))}
        </div>

    
      </div>
    </section>
  );
}