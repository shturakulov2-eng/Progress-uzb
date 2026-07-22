"use client";

import {
  ArrowUpRight,
  BrainCircuit,
  ChevronRight,
  ChevronUp,
  CircleHelp,
  Clapperboard,
  Globe2,
  LayoutTemplate,
  MapPin,
  Megaphone,
  Menu,
  Palette,
  PhoneCall,
  Send,
  ShieldCheck,
  Sparkles,
  Workflow,
  X,
} from "lucide-react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

import logoImage from "../../logo progress ver.png";
import { ContactForm } from "@/components/shared/contact-form";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { LeadPopup } from "@/components/shared/lead-popup";
import { Magnetic } from "@/components/shared/magnetic";
import { MountainJourney } from "@/components/shared/mountain-journey";
import { PortfolioScrollShowcase } from "@/components/shared/portfolio-scroll-showcase";
import { SectionHeading } from "@/components/shared/section-heading";
import { ServiceInquiryForm } from "@/components/shared/service-inquiry-form";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { VideoTestimonialCard } from "@/components/shared/video-testimonial-card";
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
    videoTestimonials,
    faqs,
    common,
  } = content;

  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("#home");
  const [isTestimonialPlaying, setIsTestimonialPlaying] = useState(false);

  const heroRef = useRef<HTMLElement>(null);
  const processRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [pillBox, setPillBox] = useState<{ top: number; height: number } | null>(
    null,
  );
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
      // Resolve by document position so nav label order cannot override scroll order.
      const documentOrderedIds = [...sectionIds].sort((a, b) => {
        const elA = document.getElementById(a);
        const elB = document.getElementById(b);
        if (!elA || !elB) return 0;
        return elA.offsetTop - elB.offsetTop;
      });
      let current = documentOrderedIds[0] ?? "home";

      for (const id of documentOrderedIds) {
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

  useEffect(() => {
    const measurePill = () => {
      const el = linkRefs.current[activeSection];
      if (!el) return;
      setPillBox({ top: el.offsetTop, height: el.offsetHeight });
    };
    const raf = requestAnimationFrame(measurePill);
    window.addEventListener("resize", measurePill);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measurePill);
    };
  }, [activeSection]);

  return (
    <div className="relative overflow-x-clip bg-[linear-gradient(180deg,#f6f8ff_0%,#ffffff_30%,#eef4ff_100%)] dark:bg-[linear-gradient(180deg,#0b1220_0%,#0f172a_38%,#0b1220_100%)]">
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
          "fixed top-0 bottom-0 left-0 z-[58] flex w-[13rem] flex-col overflow-visible transition-transform duration-300",
          "lg:translate-x-0",
          mobileNavOpen ? "translate-x-0" : "-translate-x-[120%] lg:translate-x-0",
        )}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-r-[28px] border-r border-white/40 bg-[#0C3272]/85 shadow-[0_12px_40px_rgba(12,50,114,0.28)] backdrop-blur-2xl backdrop-saturate-150 dark:border-white/15 dark:bg-[#0C3272]/60 dark:shadow-[0_12px_40px_rgba(0,0,0,0.35)]"
        >
          <div className="absolute inset-0 bg-[linear-gradient(160deg,rgba(255,255,255,0.22)_0%,rgba(255,255,255,0.06)_35%,rgba(255,255,255,0)_70%)]" />
          <div className="absolute inset-y-6 right-0 w-px rounded-full bg-gradient-to-b from-transparent via-white/40 to-transparent" />
        </div>

        <div className="relative flex h-full flex-col px-4 py-5">
          <div className="flex shrink-0 flex-col items-center pt-4 text-center">
            <Image
              src={logoImage}
              alt="Progress.uzb logo"
              width={100}
              className="h-auto w-[96px] brightness-0 invert"
              priority
            />
            <p className="mt-2.5 max-w-[10.5rem] text-xs font-medium leading-5 text-blue-100/80">
              Brenddan sotuvgacha kompleks yechimlar
            </p>
          </div>

          <nav
            ref={navRef}
            aria-label={common.primaryNav}
            className="relative mt-5 flex flex-1 flex-col justify-center gap-2.5"
          >
            {pillBox ? (
              <motion.div
                aria-hidden="true"
                className="nav-active-pill pointer-events-none absolute left-0 -right-4 z-0 rounded-l-[22px]"
                initial={false}
                animate={{ top: pillBox.top, height: pillBox.height }}
                transition={
                  prefersReducedMotion
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 380, damping: 34, mass: 0.7 }
                }
              >
                <span className="nav-scoop nav-scoop-top" />
                <span className="nav-scoop nav-scoop-bottom" />
              </motion.div>
            ) : null}

            {navigation.map((item) => {
              const isActive = activeSection === item.href;

              return (
                <a
                  key={item.href}
                  ref={(node) => {
                    linkRefs.current[item.href] = node;
                  }}
                  href={item.href}
                  onClick={() => setMobileNavOpen(false)}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "relative z-10 px-3 py-2 text-base font-semibold transition-colors duration-300 ease-out",
                    isActive
                      ? "font-bold text-[#0C3272] dark:text-white"
                      : "text-white/70 hover:text-white",
                  )}
                >
                  <span
                    className={cn(
                      "inline-block origin-left transition-transform duration-300 ease-out",
                      isActive && "scale-[1.18]",
                    )}
                  >
                    {item.label}
                  </span>
                </a>
              );
            })}
          </nav>

          <div className="relative z-10 mt-3 flex shrink-0 flex-col gap-3 border-t border-white/15 pt-4">
            <div className="flex items-center gap-2.5">
              <LanguageSwitcher
                dropUp
                className="min-w-0 flex-1 [&>button]:border-white/30 [&>button]:bg-white/10 [&>button]:px-3 [&>button]:text-white [&>button]:backdrop-blur-md [&>button]:hover:border-white/60 [&>button]:hover:bg-white/20 [&>button]:hover:text-white"
              />
              <ThemeToggle className="!size-11 shrink-0" />
            </div>
            <a href="#contact" className="w-full" onClick={() => setMobileNavOpen(false)}>
              <Magnetic className="w-full">
                <Button
                  variant="ghost"
                  className="min-h-12 w-full whitespace-normal border border-white/35 bg-white/15 px-3 py-3 text-center text-sm leading-snug text-white shadow-[0_10px_28px_rgba(0,0,0,0.16)] backdrop-blur-md hover:bg-white/25 hover:text-white"
                >
                  {common.freeConsultation}
                </Button>
              </Magnetic>
            </a>
          </div>
        </div>
      </aside>

      <MountainJourney />

      <main className="relative z-10 pt-20 lg:pt-8 lg:pl-[14.5rem]">
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
                  <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl dark:text-white">
                    {hero.title.split("\n").map((line) => (
                      <span key={line} className="block whitespace-nowrap">
                        {line}
                      </span>
                    ))}
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
          <div className="mt-12 space-y-14">
            {services.map((group, groupIndex) => (
              <div key={group.title}>
                <Reveal>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-semibold text-[#0C3272]/50 dark:text-blue-300/60">
                      0{groupIndex + 1}
                    </span>
                    <h3 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
                      {group.title}
                    </h3>
                    <div className="h-px flex-1 bg-gradient-to-r from-[#0C3272]/20 to-transparent dark:from-blue-300/20" />
                  </div>
                </Reveal>

                <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {group.items.map((service, itemIndex) => {
                    const iconIndex = groupIndex === 0 ? itemIndex : itemIndex + 5;
                    const Icon = serviceIcons[iconIndex] ?? Sparkles;

                    return (
                      <Reveal
                        key={service.title}
                        delay={itemIndex * 0.06}
                        variant="card"
                      >
                        <article className="glass-card group h-full rounded-[28px] border border-white/60 p-6 transition duration-300 hover:-translate-y-1 hover:border-[#0C3272]/20 hover:shadow-[0_24px_70px_rgba(12,50,114,0.14)] dark:border-white/10 dark:hover:border-blue-300/25">
                          <div className="flex size-12 items-center justify-center rounded-2xl bg-[#0C3272] text-white shadow-[0_12px_30px_rgba(12,50,114,0.2)] transition-transform duration-300 group-hover:scale-105 dark:bg-blue-600">
                            <Icon className="size-5" />
                          </div>
                          <h4 className="mt-5 text-xl font-semibold text-slate-950 dark:text-white">
                            {service.title}
                          </h4>
                          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                            {service.description}
                          </p>
                        </article>
                      </Reveal>
                    );
                  })}
                </div>
              </div>
            ))}

            <Reveal variant="card">
              <div className="relative overflow-hidden rounded-[36px] bg-[#0C3272] p-6 text-white shadow-[0_28px_80px_rgba(12,50,114,0.25)] sm:p-8 lg:p-10 dark:bg-blue-950">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(96,165,250,0.2),transparent_40%)]" />
                <div className="relative grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-100">
                      {content.serviceInquiry.eyebrow}
                    </p>
                    <h3 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                      {content.serviceInquiry.title}
                    </h3>
                    <p className="mt-4 max-w-xl leading-7 text-blue-100/90">
                      {content.serviceInquiry.description}
                    </p>
                  </div>
                  <ServiceInquiryForm key={content.locale} content={content} />
                </div>
              </div>
            </Reveal>
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

        <PortfolioScrollShowcase
          portfolio={sections.portfolio}
          results={sections.results}
          items={portfolioItems}
          statistics={statistics}
        />

        <section id="testimonials" className="section-shell py-20">
          <Reveal>
            <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
              <SectionHeading
                eyebrow={sections.testimonials.eyebrow}
                title={sections.testimonials.title}
                description={sections.testimonials.description}
                align="center"
              />
              <a href="#contact" className="mt-8">
                <Magnetic>
                  <Button size="large">
                    {sections.testimonials.cta}
                    <ArrowUpRight className="ml-2 size-4" />
                  </Button>
                </Magnetic>
              </a>
            </div>
          </Reveal>

          <Reveal variant="card">
            <div
              className={cn(
                "video-marquee mt-12 overflow-hidden",
                isTestimonialPlaying && "is-playing",
              )}
            >
              <div className="video-marquee-track flex w-max">
                {[0, 1].map((groupIndex) => (
                  <div
                    key={groupIndex}
                    aria-hidden={groupIndex === 1 ? "true" : undefined}
                    className="flex shrink-0 gap-5 pr-5"
                  >
                    {videoTestimonials.map((item) => (
                      <div
                        key={`${groupIndex}-${item.src}`}
                        className="w-[min(75vw,283px)] shrink-0"
                      >
                        <VideoTestimonialCard
                          title={item.title}
                          src={item.src}
                          onPlay={() => setIsTestimonialPlaying(true)}
                          onPause={() => setIsTestimonialPlaying(false)}
                        />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mx-auto mt-8 max-w-2xl text-center text-sm leading-7 text-slate-500 dark:text-slate-400">
              {sections.testimonials.videoNote}
            </p>
          </Reveal>
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

      <footer id="contact" className="relative z-10 bg-slate-950 py-20 text-white lg:pl-[14.5rem]">
        <div className="section-shell grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <div className="space-y-6">
              <a
                href="tel:+998939633363"
                aria-label="Progress.uzb ga qo'ng'iroq qilish"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-blue-100 transition hover:bg-white/10 hover:text-white"
              >
                <PhoneCall className="size-4" />
                {sections.contact.badge}
              </a>
              <h2 className="max-w-xl text-4xl font-semibold tracking-tight sm:text-5xl">
                {sections.contact.title}
              </h2>
              <p className="max-w-xl text-lg leading-8 text-slate-300">
                {sections.contact.description}
              </p>

              <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-200/80">
                  {sections.contact.socialLabel}
                </p>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  {sections.contact.socialDescription}
                </p>
                <div className="mt-4 flex gap-3">
                  <a
                    href={baseSiteConfig.social.instagram}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Instagram"
                    className="flex size-12 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-white/20"
                  >
                    <svg viewBox="0 0 24 24" className="size-5 fill-none stroke-current" strokeWidth="1.8">
                      <rect x="3" y="3" width="18" height="18" rx="5" />
                      <circle cx="12" cy="12" r="4" />
                      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                    </svg>
                  </a>
                  <a
                    href={baseSiteConfig.social.telegram}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Telegram"
                    className="flex size-12 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-white/20"
                  >
                    <Send className="size-5" />
                  </a>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                  <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-white/10">
                    <MapPin className="size-5 text-blue-100" />
                  </div>
                  <p className="text-sm text-slate-300">{sections.contact.addressLabel}</p>
                  <p className="mt-2 text-base font-semibold text-white">
                    {sections.contact.addressValue}
                  </p>
                  <p className="mt-4 text-sm text-slate-300">
                    {sections.contact.landmarkLabel}
                  </p>
                  <p className="mt-1 text-sm font-medium leading-6 text-blue-100">
                    {sections.contact.landmarkValue}
                  </p>
                </div>

                <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                  <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-white/10">
                    <PhoneCall className="size-5 text-blue-100" />
                  </div>
                  <p className="text-sm text-slate-300">{sections.contact.phoneLabel}</p>
                  <div className="mt-3 space-y-2">
                    {baseSiteConfig.phones.map((phone) => (
                      <a
                        key={phone.href}
                        href={phone.href}
                        className="block text-base font-semibold text-white transition hover:text-blue-200"
                      >
                        {phone.display}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="space-y-6">
              <div className="rounded-[36px] border border-white/10 bg-white/6 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-8">
                <ContactForm key={content.locale} content={content} />
              </div>

              <div className="overflow-hidden rounded-[36px] border border-white/10 bg-white/5 shadow-2xl shadow-black/20 backdrop-blur-xl">
                <div className="flex items-center justify-between gap-3 px-6 pt-5">
                  <div className="flex items-center gap-2 text-sm font-semibold text-white">
                    <MapPin className="size-4 text-blue-200" />
                    {sections.contact.addressValue}
                  </div>
                  <a
                    href={baseSiteConfig.mapHref}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-blue-100 transition hover:bg-white/20"
                  >
                    {sections.contact.mapCta}
                    <ArrowUpRight className="size-3.5" />
                  </a>
                </div>
                <div className="mt-4 aspect-[16/10] w-full">
                  <iframe
                    src={baseSiteConfig.mapEmbedSrc}
                    title={sections.contact.addressValue}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                    className="h-full w-full border-0 grayscale-[0.15]"
                  />
                </div>
              </div>
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


