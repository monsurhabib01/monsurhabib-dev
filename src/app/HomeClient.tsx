"use client";

import React, { useEffect, useState } from "react";
import type { BlogPost } from "./page";

// ---- Editable content -------------------------------------------------
// Priority order reflects current focus: PWA/dev first (fastest to get
// hired for), automation second, fintech/AML as long-term differentiator.
const ROLE_WORDS = [
  "PWA Architecture",
  "N8N/AI Automations",
  "Secure Fintech Systems",
];

const PWA_CHECKS = [
  { label: "Web App Manifest", detail: "name, icons, theme configured" },
  { label: "Service Worker", detail: "registered · offline cache active" },
  { label: "Installable", detail: "passes Chrome install criteria" },
  { label: "Responsive", detail: "mobile, tablet, desktop tested" },
];

const TRANSACTIONS = [
  { id: "TX-88213", amount: "৳ 42,500", channel: "bKash", risk: "flagged", score: 0.94 },
  { id: "TX-88214", amount: "৳ 1,200", channel: "Nagad", risk: "safe", score: 0.06 },
  { id: "TX-88215", amount: "৳ 118,000", channel: "Bank Transfer", risk: "flagged", score: 0.88 },
  { id: "TX-88216", amount: "৳ 3,050", channel: "bKash", risk: "safe", score: 0.11 },
  { id: "TX-88217", amount: "৳ 76,400", channel: "Nagad", risk: "review", score: 0.62 },
];

// Update these after your next production Lighthouse run
const METRICS = [
  { label: "Performance", value: 96 },
  { label: "Accessibility", value: 90 },
  { label: "Best Practices", value: 96 },
  { label: "SEO", value: 91 },
];

const PROJECTS = [
  {
    title: "AML & Fraud Detection Toolkit",
    status: "Live · Gumroad",
    desc: "A 6-rule BFIU-calibrated transaction monitoring engine plus a LightGBM ML layer for bKash/Nagad-style MFS data. Includes a calibration doc explaining why global AML tools misfire on South Asian mobile-money patterns.",
    metric: "Pipeline: rules → risk score → ML → SAR export",
    tags: ["Python", "LightGBM", "Jupyter"],
    links: [
      { label: "GitHub", href: "https://github.com/monsurhabib01/synthetic-aml-detection" },
      { label: "Gumroad", href: "https://monsurhabib01.gumroad.com/l/pythonamltoolkit" },
    ],
  },
  {
    title: "Triageist — ER Triage Prediction",
    status: "Kaggle Hackathon 2026",
    desc: "Random Forest model predicting Emergency Severity Index (1–5) from patient vitals, built for a $10K-prize Kaggle hackathon. Documents its own limitations openly — synthetic data, class imbalance — instead of overselling the result.",
    metric: "Dataset: 5,000 synthetic patient records",
    tags: ["Python", "Scikit-learn", "EDA"],
    links: [{ label: "GitHub", href: "https://github.com/monsurhabib01/kaggle-competitions" }],
  },
  {
    title: "DA Freelance Toolkit",
    status: "Live · built with Claude API",
    desc: "An AI-powered growth engine for data-analytics freelancers: proposal generator, gig-SEO optimizer, rate calculator, and a client pipeline board — API key kept server-side, never exposed to the browser.",
    metric: "4 tools · React + Express + Claude API",
    tags: ["React", "Express", "Claude API"],
    links: [{ label: "GitHub", href: "https://github.com/monsurhabib01/da-freelance-toolkit" }],
  },
  {
    title: "Data Cleaning Projects",
    status: "Freelance portfolio",
    desc: "Three real cleanup jobs — B2B contact deduplication for CRM import, workforce data filtering, and retail sales normalization — each with the messy input and the clean, audit-ready output.",
    metric: "821 → 464 clean rows · 1,280-row dataset cleaned",
    tags: ["Python", "Pandas", "Excel"],
    links: [{ label: "GitHub", href: "https://github.com/monsurhabib01/data-cleaning-projects" }],
  },
];
// -------------------------------------------------------------------------

