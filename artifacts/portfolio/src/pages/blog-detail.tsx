import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Link, useParams } from "wouter";
import { PageTransition } from "@/components/ui/PageTransition";
import { Footer } from "@/components/layout/Footer";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { useEffect } from "react";

const API = import.meta.env.VITE_API_URL || "";

type BlogPost = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  coverImage: string | null;
  category: string | null;
  published: boolean;
  featured: boolean;
  author: string;
  createdAt: string;
  updatedAt: string;
};

export default function BlogDetail() {
  const { slug } = useParams();
  const { data: post, isLoading } = useQuery<BlogPost>({
    queryKey: ["blog-detail", slug],
    queryFn: async () => {
      const res = await fetch(`${API}/api/blog/${slug}`);
      if (!res.ok) throw new Error("Post not found");
      return res.json();
    },
    enabled: !!slug,
  });

  useEffect(() => {
    document.title = `${post?.title ?? "Blog Post"} — Azhar Engineering`;
  }, [post?.title]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <PageTransition>
        <div className="min-h-screen text-foreground">
          <div className="pt-32 pb-16 px-6 max-w-screen-lg mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="h-4 bg-[hsl(220,15%,15%)] w-1/4" />
              <div className="h-8 bg-[hsl(220,15%,15%)] w-2/3" />
              <div className="aspect-[16/9] bg-[hsl(220,15%,15%)]" />
              <div className="space-y-3">
                <div className="h-4 bg-[hsl(220,15%,15%)] w-full" />
                <div className="h-4 bg-[hsl(220,15%,15%)] w-5/6" />
                <div className="h-4 bg-[hsl(220,15%,15%)] w-4/6" />
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </PageTransition>
    );
  }

  if (!post) {
    return (
      <PageTransition>
        <div className="min-h-screen text-foreground flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-serif mb-4">Post Not Found</h1>
            <Link
              href="/blog"
              className="text-[hsl(38,72%,52%)] hover:text-[hsl(38,72%,62%)] text-sm uppercase tracking-widest"
            >
              Back to Blog
            </Link>
          </div>
        </div>
        <Footer />
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen text-foreground">
        {/* Hero */}
        <section className="relative pt-28 pb-12 px-6 overflow-hidden md:pt-44 md:pb-16">
          {post.coverImage && (
            <>
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${post.coverImage})` }}
              />
              <div className="absolute inset-0 bg-black/72" />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.85) 100%)",
                }}
              />
            </>
          )}

          <div className="relative max-w-screen-lg mx-auto">
            {/* Back Link */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-8"
            >
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-[hsl(38,72%,52%)] hover:text-[hsl(38,72%,62%)] transition-colors"
              >
                <ArrowLeft size={14} />
                Back to Blog
              </Link>
            </motion.div>

            {/* Category */}
            {post.category && (
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-block text-[10px] tracking-[0.25em] uppercase px-3 py-1 mb-4 border"
                style={{
                  color: "hsl(38,85%,68%)",
                  borderColor: "hsl(38,72%,52%/40%)",
                  backgroundColor: "hsl(38,72%,52%/10%)",
                }}
              >
                {post.category}
              </motion.span>
            )}

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold tracking-tight uppercase mb-6 text-white"
              style={{ textShadow: "0 2px 20px rgba(0,0,0,0.8)" }}
            >
              {post.title}
            </motion.h1>

            {/* Meta */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-6 text-sm text-gray-300"
            >
              <div className="flex items-center gap-2">
                <User size={14} className="text-[hsl(38,72%,52%)]" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-[hsl(38,72%,52%)]" />
                <span>{formatDate(post.createdAt)}</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Article Content */}
        <article className="px-6 max-w-screen-lg mx-auto py-12 md:py-16">
          {post.coverImage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="aspect-[16/9] overflow-hidden border border-[hsl(220,15%,20%)] mb-12"
            >
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </motion.div>
          )}

          {/* Excerpt */}
          {post.excerpt && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-gray-300 leading-relaxed mb-8 font-serif italic border-l-2 border-[hsl(38,72%,52%)] pl-6"
            >
              {post.excerpt}
            </motion.p>
          )}

          {/* Content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="prose prose-invert max-w-none"
          >
            {post.content ? (
              post.content.split("\n\n").map((paragraph, i) => (
                <p
                  key={i}
                  className="text-[hsl(220,12%,70%)] leading-[1.85] mb-6 text-sm md:text-base"
                >
                  {paragraph}
                </p>
              ))
            ) : (
              <p className="text-[hsl(220,12%,40%)] italic">No content available.</p>
            )}
          </motion.div>

          {/* Back to Blog */}
          <div className="mt-16 pt-8 border-t border-[hsl(220,15%,20%)]">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-[hsl(38,72%,52%)] hover:text-[hsl(38,72%,62%)] transition-colors"
            >
              <ArrowLeft size={14} />
              Back to All Posts
            </Link>
          </div>
        </article>

        <Footer />
      </div>
    </PageTransition>
  );
}
