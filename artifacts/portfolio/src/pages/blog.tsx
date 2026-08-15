import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { PageTransition } from "@/components/ui/PageTransition";
import { Footer } from "@/components/layout/Footer";
import { Calendar, ArrowRight } from "lucide-react";
import { useEffect } from "react";

const API = import.meta.env.VITE_API_URL || "";

type BlogPost = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  category: string | null;
  published: boolean;
  featured: boolean;
  author: string;
  createdAt: string;
};

const BLOG_HERO_BG =
  "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=900&q=75";

export default function BlogPage() {
  const { data: posts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: ["blog"],
    queryFn: async () => {
      const res = await fetch(`${API}/api/blog`);
      return res.json();
    },
  });

  useEffect(() => {
    document.title = "Blog — Azhar Engineering";
  }, []);

  const publishedPosts = posts.filter((p) => p.published);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <PageTransition>
      <div className="min-h-screen text-foreground">
        {/* Hero Banner */}
        <section className="relative pt-28 pb-16 px-6 overflow-hidden md:pt-44 md:pb-24">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${BLOG_HERO_BG})` }}
          />
          <div className="absolute inset-0 bg-black/72" />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.8) 100%)",
            }}
          />
          <div
            className="absolute inset-0 z-[1] pointer-events-none opacity-[0.04] mix-blend-overlay"
            style={{
              backgroundImage:
                'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'1\'/%3E%3C/svg%3E")',
              backgroundRepeat: "repeat",
            }}
          />

          <div className="relative max-w-screen-2xl mx-auto">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[11px] tracking-[0.45em] uppercase font-semibold mb-5"
              style={{
                color: "hsl(38,85%,68%)",
                textShadow: "0 1px 12px rgba(0,0,0,0.9)",
              }}
            >
              News & Insights
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold tracking-tight uppercase mb-6 text-white"
              style={{ textShadow: "0 2px 20px rgba(0,0,0,0.8)" }}
            >
              Blog
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-gray-200 max-w-2xl leading-relaxed"
              style={{ textShadow: "0 1px 8px rgba(0,0,0,0.7)" }}
            >
              Stay updated with the latest project news, industry insights, and company
              announcements from Azhar Engineering.
            </motion.p>
          </div>
        </section>

        {/* Blog Grid */}
        <div className="px-6 max-w-screen-2xl mx-auto py-16">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[16/9] bg-[hsl(220,18%,12%)] mb-4" />
                  <div className="h-4 bg-[hsl(220,15%,15%)] w-2/3 mb-2" />
                  <div className="h-3 bg-[hsl(220,15%,13%)] w-1/3" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
              {publishedPosts.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: i * 0.07,
                    duration: 0.65,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  whileHover={{ y: -6, transition: { duration: 0.25 } }}
                >
                  <Link href={`/blog/${post.slug}`} className="block group">
                    <div className="aspect-[16/9] relative overflow-hidden bg-[hsl(220,18%,12%)] mb-5 border border-[hsl(220,15%,20%)] group-hover:border-[hsl(38,72%,52%)] transition-colors duration-300">
                      {post.coverImage ? (
                        <motion.div
                          className="absolute inset-0 bg-cover bg-center"
                          style={{ backgroundImage: `url(${post.coverImage})` }}
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          viewport={{ once: true, margin: "100px" }}
                          whileHover={{ scale: 1.05 }}
                          transition={{
                            opacity: { duration: 0.4 },
                            scale: { duration: 0.8, ease: [0.33, 1, 0.68, 1] },
                          }}
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-end p-5 bg-gradient-to-br from-[hsl(220,18%,14%)] to-[hsl(220,18%,9%)]">
                          <span className="text-sm font-serif uppercase text-gray-600">
                            {post.title}
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-80 transition-opacity duration-400" />
                      {post.category && (
                        <span
                          className="absolute top-3 left-3 text-[9px] tracking-[0.2em] uppercase bg-black/75 px-2.5 py-1 backdrop-blur-sm"
                          style={{ color: "hsl(38,72%,62%)" }}
                        >
                          {post.category}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-base font-serif font-bold tracking-tight uppercase mb-2 text-white group-hover:text-[hsl(38,72%,58%)] transition-colors duration-200">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="text-xs text-gray-400 mb-3 line-clamp-2 leading-relaxed">
                          {post.excerpt}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
                          <Calendar size={10} />
                          <span>{formatDate(post.createdAt)}</span>
                        </div>
                        <span className="inline-flex items-center gap-1 text-[10px] tracking-[0.15em] uppercase text-[hsl(38,72%,52%)] group-hover:gap-2 transition-all">
                          Read More <ArrowRight size={10} />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}

              {publishedPosts.length === 0 && (
                <div className="col-span-full py-24 text-center">
                  <p className="text-gray-500 text-sm tracking-widest uppercase">
                    No blog posts available yet
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
        <Footer />
      </div>
    </PageTransition>
  );
}