function useTypedWord(words: string[]) {
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIndex];
    const speed = deleting ? 40 : 80;

    const timeout = setTimeout(() => {
      if (!deleting) {
        if (text.length < current.length) {
          setText(current.slice(0, text.length + 1));
        } else {
          setTimeout(() => setDeleting(true), 1200);
        }
      } else {
        if (text.length > 0) {
          setText(current.slice(0, text.length - 1));
        } else {
          setDeleting(false);
          setWordIndex((i) => (i + 1) % words.length);
        }
      }
    }, speed);

    return () => clearTimeout(timeout);
  }, [text, deleting, wordIndex, words]);

  return text;
}

function riskColor(risk: string) {
  if (risk === "flagged") return "text-red-400 bg-red-500/10 border-red-500/30";
  if (risk === "review") return "text-amber-400 bg-amber-500/10 border-amber-500/30";
  return "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
}

function BrowserChrome({ url, live = true }: { url: string; live?: boolean }) {
  return (
    <div className="flex items-center gap-2 border-b border-slate-800 px-4 py-3">
      <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
      <span className="h-2.5 w-2.5 rounded-full bg-amber-500/70" />
      <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
      <span className="ml-3 text-xs font-medium text-slate-500">{url}</span>
      {live && (
        <span className="ml-auto flex items-center gap-1.5 text-xs text-emerald-400">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          live
        </span>
      )}
    </div>
  );
}

