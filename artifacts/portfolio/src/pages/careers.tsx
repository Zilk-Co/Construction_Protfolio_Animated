import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import { motion } from "framer-motion";
import { PageTransition } from "@/components/ui/PageTransition";
import { Footer } from "@/components/layout/Footer";
import { MapPin, Briefcase, Clock, ArrowRight, ArrowLeft, Mail } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "";

type Job = {
  id: number;
  title: string;
  slug: string;
  department: string | null;
  location: string | null;
  type: string;
  description: string;
  requirements: string | null;
  published: boolean;
  createdAt: string;
};

function usePublishedJobs() {
  return useQuery<Job[]>({
    queryKey: ["public-jobs"],
    queryFn: async () => {
      const res = await fetch(`${API}/api/jobs`);
      return res.json();
    },
  });
}

function useJobBySlug(slug: string) {
  return useQuery<Job>({
    queryKey: ["public-job", slug],
    queryFn: async () => {
      const res = await fetch(`${API}/api/jobs/${slug}`);
      if (!res.ok) throw new Error("Not found");
      return res.json();
    },
  });
}

const TYPE_COLORS: Record<string, string> = {
  "Full-time": "border-emerald-800 text-emerald-400",
  "Part-time": "border-blue-800 text-blue-400",
  Contract: "border-amber-800 text-amber-400",
};

export default function Careers() {
  return (
    <PageTransition>
      <div className="min-h-screen text-foreground">
        {/* Hero */}
        <section className="pt-32 pb-20 px-6">
          <div className="max-w-screen-2xl mx-auto">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[10px] tracking-[0.4em] uppercase text-[hsl(38,72%,52%)] mb-3"
            >
              Join Our Team
            </motion.p>
            <div className="w-8 h-px bg-[hsl(38,72%,52%)] mb-6" />
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-4xl md:text-6xl font-serif font-bold uppercase tracking-tight mb-6"
            >
              Build the Future
              <span className="block" style={{ color: "hsl(38,72%,52%)" }}>
                With Us
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-sm text-[hsl(220,12%,55%)] max-w-xl leading-relaxed"
            >
              We're looking for talented individuals who share our passion for
              excellence in engineering and construction. Explore our current
              openings and take the next step in your career.
            </motion.p>
          </div>
        </section>

        {/* Jobs listing */}
        <JobsList />

        <Footer />
      </div>
    </PageTransition>
  );
}

