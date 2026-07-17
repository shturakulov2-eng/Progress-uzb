"use client";

import {
  ArrowUpRight,
  BarChart3,
  BrainCircuit,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  CircleHelp,
  Clapperboard,
  Globe2,
  Landmark,
  LayoutTemplate,
  Megaphone,
  Menu,
  MessageSquareQuote,
  Palette,
  PhoneCall,
  ShieldCheck,
  Sparkles,
  Star,
  Workflow,
  X,
} from "lucide-react";
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { ComponentType, ReactNode } from "react";

import logoImage from "../../logo progress ver.png";
import { ContactForm } from "@/components/shared/contact-form";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { LeadPopup } from "@/components/shared/lead-popup";
import { Magnetic } from "@/components/shared/magnetic";
import { SectionHeading } from "@/components/shared/section-heading";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import { baseSiteConfig } from "@/content/base";
import { useLanguage } from "@/context/language-context";
import { cn } from "@/lib/utils";

const serviceIcons = [
  Megaphone,
  Globe2,
  Clapperboard,
  Sparkles,
  Palette,
  LayoutTemplate,
  Workflow,
  BrainCircuit,
] as const;

export default function Home() {
  const { content } = useLanguage();
  const {
    navigation,
    heroMetrics,
    hero,
    sections,
    differentiators,
    services,
    processSteps,
    portfolioItems,
    statistics,
    testimonials,
    faqs,
    common,
  } = content;

  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("#home");

  const heroRef = useRef<HTMLElement>(null);
  const processRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroGlowY = useTransform(
    heroProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [0, -60],
  );

  const { scrollYProgress: processProgress } = useScroll({
    target: processRef,
    offset: ["start end", "end start"],
  });

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveTestimonial((current) => (current + 1) % testimonials.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [testimonials.length]);

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!mobileNavOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileNavOpen]);

  useEffect(() => {
    const sectionIds = navigation.map((item) => item.href.replace("#", ""));

    const updateActiveSection = () => {
      const marker = window.innerHeight * 0.28;
      let current = sectionIds[0] ?? "home";

      for (const id of sectionIds) {
        const element = document.getElementById(id);
        if (!element) continue;
        if (element.getBoundingClientRect().top <= marker) {
          current = id;
        }
      }

      setActiveSection(`#${current}`);
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);
    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, [navigation]);

  return (
    <div className="relative overflow-x-hidden bg-[linear-gradient(180deg,#f6f8ff_0%,#ffffff_30%,#eef4ff_100%)] dark:bg-[linear-gradient(180deg,#0b1220_0%,#0f172a_38%,#0b1220_100%)]">
      <motion.div
        className="absolute inset-x-0 top-0 -z-10 h-[720px] hero-glow"
        style={{ y: heroGlowY }}
      />
      <div className="absolute inset-0 -z-20 grid-pattern opacity-70" />

      <button
        type="button"
        aria-label={mobileNavOpen ? "Menyuni yopish" : "Menyuni ochish"}
        aria-expanded={mobileNavOpen}
        onClick={() => setMobileNavOpen((open) => !open)}
        className="fixed top-4 left-4 z-[60] flex size-12 items-center justify-center rounded-2xl border border-white/40 bg-[#0C3272]/90 text-white shadow-lg backdrop-blur-xl lg:hidden"
      >
        {mobileNavOpen ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>

      {mobileNavOpen ? (
        <button
          type="button"
          aria-label="Menyuni yopish"
          className="fixed inset-0 z-[55] bg-slate-950/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileNavOpen(false)}
        />
      ) : null}

      <aside
        className={cn(
          "fixed top-3 bottom-3 left-3 z-[58] flex w-[14.25rem] flex-col overflow-hidden rounded-[28px] border border-white/40 bg-[#0C3272]/82 shadow-[0_12px_40px_rgba(12,50,114,0.28)] backdrop-blur-2xl backdrop-saturate-150 transition-transform duration-300 dark:border-white/15 dark:bg-[#0C3272]/55 dark:shadow-[0_12px_40px_rgba(0,0,0,0.35)]",
          "lg:translate-x-0",
          mobileNavOpen ? "translate-x-0" : "-translate-x-[120%] lg:translate-x-0",
        )}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[28px] bg-[linear-gradient(160deg,rgba(255,255,255,0.22)_0%,rgba(255,255,255,0.06)_35%,rgba(255,255,255,0)_70%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-4 left-0 w-px rounded-full bg-gradient-to-b from-transparent via-white/45 to-transparent"
        />

        <div className="relative flex h-full flex-col px-3.5 py-5">
          <div className="shrink-0 px-1">
            <Image
              src={logoImage}
              alt="Progress.uzb logo"
              width={100}
              className="h-auto w-[100px] brightness-0 invert"
              priority
            />
          </div>

          <nav
            aria-label={common.primaryNav}
            className="mt-6 flex flex-1 flex-col justify-center gap-0.5"
          >
            {navigation.map((item) => {
              const isActive = activeSection === item.href;

              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileNavOpen(false)}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "rounded-xl px-3 py-2.5 text-base font-semibold transition",
                    isActive
                      ? "bg-white/12 text-white"
                      : "text-white/85 hover:bg-white/10 hover:text-white",
                  )}
                >
                  <span
                    className={cn(
                      "relative inline-block pb-0.5",
                      isActive &&
                        "after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-white after:content-['']",
                    )}
                  >
                    {item.label}
                  </span>
                </a>
              );
            })}
          </nav>

          <div className="relative z-10 mt-4 flex shrink-0 flex-col gap-2.5 border-t border-white/15 pt-4">
            <LanguageSwitcher
              dropUp
              className="w-full [&>button]:border-white/30 [&>button]:bg-white/10 [&>button]:px-3 [&>button]:text-white [&>button]:backdrop-blur-md [&>button]:hover:border-white/60 [&>button]:hover:bg-white/20 [&>button]:hover:text-white"
            />
            <ThemeToggle className="w-full !rounded-full" />
            <a href="#contact" className="w-full" onClick={() => setMobileNavOpen(false)}>
              <Magnetic className="w-full">
                <Button
                  variant="ghost"
                  className="w-full whitespace-normal border border-white/30 bg-white/10 px-3 text-center text-xs leading-snug text-white backdrop-blur-md hover:bg-white/25 hover:text-white"
                >
                  {common.freeConsultation}
                </Button>
              </Magnetic>
            </a>
          </div>
        </div>
      </aside>

      <main className="pt-20 lg:pt-8 lg:pl-[16.25rem]">
        <section
          id="home"
          ref={heroRef}
          className="section-shell pt-10 pb-20 sm:pt-14 sm:pb-24"
        >
          <div className="max-w-3xl">
            <Reveal>
              <div className="space-y-8">
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#0C3272]/10 bg-white/80 px-4 py-2 text-sm text-[#0C3272] shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/70 dark:text-blue-200">
                  <ShieldCheck className="size-4" />
                  {hero.badge}
                </div>
                <div className="space-y-5">
                  <h1 className="max-w-3xl text-balance text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl dark:text-white">
                    {hero.title}
                  </h1>
                  <p className="max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl dark:text-slate-300">
                    {hero.subtitle}
                  </p>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row">
                  <a href="#contact">
                    <Magnetic>
                      <Button size="large" className="w-full sm:w-auto">
                        {hero.ctaPrimary}
                        <ArrowUpRight className="ml-2 size-4" />
                      </Button>
                    </Magnetic>
                  </a>
                  <a href="#services">
                    <Button variant="secondary" size="large" className="w-full sm:w-auto">
                      {hero.ctaSecondary}
                    </Button>
                  </a>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  {heroMetrics.map((metric) => (
                    <div
                      key={metric.label}
                      className="glass-card rounded-[24px] border border-white/50 px-5 py-4 dark:border-white/10"
                    >
                      <p className="text-2xl font-semibold text-slate-950 dark:text-white">
                        {metric.value}
                      </p>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{metric.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="section-shell py-20">
          <Reveal>
            <SectionHeading
              eyebrow={sections.whyChoose.eyebrow}
              title={sections.whyChoose.title}
              description={sections.whyChoose.description}
              align="center"
            />
          </Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {differentiators.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.06} variant="card">
                <div className="glass-card h-full rounded-[30px] border border-white/50 p-6 dark:border-white/10">
                  <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-[#0C3272]/10 text-[#0C3272] dark:bg-blue-400/15 dark:text-blue-300">
                    <ShieldCheck className="size-5" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-950 dark:text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                    {item.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="services" className="section-shell py-20">
          <Reveal>
            <SectionHeading
              eyebrow={sections.services.eyebrow}
              title={sections.services.title}
              description={sections.services.description}
            />
          </Reveal>
          <div className="mt-12 grid gap-5 xl:grid-cols-2">
            {services.map((service, index) => {
              const Icon = serviceIcons[index];
              return (
                <Reveal key={service.title} delay={index * 0.05} variant="card">
                  <div className="glass-card h-full rounded-[32px] border border-white/60 p-7 dark:border-white/10">
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                      <div className="space-y-4">
                        <div className="flex size-14 items-center justify-center rounded-[20px] bg-[#0C3272] text-white shadow-[0_16px_40px_rgba(12,50,114,0.22)] dark:bg-blue-600">
                          <Icon className="size-6" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-semibold text-slate-950 dark:text-white">
                            {service.title}
                          </h3>
                          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
                            {service.description}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 flex flex-wrap gap-3">
                      {service.items.map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-[#0C3272]/12 bg-[#0C3272]/5 px-4 py-2 text-sm font-medium text-slate-700 dark:border-blue-300/20 dark:bg-blue-300/10 dark:text-slate-200"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </section>

        <section id="process" className="section-shell py-20">
          <Reveal>
            <SectionHeading
              eyebrow={sections.process.eyebrow}
              title={sections.process.title}
              description={sections.process.description}
              align="center"
            />
          </Reveal>
          <div className="relative mt-12">
            <div className="absolute top-2 bottom-2 left-2 w-0.5 overflow-hidden rounded-full bg-slate-200 lg:hidden dark:bg-slate-700">
              <motion.div
                className="w-full origin-top rounded-full bg-[#0C3272] dark:bg-blue-400"
                style={{ scaleY: processProgress, height: "100%" }}
              />
            </div>
            <div className="mb-6 hidden h-1 overflow-hidden rounded-full bg-slate-200 lg:block dark:bg-slate-700">
              <motion.div
                className="h-full origin-left rounded-full bg-[#0C3272] dark:bg-blue-400"
                style={{ scaleX: processProgress }}
              />
            </div>
            <div ref={processRef} className="grid gap-5 pl-6 lg:grid-cols-6 lg:pl-0">
              {processSteps.map((step, index) => (
                <Reveal key={step} delay={index * 0.06}>
                  <div className="relative h-full rounded-[28px] border border-slate-200 bg-white/90 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/80">
                    <div className="mb-4 inline-flex size-12 items-center justify-center rounded-full bg-[#0C3272] text-sm font-semibold text-white dark:bg-blue-600">
                      {index + 1}
                    </div>
                    <h3 className="text-lg font-semibold text-slate-950 dark:text-white">
                      {step}
                    </h3>
                    {index < processSteps.length - 1 ? (
                      <div className="pointer-events-none absolute right-[-16px] top-1/2 hidden -translate-y-1/2 lg:block">
                        <ArrowUpRight className="size-8 rotate-45 text-[#0C3272]/30" />
                      </div>
                    ) : null}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="portfolio" className="section-shell py-20">
          <Reveal>
            <SectionHeading
              eyebrow={sections.portfolio.eyebrow}
              title={sections.portfolio.title}
              description={sections.portfolio.description}
            />
          </Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {portfolioItems.map((item, index) => (
              <Reveal key={item.name} delay={index * 0.05} variant="card">
                <article className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
                  <div className="relative aspect-[16/11] overflow-hidden bg-[linear-gradient(135deg,#0C3272,#1a56c6)] p-6 text-white">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.22),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.18),_transparent_25%)]" />
                    <div className="relative flex h-full flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em]">
                          {sections.portfolio.projectPreview}
                        </span>
                        <Landmark className="size-5 text-blue-100" />
                      </div>
                      <div className="rounded-[24px] border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                        <p className="text-sm text-blue-100">{item.category}</p>
                        <p className="mt-2 text-2xl font-semibold">{item.name}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#0C3272] dark:text-blue-300">
                      {item.category}
                    </p>
                    <h3 className="mt-3 text-2xl font-semibold text-slate-950 dark:text-white">
                      {item.name}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                      {item.description}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="section-shell py-20">
          <div className="rounded-[36px] bg-slate-950 px-6 py-12 text-white shadow-[0_30px_80px_rgba(15,23,42,0.18)] sm:px-10">
            <Reveal>
              <SectionHeading
                eyebrow={sections.results.eyebrow}
                title={sections.results.title}
                description={sections.results.description}
              />
            </Reveal>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {statistics.map((item, index) => (
                <Reveal key={item.label} delay={index * 0.06}>
                  <div className="rounded-[30px] border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                    <AnimatedCounter value={item.value} suffix={item.suffix} />
                    <p className="mt-3 text-sm uppercase tracking-[0.2em] text-blue-100">
                      {item.label}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="testimonials" className="section-shell py-20">
          <Reveal>
            <SectionHeading
              eyebrow={sections.testimonials.eyebrow}
              title={sections.testimonials.title}
              description={sections.testimonials.description}
            />
          </Reveal>
          <div className="mt-12 grid gap-6 lg:grid-cols-[0.45fr_0.55fr]">
            <Reveal>
              <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <div className="flex items-center gap-3 text-[#0C3272] dark:text-blue-300">
                  <MessageSquareQuote className="size-6" />
                  <span className="text-sm font-semibold uppercase tracking-[0.2em]">
                    {sections.testimonials.whatClientsSay}
                  </span>
                </div>
                <p className="mt-6 text-3xl font-semibold leading-tight text-slate-950 dark:text-white">
                  {sections.testimonials.sideQuote}
                </p>
                <div className="mt-8 flex gap-3">
                  <button
                    type="button"
                    aria-label={common.previousTestimonial}
                    onClick={() =>
                      setActiveTestimonial((current) =>
                        current === 0 ? testimonials.length - 1 : current - 1,
                      )
                    }
                    className="flex size-12 items-center justify-center rounded-full border border-slate-200 bg-white transition hover:border-[#0C3272] hover:text-[#0C3272] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-blue-400 dark:hover:text-blue-300"
                  >
                    <ChevronLeft className="size-5" />
                  </button>
                  <button
                    type="button"
                    aria-label={common.nextTestimonial}
                    onClick={() =>
                      setActiveTestimonial((current) => (current + 1) % testimonials.length)
                    }
                    className="flex size-12 items-center justify-center rounded-full border border-slate-200 bg-white transition hover:border-[#0C3272] hover:text-[#0C3272] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-blue-400 dark:hover:text-blue-300"
                  >
                    <ChevronRight className="size-5" />
                  </button>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="glass-card rounded-[36px] border border-white/60 p-8 dark:border-white/10">
                <motion.div
                  key={activeTestimonial}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex size-16 items-center justify-center rounded-full bg-[#0C3272]/10 text-[#0C3272] dark:bg-blue-400/15 dark:text-blue-300">
                      <Star className="size-6 fill-current" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-slate-950 dark:text-white">
                        {testimonials[activeTestimonial]?.name}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {testimonials[activeTestimonial]?.company}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1 text-amber-400">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star key={index} className="size-5 fill-current" />
                    ))}
                  </div>
                  <p className="text-xl leading-9 text-slate-700 dark:text-slate-200">
                    “{testimonials[activeTestimonial]?.review}”
                  </p>
                  <div className="flex gap-2">
                    {testimonials.map((item, index) => (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() => setActiveTestimonial(index)}
                        className={cn(
                          "h-2.5 rounded-full transition-all",
                          activeTestimonial === index
                            ? "w-10 bg-[#0C3272] dark:bg-blue-400"
                            : "w-2.5 bg-slate-300 dark:bg-slate-600",
                        )}
                        aria-label={`${common.showTestimonial} ${index + 1}`}
                      />
                    ))}
                  </div>
                </motion.div>
              </div>
            </Reveal>
          </div>
        </section>

        <section id="faq" className="section-shell py-20">
          <Reveal>
            <SectionHeading
              eyebrow={sections.faq.eyebrow}
              title={sections.faq.title}
              description={sections.faq.description}
              align="center"
            />
          </Reveal>
          <div className="mx-auto mt-12 max-w-4xl space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;

              return (
                <Reveal key={faq.question} delay={index * 0.03}>
                  <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setActiveFaq(isOpen ? null : index)}
                      className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                    >
                      <div className="flex items-start gap-4">
                        <div className="mt-1 flex size-10 shrink-0 items-center justify-center rounded-2xl bg-[#0C3272]/8 text-[#0C3272] dark:bg-blue-400/15 dark:text-blue-300">
                          <CircleHelp className="size-5" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-slate-950 dark:text-white">
                            {faq.question}
                          </h3>
                        </div>
                      </div>
                      <ChevronRight
                        className={cn(
                          "size-5 shrink-0 text-slate-400 transition-transform dark:text-slate-500",
                          isOpen && "rotate-90 text-[#0C3272] dark:text-blue-300",
                        )}
                      />
                    </button>
                    <motion.div
                      initial={false}
                      animate={{
                        height: isOpen ? "auto" : 0,
                        opacity: isOpen ? 1 : 0,
                      }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pl-20 text-sm leading-7 text-slate-600 dark:text-slate-300">
                        {faq.answer}
                      </div>
                    </motion.div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </section>

        <section className="section-shell py-20">
          <Reveal>
            <div className="relative overflow-hidden rounded-[40px] bg-[#0C3272] px-6 py-12 text-white shadow-[0_30px_90px_rgba(12,50,114,0.28)] sm:px-10 lg:px-14">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.22),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.16),_transparent_20%)]" />
              <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
                <div className="space-y-4">
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-100">
                    {sections.finalCta.eyebrow}
                  </p>
                  <h2 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
                    {sections.finalCta.title}
                  </h2>
                  <p className="max-w-2xl text-lg leading-8 text-blue-50">
                    {sections.finalCta.description}
                  </p>
                </div>
                <a href="#contact" className="w-full lg:w-auto">
                  <Magnetic>
                    <Button
                      size="large"
                      className="w-full bg-white text-slate-950 hover:bg-slate-100"
                    >
                      {sections.finalCta.cta}
                    </Button>
                  </Magnetic>
                </a>
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      <footer id="contact" className="bg-slate-950 py-20 text-white">
        <div className="section-shell grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-blue-100">
                <PhoneCall className="size-4" />
                {sections.contact.badge}
              </div>
              <h2 className="max-w-xl text-4xl font-semibold tracking-tight sm:text-5xl">
                {sections.contact.title}
              </h2>
              <p className="max-w-xl text-lg leading-8 text-slate-300">
                {sections.contact.description}
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <ContactCard
                  icon={PhoneCall}
                  label={sections.contact.phoneLabel}
                  value={baseSiteConfig.phoneDisplay}
                  href={baseSiteConfig.phoneHref}
                />
                <ContactCard
                  icon={BarChart3}
                  label={sections.contact.servicesLabel}
                  value={sections.contact.servicesValue}
                />
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="rounded-[36px] border border-white/10 bg-white/6 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-8">
              <ContactForm key={content.locale} content={content} />
            </div>
          </Reveal>
        </div>
      </footer>

      <button
        type="button"
        aria-label={common.backToTop}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={cn(
          "fixed bottom-6 right-6 z-50 flex size-12 items-center justify-center rounded-full bg-[#0C3272] text-white shadow-[0_20px_40px_rgba(12,50,114,0.28)] transition-all dark:bg-slate-800",
          showBackToTop
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0",
        )}
      >
        <ChevronUp className="size-5" />
      </button>

      <LeadPopup content={content} />
    </div>
  );
}

function Reveal({
  children,
  delay = 0,
  variant = "rise",
}: {
  children: ReactNode;
  delay?: number;
  variant?: "rise" | "card";
}) {
  const initial =
    variant === "card" ? { opacity: 0, y: 24, scale: 0.94 } : { opacity: 0, y: 24 };
  const whileInView =
    variant === "card" ? { opacity: 1, y: 0, scale: 1 } : { opacity: 1, y: 0 };

  return (
    <motion.div
      initial={initial}
      whileInView={whileInView}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

function AnimatedCounter({
  value,
  suffix,
}: {
  value: number;
  suffix: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const start = performance.now();
    const duration = 1200;

    const frame = (time: number) => {
      const progress = Math.min((time - start) / duration, 1);
      setDisplayValue(Math.round(value * progress));
      if (progress < 1) {
        window.requestAnimationFrame(frame);
      }
    };

    window.requestAnimationFrame(frame);
  }, [isInView, value]);

  return (
    <div ref={ref} className="text-5xl font-semibold tracking-tight">
      {displayValue}
      {suffix}
    </div>
  );
}

function ContactCard({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition hover:bg-white/8">
      <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-white/10">
        <Icon className="size-5 text-blue-100" />
      </div>
      <p className="text-sm text-slate-300">{label}</p>
      <p className="mt-2 text-base font-semibold text-white">{value}</p>
    </div>
  );

  if (!href) return content;

  return <a href={href}>{content}</a>;
}