function PWAInstallCard() {
  const [visibleCount, setVisibleCount] = useState(0);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    if (installed) {
      const t = setTimeout(() => {
        setInstalled(false);
        setVisibleCount(0);
      }, 3000);
      return () => clearTimeout(t);
    }
    if (visibleCount >= PWA_CHECKS.length) {
      const t = setTimeout(() => setInstalled(true), 500);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setVisibleCount((c) => c + 1), 500);
    return () => clearTimeout(t);
  }, [visibleCount, installed]);

  return (
    <div className="w-full rounded-2xl border border-slate-800 bg-slate-900/80 shadow-2xl shadow-emerald-500/5 backdrop-blur">
      <BrowserChrome url="monsur.dev" />

      <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
        <span className="text-sm text-slate-300">Add Monsur.Dev to Home Screen</span>
        <span
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
            installed
              ? "bg-emerald-500/10 text-emerald-400"
              : "bg-emerald-500 text-slate-950"
          }`}
        >
          {installed ? "✓ Installed" : "Install"}
        </span>
      </div>

      <div className="space-y-2 p-4">
        {PWA_CHECKS.map((c, i) => (
          <div
            key={c.label}
            className={`flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2.5 text-sm transition-opacity duration-300 ${
              i < visibleCount ? "opacity-100" : "opacity-0"
            }`}
          >
            <span className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-emerald-500/10 text-xs text-emerald-400">
              ✓
            </span>
            <div className="flex flex-col">
              <span className="text-slate-200">{c.label}</span>
              <span className="text-xs text-slate-500">{c.detail}</span>
            </div>
          </div>
        ))}
        <div
          className={`flex items-center gap-2 px-1 py-2 text-xs text-slate-500 transition-opacity duration-300 ${
            visibleCount < PWA_CHECKS.length ? "opacity-100" : "opacity-0"
          }`}
        >
          <span className="h-1.5 w-1.5 animate-ping rounded-full bg-slate-500" />
          checking install criteria…
        </div>
      </div>
    </div>
  );
}

function FraudDashboardCard() {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    if (visibleCount >= TRANSACTIONS.length) {
      const t = setTimeout(() => setVisibleCount(0), 3000);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setVisibleCount((c) => c + 1), 550);
    return () => clearTimeout(t);
  }, [visibleCount]);

  const flaggedCount = TRANSACTIONS.slice(0, visibleCount).filter(
    (t) => t.risk === "flagged"
  ).length;

  return (
    <div className="w-full rounded-2xl border border-slate-800 bg-slate-900/80 shadow-2xl shadow-emerald-500/5 backdrop-blur">
      <BrowserChrome url="fraud-monitor.live" />
      <div className="border-b border-slate-800 px-4 py-1.5 text-[10px] uppercase tracking-wider text-slate-600">
        Simulated data — illustrative case study
      </div>

      {/* stats row */}
      <div className="grid grid-cols-4 gap-px border-b border-slate-800 bg-slate-800/50">
        <div className="bg-slate-900/80 px-4 py-3">
          <div className="text-xs text-slate-500">Scanned</div>
          <div className="text-lg font-semibold text-slate-100">{visibleCount}</div>
        </div>
        <div className="bg-slate-900/80 px-4 py-3">
          <div className="text-xs text-slate-500">Flagged</div>
          <div className="text-lg font-semibold text-red-400">{flaggedCount}</div>
        </div>
        <div className="bg-slate-900/80 px-4 py-3">
          <div className="text-xs text-slate-500">Avg. Latency</div>
          <div className="text-lg font-semibold text-emerald-400">82ms</div>
        </div>
        <div className="bg-slate-900/80 px-4 py-3">
          <div className="text-xs text-slate-500">Est. Precision</div>
          <div className="text-lg font-semibold text-sky-400">94%</div>
        </div>
      </div>

      {/* transaction feed */}
      <div className="space-y-2 p-4">
        {TRANSACTIONS.map((tx, i) => (
          <div
            key={tx.id}
            className={`flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm transition-opacity duration-300 ${
              i < visibleCount ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="flex flex-col">
              <span className="font-mono text-xs text-slate-500">{tx.id}</span>
              <span className="text-slate-200">
                {tx.amount} <span className="text-slate-500">· {tx.channel}</span>
              </span>
            </div>
            <span
              className={`rounded-full border px-2 py-1 text-xs font-medium capitalize ${riskColor(
                tx.risk
              )}`}
            >
              {tx.risk} · {tx.score.toFixed(2)}
            </span>
          </div>
        ))}
        <div
          className={`flex items-center gap-2 px-1 py-2 text-xs text-slate-500 transition-opacity duration-300 ${
            visibleCount < TRANSACTIONS.length ? "opacity-100" : "opacity-0"
          }`}
        >
          <span className="h-1.5 w-1.5 animate-ping rounded-full bg-slate-500" />
          scanning next transaction…
        </div>
      </div>

      <div className="border-t border-slate-800 px-4 py-3 text-[11px] text-slate-500">
        Score &gt; 0.85 = high-risk (auto-flag) · 0.5–0.85 = manual review · &lt; 0.5 = safe
      </div>

      <div className="border-t border-slate-800 px-4 py-3">
        <a
          href="https://github.com/monsurhabib01?tab=repositories"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-medium text-emerald-400 transition hover:text-emerald-300"
        >
          See technical breakdown →
        </a>
      </div>
    </div>
  );
}