function JobsList() {
  const { data: jobs = [], isLoading } = usePublishedJobs();

  if (isLoading) {
    return (
      <section className="pb-24 px-6">
        <div className="max-w-screen-2xl mx-auto">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-[hsl(220,18%,11%)] border border-[hsl(220,15%,18%)] animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (jobs.length === 0) {
    return (
      <section className="pb-24 px-6">
        <div className="max-w-screen-2xl mx-auto">
          <div className="border border-[hsl(220,15%,18%)] bg-[hsl(220,18%,10%)] p-12 text-center">
            <Briefcase size={32} className="mx-auto mb-4 text-[hsl(220,12%,25%)]" />
            <p className="text-sm text-[hsl(220,12%,55%)] mb-2">No open positions at the moment</p>
            <p className="text-xs text-[hsl(220,12%,40%)]">
              Check back soon or send your resume to{" "}
              <a href="mailto:careers@azharengineering.com" className="text-[hsl(38,72%,52%)] hover:underline">
                careers@azharengineering.com
              </a>
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pb-24 px-6">
      <div className="max-w-screen-2xl mx-auto">
        <div className="space-y-4">
          {jobs.map((job, i) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.5 }}
            >
              <Link
                href={`/careers/${job.slug}`}
                className="block border border-[hsl(220,15%,18%)] bg-[hsl(220,18%,10%)] p-6 hover:border-[hsl(38,72%,52%)] transition-all duration-300 group"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif font-bold text-lg uppercase tracking-tight mb-2 group-hover:text-[hsl(38,72%,52%)] transition-colors">
                      {job.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-[hsl(220,12%,50%)]">
                      {job.department && (
                        <span className="inline-flex items-center gap-1.5">
                          <Briefcase size={11} />
                          {job.department}
                        </span>
                      )}
                      {job.location && (
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin size={11} />
                          {job.location}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1.5">
                        <Clock size={11} />
                        {job.type}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-[9px] tracking-[0.2em] uppercase px-3 py-1 border rounded-sm ${
                        TYPE_COLORS[job.type] || "border-[hsl(220,15%,25%)] text-[hsl(220,12%,55%)]"
                      }`}
                    >
                      {job.type}
                    </span>
                    <ArrowRight
                      size={14}
                      className="text-[hsl(220,12%,35%)] group-hover:text-[hsl(38,72%,52%)] group-hover:translate-x-1 transition-all"
                    />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function JobDetail() {
  const { slug } = useParams();
  const { data: job, isLoading, error } = useJobBySlug(slug || "");

  if (isLoading) {
    return (
      <PageTransition>
        <div className="min-h-screen text-foreground">
          <div className="pt-32 pb-24 px-6">
            <div className="max-w-screen-lg mx-auto">
              <div className="h-8 w-48 bg-[hsl(220,18%,11%)] animate-pulse mb-8" />
              <div className="h-12 w-96 bg-[hsl(220,18%,11%)] animate-pulse mb-6" />
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-4 bg-[hsl(220,18%,11%)] animate-pulse" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  if (error || !job) {
    return (
      <PageTransition>
        <div className="min-h-screen text-foreground flex items-center justify-center">
          <div className="text-center">
            <p className="text-sm text-[hsl(220,12%,55%)] mb-4">Job not found</p>
            <Link href="/careers" className="text-xs tracking-[0.2em] uppercase text-[hsl(38,72%,52%)] hover:underline">
              View all openings
            </Link>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen text-foreground">
        <section className="pt-32 pb-24 px-6">
          <div className="max-w-screen-lg mx-auto">
            <Link
              href="/careers"
              className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-[hsl(220,12%,50%)] hover:text-[hsl(38,72%,52%)] transition-colors mb-8"
            >
              <ArrowLeft size={13} /> Back to Careers
            </Link>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span
                  className={`text-[9px] tracking-[0.2em] uppercase px-3 py-1 border rounded-sm ${
                    TYPE_COLORS[job.type] || "border-[hsl(220,15%,25%)] text-[hsl(220,12%,55%)]"
                  }`}
                >
                  {job.type}
                </span>
                {job.department && (
                  <span className="text-[10px] tracking-[0.15em] uppercase text-[hsl(220,12%,45%)]">
                    {job.department}
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-5xl font-serif font-bold uppercase tracking-tight mb-6">
                {job.title}
              </h1>

              <div className="flex flex-wrap items-center gap-5 text-sm text-[hsl(220,12%,50%)] mb-10 pb-8 border-b border-[hsl(220,15%,18%)]">
                {job.location && (
                  <span className="inline-flex items-center gap-2">
                    <MapPin size={14} className="text-[hsl(38,72%,52%)]" />
                    {job.location}
                  </span>
                )}
                <span className="inline-flex items-center gap-2">
                  <Clock size={14} className="text-[hsl(38,72%,52%)]" />
                  {job.type}
                </span>
              </div>

              {/* Description */}
              <div className="mb-10">
                <h2 className="text-lg font-serif font-bold uppercase tracking-tight mb-4">About the Role</h2>
                <div className="text-sm text-[hsl(220,12%,60%)] leading-relaxed whitespace-pre-line">
                  {job.description}
                </div>
              </div>

              {/* Requirements */}
              {job.requirements && (
                <div className="mb-12">
                  <h2 className="text-lg font-serif font-bold uppercase tracking-tight mb-4">Requirements</h2>
                  <div className="text-sm text-[hsl(220,12%,60%)] leading-relaxed whitespace-pre-line">
                    {job.requirements}
                  </div>
                </div>
              )}

              {/* Apply CTA */}
              <div className="border border-[hsl(220,15%,18%)] bg-[hsl(220,18%,10%)] p-8 text-center">
                <h3 className="font-serif font-bold text-lg uppercase tracking-tight mb-2">Interested?</h3>
                <p className="text-xs text-[hsl(220,12%,50%)] mb-6">
                  Send your resume and a cover letter to apply for this position.
                </p>
                <a
                  href={`mailto:careers@azharengineering.com?subject=Application: ${job.title}`}
                  className="inline-flex items-center gap-3 bg-[hsl(38,72%,52%)] text-[hsl(220,18%,9%)] px-8 py-3.5 text-xs tracking-[0.25em] uppercase font-bold hover:bg-[hsl(38,72%,60%)] transition-colors"
                >
                  <Mail size={13} />
                  Apply via Email
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </PageTransition>
  );
}
