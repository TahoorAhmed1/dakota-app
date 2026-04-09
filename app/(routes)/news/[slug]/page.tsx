import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";

async function getPost(slug: string) {
  try {
    return await prisma.newsPost.findFirst({ where: { slug, isPublished: true } });
  } catch {
    return null;
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

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Post Not Found" };
  return {
    title: `${post.title} | UGUIDE South Dakota`,
    description: post.description.slice(0, 160),
  };
}

export default async function NewsPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) notFound();

  return (
    <main className="min-h-screen bg-[#fff7ef]">


      <article className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20">
        {post.imageUrl ? (
          <div className="mb-8 overflow-hidden rounded-2xl">
            <Image
              src={post.imageUrl}
              alt={post.title}
              width={1200}
              height={500}
              className="h-72 w-full object-cover sm:h-96"
              unoptimized
              priority
            />
          </div>
        ) : null}

        <div className="mb-6 flex flex-wrap items-center gap-4">
          <p className="text-sm text-black/50">
            Published{" "}
            {new Date(post.createdAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
          {post.updatedAt !== post.createdAt ? (
            <p className="text-sm text-black/40">
              Updated{" "}
              {new Date(post.updatedAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          ) : null}
        </div>

        <h1 className="text-3xl font-bold leading-tight text-black sm:text-4xl">{post.title}</h1>

        <div className="mt-8 whitespace-pre-wrap text-base leading-8 text-black/80">
          {post.description}
        </div>

        <div className="mt-12 border-t border-black/10 pt-8">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-sm font-medium text-orange-500 hover:underline"
          >
            ← Back to News &amp; Events
          </Link>
        </div>
      </article>
    </main>
  );
}