function WorkflowStrip({ variant }: { variant: "pwa" | "fraud" }) {
  const nodes =
    variant === "pwa"
      ? ["Push", "Build", "Deploy", "Cache / SW"]
      : ["Webhook", "AML Rules", "Risk Score", "Alert / N8N"];
  return (
    <div className="mt-4 flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-4">
      {nodes.map((n, i) => (
        <React.Fragment key={n}>
          <div className="flex flex-col items-center gap-1.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
            </div>
            <span className="text-[10px] text-slate-500">{n}</span>
          </div>
          {i < nodes.length - 1 && (
            <div className="mx-1 mb-4 h-px flex-1 bg-gradient-to-r from-emerald-500/40 to-slate-700" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

function ProjectCard({
  title,
  status,
  desc,
  metric,
  tags,
  links,
}: {
  title: string;
  status: string;
  desc: string;
  metric: string;
  tags: string[];
  links: { label: string; href: string }[];
}) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 transition hover:border-slate-700">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold text-slate-100">{title}</h3>
        <span className="whitespace-nowrap rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-[10px] font-medium text-emerald-400">
          {status}
        </span>
      </div>
      <p className="text-sm leading-relaxed text-slate-400">{desc}</p>
      <div className="border-t border-slate-800 pt-3 font-mono text-xs text-slate-500">
        {metric}
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map((t) => (
          <span
            key={t}
            className="rounded-md border border-slate-800 px-2 py-1 text-[11px] text-slate-400"
          >
            {t}
          </span>
        ))}
      </div>
      <div className="flex gap-4 pt-1">
        {links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-emerald-400 transition hover:text-emerald-300"
          >
            {l.label} →
          </a>
        ))}
      </div>
    </div>
  );
}

function ProofCard({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-slate-800 bg-slate-900/60 p-5 ${className}`}
    >
      <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
        {title}
      </div>
      {children}
    </div>
  );
}

// TODO: replace with your real Formspree endpoint.
// Sign up free at https://formspree.io, create a form, and paste its
// ID here (looks like "xyzabcde"). Until then this posts nowhere.
const WAITLIST_FORM_ID = "YOUR_FORM_ID";

function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch(`https://formspree.io/f/${WAITLIST_FORM_ID}`, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p className="text-sm font-medium text-emerald-400">
        You&apos;re on the list — I&apos;ll email you at launch.
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row"
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@company.com"
        className="w-full flex-1 rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-lg bg-emerald-500 px-6 py-3 text-sm font-medium text-slate-950 transition hover:bg-emerald-400 disabled:opacity-60"
      >
        {status === "loading" ? "Joining…" : "Join Waitlist"}
      </button>
      {status === "error" && (
        <p className="text-xs text-red-400 sm:absolute sm:-bottom-6">
          Something went wrong — try again, or email hello@aitipseveryday.com directly.
        </p>
      )}
    </form>
  );
}

function WritingCard({ title, url, date }: BlogPost) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col gap-2 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 transition hover:border-slate-700"
    >
      <span className="text-xs font-mono text-slate-500">{date}</span>
      <h3 className="text-sm font-semibold leading-snug text-slate-100">
        {title}
      </h3>
      <span className="mt-auto pt-2 text-xs font-medium text-emerald-400">
        Read on the blog →
      </span>
    </a>
  );
}

export default function HomeClient({ posts }: { posts: BlogPost[] }) {
  const typed = useTypedWord(ROLE_WORDS);
  const [tab, setTab] = useState<"pwa" | "fraud">("pwa");
  const [copied, setCopied] = useState(false);

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100">
      <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-900/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-12 lg:px-20">
          <a href="#" className="text-sm font-bold tracking-tight text-slate-100">
            Monsur<span className="text-emerald-400">.dev</span>
          </a>
          <nav className="hidden items-center gap-8 text-sm text-slate-400 sm:flex">
            <a href="#proof" className="transition hover:text-slate-200">
              Work
            </a>
            <a href="#projects" className="transition hover:text-slate-200">
              Projects
            </a>
            {posts.length > 0 && (
              <a href="#writing" className="transition hover:text-slate-200">
                Writing
              </a>
            )}
            <a
              href="https://aitipseveryday.com"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-slate-200"
            >
              Blog
            </a>
          </nav>
          <a
            href="#contact"
            className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-emerald-400"
          >
            Let&apos;s Talk
          </a>
        </div>
      </header>

      <div className="px-6 py-16 md:px-12 lg:px-20">
      {/* HERO */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-8">
        {/* left: copy */}
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-800/40 px-3 py-1 text-xs font-medium uppercase tracking-widest text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Available for freelance & remote work
          </div>

          <h1 className="bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl">
            Full-Stack Engineer Building PWAs, AI Automations &amp; Secure
            Systems.
          </h1>

          <p className="mt-5 h-7 font-mono text-lg text-slate-400">
            <span className="text-slate-300">{"> "}</span>
            {typed}
            <span className="ml-0.5 animate-pulse text-emerald-400">▌</span>
          </p>

          <p className="mt-4 max-w-md text-slate-400">
            I build installable PWAs that load instantly, automate workflows
            with N8N, and ship fraud-detection systems for fintechs that need
            to harden compliance.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="https://github.com/monsurhabib01"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-emerald-500 px-6 py-3 font-medium text-slate-950 transition hover:bg-emerald-400"
            >
              View Projects
            </a>
            <a
              href="https://aitipseveryday.com"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-slate-700 bg-slate-800/50 px-6 py-3 font-medium text-slate-200 transition hover:bg-slate-800"
            >
              Read Blog Archive
            </a>
          </div>
        </div>

        {/* right: live mockup with tab switcher */}
        <div>
          <div className="mb-3 flex gap-2">
            <button
              onClick={() => setTab("pwa")}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                tab === "pwa"
                  ? "bg-emerald-500 text-slate-950"
                  : "bg-slate-800/60 text-slate-400 hover:text-slate-200"
              }`}
            >
              PWA Demo
            </button>
            <button
              onClick={() => setTab("fraud")}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                tab === "fraud"
                  ? "bg-emerald-500 text-slate-950"
                  : "bg-slate-800/60 text-slate-400 hover:text-slate-200"
              }`}
            >
              Fraud Detection (Case Study)
            </button>
          </div>

          {tab === "pwa" ? <PWAInstallCard /> : <FraudDashboardCard />}
          <WorkflowStrip variant={tab} />
          {tab === "pwa" && (
            <a
              href="https://bus-fare-bd.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-emerald-400 transition hover:text-emerald-300"
            >
              Try the live PWA →
            </a>
          )}
        </div>
      </section>

      {/* PROOF / BENTO GRID */}
      <section id="proof" className="mx-auto mt-24 max-w-6xl scroll-mt-20">
        <div className="mb-8 text-center">
          <div className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
            Proof, not promises
          </div>
          <h2 className="mt-2 text-2xl font-bold text-slate-100 sm:text-3xl">
            What that actually looks like
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {/* lighthouse scores - spans 2, leads because PWA is the current focus */}
          <ProofCard title="Lighthouse Audit — This Site" className="md:col-span-2">
            <div className="grid grid-cols-4 gap-3">
              {METRICS.map((m) => (
                <div key={m.label} className="text-center">
                  <div className="text-2xl font-bold text-emerald-400">
                    {m.value}
                  </div>
                  <div className="mt-1 text-[10px] text-slate-500">{m.label}</div>
                </div>
              ))}
            </div>
          </ProofCard>

          {/* PWA */}
          <ProofCard title="PWA Ready">
            <div className="flex items-center gap-2 text-slate-200">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                ⬇
              </span>
              <span className="text-sm">Installable · Offline-capable</span>
            </div>
          </ProofCard>

          {/* Automation */}
          <ProofCard title="Automation">
            <div className="text-sm text-slate-200">
              N8N workflows: webhook → rules → alerting.
            </div>
          </ProofCard>

          {/* Gumroad product */}
          <ProofCard title="Shipped Product" className="md:col-span-2">
            <a
              href="https://monsurhabib01.gumroad.com/l/pythonamltoolkit"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-slate-200 underline decoration-slate-700 underline-offset-4 transition hover:text-emerald-400 hover:decoration-emerald-400"
            >
              Python AML &amp; Fraud Detection Toolkit
            </a>
            <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
              <span>Live on Gumroad</span>
              <a
                href="https://monsurhabib01.github.io"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-emerald-400 transition hover:text-emerald-300"
              >
                Browse all projects on GitHub →
              </a>
            </div>
          </ProofCard>

          {/* domain - long-term focus, placed last intentionally */}
          <ProofCard title="Long-Term Specialization" className="md:col-span-2">
            <div className="text-sm text-slate-200">
              Deepening expertise in Bangladesh&apos;s MFS ecosystem — bKash,
              Nagad, BFIU-aligned compliance — as a longer-horizon focus
              alongside client delivery work.
            </div>
          </ProofCard>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="mx-auto mt-24 max-w-6xl scroll-mt-20">
        <div className="mb-8 text-center">
          <div className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
            Shipped, not shelved
          </div>
          <h2 className="mt-2 text-2xl font-bold text-slate-100 sm:text-3xl">
            Selected work
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {PROJECTS.map((p) => (
            <ProjectCard key={p.title} {...p} />
          ))}
        </div>
      </section>

      {/* COMING SOON — waitlist capture for the hosted AML API */}
      <section className="mx-auto mt-24 max-w-6xl scroll-mt-20">
        <div className="rounded-2xl border border-emerald-500/20 bg-slate-900/60 p-8 text-center sm:p-12">
          <div className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
            Coming soon
          </div>
          <h2 className="mt-2 text-2xl font-bold text-slate-100 sm:text-3xl">
            Hosted AML Monitoring API
          </h2>
          <p className="mx-auto mt-3 max-w-md text-slate-400">
            The 6-rule engine from the toolkit, as a drop-in API endpoint —
            send a transaction, get a risk score back. No infra to run
            yourself.
          </p>
          <div className="mt-8">
            <WaitlistForm />
          </div>
        </div>
      </section>

      {/* RECENT WRITING — populated at build time from the Blogger feed.
          Renders nothing if the fetch failed or the feed was empty, so a
          blog outage never breaks the deploy. */}
      {posts.length > 0 && (
        <section id="writing" className="mx-auto mt-24 max-w-6xl scroll-mt-20">
          <div className="mb-8 text-center">
            <div className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
              From the blog
            </div>
            <h2 className="mt-2 text-2xl font-bold text-slate-100 sm:text-3xl">
              Recent Writing
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {posts.map((p) => (
              <WritingCard key={p.url} {...p} />
            ))}
          </div>

          <div className="mt-6 text-center">
            <a
              href="https://aitipseveryday.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-emerald-400 transition hover:text-emerald-300"
            >
              Read the full archive →
            </a>
          </div>
        </section>
      )}

      {/* CONTACT / HIRE */}
      <section id="contact" className="mx-auto mt-24 max-w-6xl scroll-mt-20">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 text-center sm:p-12">
          <div className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
            Let&apos;s work together
          </div>
          <h2 className="mt-2 text-2xl font-bold text-slate-100 sm:text-3xl">
            Have a project in mind?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-slate-400">
            Open for freelance and remote work — PWA builds, N8N/AI
            automations, and fintech fraud-detection systems.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="mailto:hello@aitipseveryday.com"
              onClick={() => {
                if (typeof navigator !== "undefined" && navigator.clipboard) {
                  navigator.clipboard
                    .writeText("hello@aitipseveryday.com")
                    .catch(() => {});
                }
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="rounded-lg bg-emerald-500 px-6 py-3 font-medium text-slate-950 transition hover:bg-emerald-400"
            >
              {copied ? "Copied: hello@aitipseveryday.com" : "Email Me"}
            </a>
            <a
              href="https://wa.me/8801675115659"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-slate-700 bg-slate-800/50 px-6 py-3 font-medium text-slate-200 transition hover:bg-slate-800"
            >
              WhatsApp
            </a>
            <a
              href="https://www.linkedin.com/in/monsur-habib/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-slate-700 bg-slate-800/50 px-6 py-3 font-medium text-slate-200 transition hover:bg-slate-800"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </section>
      </div>
    </main>
  );
}
