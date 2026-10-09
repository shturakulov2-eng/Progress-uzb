"use client";

import {
  ArrowUpRight,
  BrainCircuit,
  ChevronUp,
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
  Video,
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
import { BlogSection } from "@/components/shared/blog-section";
import { BrandLogoMarquee } from "@/components/shared/brand-logo-marquee";
import { ContactForm } from "@/components/shared/contact-form";
import { HeroBlogSpotlight } from "@/components/shared/hero-blog-spotlight";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { openLeadPopup } from "@/components/shared/lead-popup";
import { Magnetic } from "@/components/shared/magnetic";
import { MarketerShowcase } from "@/components/shared/marketer-showcase";
import { PortfolioScrollShowcase } from "@/components/shared/portfolio-scroll-showcase";
import { ProcessScrollCarousel } from "@/components/shared/process-scroll-carousel";
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
  Video,
  LayoutTemplate,
  Workflow,
  BrainCircuit,
  Sparkles,
] as const;

type SelectedService = {
  title: string;
  description: string;
};

export default function Home() {
  const { content } = useLanguage();
  const {
    navigation,
    heroMetrics,
    hero,
    sections,
    services,
    processSteps,
    portfolioItems,
    statistics,
    videoTestimonials,
    common,
  } = content;

  const [showBackToTop, setShowBackToTop] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("#home");
  const [isTestimonialPlaying, setIsTestimonialPlaying] = useState(false);
  const [selectedServices, setSelectedServices] = useState<SelectedService[]>([]);

  const heroRef = useRef<HTMLElement>(null);
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

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "");
    if (!hash) return;

    const scrollToHash = () => {
      const target = document.getElementById(hash);
      if (!target) return false;
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      return true;
    };

    if (scrollToHash()) return;

    const timeout = window.setTimeout(() => {
      scrollToHash();
    }, 120);

    return () => window.clearTimeout(timeout);
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
      const nav = navRef.current;
      const el = linkRefs.current[activeSection];
      if (!nav || !el) return;

      const navRect = nav.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();

      setPillBox({
        top: elRect.top - navRect.top,
        height: elRect.height,
      });
    };

    const raf = requestAnimationFrame(measurePill);
    window.addEventListener("resize", measurePill);

    const nav = navRef.current;
    const ro = nav ? new ResizeObserver(measurePill) : null;
    nav?.querySelectorAll("a").forEach((link) => ro?.observe(link));
    if (nav) ro?.observe(nav);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measurePill);
      ro?.disconnect();
    };
  }, [activeSection]);

  useEffect(() => {
    setSelectedServices([]);
  }, [content.locale]);

  function toggleSelectedService(service: SelectedService) {
    setSelectedServices((current) => {
      const exists = current.some((item) => item.title === service.title);
      if (exists) {
        return current.filter((item) => item.title !== service.title);
      }
      return [...current, service];
    });
  }

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
          "lg:w-[11.25rem] xl:w-[12rem] 2xl:w-[13rem]",
          "lg:translate-x-0",
          mobileNavOpen ? "translate-x-0" : "-translate-x-[120%] lg:translate-x-0",
        )}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-r-[28px] border-r border-white/40 bg-[#0C3272]/85 backdrop-blur-2xl backdrop-saturate-150 dark:border-white/15 dark:bg-[#0C3272]/60"
        >
          <div className="absolute inset-0 bg-[linear-gradient(160deg,rgba(255,255,255,0.22)_0%,rgba(255,255,255,0.06)_35%,rgba(255,255,255,0)_70%)]" />
          <div className="absolute inset-y-6 right-0 w-px rounded-full bg-gradient-to-b from-transparent via-white/40 to-transparent" />
        </div>

        <div className="relative flex h-full max-h-[100dvh] flex-col overflow-hidden py-2 max-lg:pb-[max(0.5rem,env(safe-area-inset-bottom))] lg:py-2.5 xl:py-4 2xl:py-5">
          <div className="flex shrink-0 flex-col items-center px-3 pt-0 text-center lg:pt-0.5 xl:pt-2 2xl:pt-4">
            <Image
              src={logoImage}
              alt="Progress.uzb — SMM va marketing agentligi Samarqand"
              width={100}
              className="h-auto w-[64px] brightness-0 invert sm:w-[72px] lg:w-[60px] xl:w-[76px] 2xl:w-[96px]"
              priority
            />
            <p className="mt-1 max-w-[10rem] whitespace-pre-line text-[10px] font-medium leading-3 text-blue-100/80 lg:mt-0.5 lg:max-w-[9.5rem] lg:text-[10px] lg:leading-3 xl:mt-1.5 xl:text-xs xl:leading-4 2xl:mt-2.5 2xl:max-w-[10.5rem]">
              {hero.navTagline}
            </p>
          </div>

          <nav
            ref={navRef}
            aria-label={common.primaryNav}
            className="relative mt-2 flex shrink-0 flex-col justify-start gap-1 max-lg:gap-1.5 lg:mt-1.5 lg:gap-0.5 xl:mt-2 xl:gap-1 2xl:mt-4 2xl:gap-1.5"
          >
            {pillBox ? (
              <motion.div
                aria-hidden="true"
                className="nav-active-pill pointer-events-none absolute inset-x-0 z-0 rounded-l-[22px] lg:rounded-l-[18px] 2xl:rounded-l-[22px]"
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
                    "relative z-10 block w-full px-3 py-1.5 text-sm font-semibold leading-tight transition-colors duration-300 ease-out max-lg:px-3 max-lg:py-2 max-lg:text-[15px]",
                    "lg:px-3 lg:py-1 lg:text-[13px] xl:px-3.5 xl:py-1.5 xl:text-sm 2xl:px-4 2xl:py-2 2xl:text-base",
                    isActive
                      ? "font-bold text-[#0C3272] dark:text-white"
                      : "text-white/70 hover:text-white",
                  )}
                >
                  <span
                      className={cn(
                      "inline-block origin-left transition-transform duration-300 ease-out",
                      isActive && "lg:scale-[1.05] xl:scale-[1.08] 2xl:scale-[1.14]",
                    )}
                  >
                    {item.label}
                  </span>
                </a>
              );
            })}
          </nav>

          <div className="relative z-10 mt-2 shrink-0 px-3 max-lg:mt-1.5 lg:hidden">
            <div className="flex flex-col gap-0.5">
              {baseSiteConfig.phones.map((phone) => (
                <a
                  key={phone.href}
                  href={phone.href}
                  className="text-xs font-semibold text-white/85 transition hover:text-white"
                >
                  {phone.display}
                </a>
              ))}
            </div>
            <div className="mt-1.5 flex gap-2">
              <a
                href={baseSiteConfig.social.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="flex size-8 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white transition hover:border-white/50 hover:bg-white/20"
              >
                <svg viewBox="0 0 24 24" className="size-3.5 fill-none stroke-current" strokeWidth="1.8">
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
                className="flex size-8 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white transition hover:border-white/50 hover:bg-white/20"
              >
                <Send className="size-3.5" />
              </a>
            </div>
          </div>

          <div className="min-h-0 flex-1" aria-hidden="true" />

          <div className="relative z-10 hidden shrink-0 px-3 pt-2 lg:block xl:pt-2.5 2xl:pt-3">
            <div className="flex flex-col gap-2 lg:gap-0.5 xl:gap-1">
              {baseSiteConfig.phones.map((phone) => (
                <a
                  key={phone.href}
                  href={phone.href}
                  className="text-sm font-semibold text-white/85 transition hover:text-white lg:text-[11px] xl:text-xs 2xl:text-sm"
                >
                  {phone.display}
                </a>
              ))}
            </div>
            <div className="mt-2.5 flex gap-2.5 lg:mt-1 lg:gap-2 xl:mt-1.5 2xl:mt-2.5">
              <a
                href={baseSiteConfig.social.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="flex size-10 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white transition hover:border-white/50 hover:bg-white/20 lg:size-8 xl:size-9 2xl:size-10"
              >
                <svg viewBox="0 0 24 24" className="size-4 fill-none stroke-current lg:size-3.5 xl:size-3.5 2xl:size-4" strokeWidth="1.8">
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
                className="flex size-10 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white transition hover:border-white/50 hover:bg-white/20 lg:size-8 xl:size-9 2xl:size-10"
              >
                <Send className="size-4 lg:size-3.5 xl:size-3.5 2xl:size-4" />
              </a>
            </div>
          </div>

          <div className="relative z-10 mt-auto flex shrink-0 flex-col gap-1.5 border-t border-white/15 px-3 pt-2 max-lg:gap-1 max-lg:pt-1.5 lg:gap-1.5 lg:pt-2 xl:gap-2 xl:pt-2.5 2xl:gap-3 2xl:pt-4">
            <div className="flex items-center gap-2">
              <LanguageSwitcher
                dropUp
                className="min-w-0 flex-1 [&>button]:border-white/30 [&>button]:bg-white/10 [&>button]:px-2.5 [&>button]:py-1.5 [&>button]:text-xs [&>button]:text-white [&>button]:backdrop-blur-md [&>button]:hover:border-white/60 [&>button]:hover:bg-white/20 [&>button]:hover:text-white sm:[&>button]:px-3 sm:[&>button]:text-sm lg:[&>button]:px-2 lg:[&>button]:py-1 lg:[&>button]:text-xs xl:[&>button]:px-2.5 xl:[&>button]:text-sm 2xl:[&>button]:px-3"
              />
              <ThemeToggle variant="onDark" className="!size-9 shrink-0 sm:!size-10 lg:!size-9 xl:!size-10 2xl:!size-11" />
            </div>
            <Magnetic className="w-full">
              <Button
                type="button"
                variant="ghost"
                className="min-h-10 w-full whitespace-normal border border-white/35 bg-white/15 px-2.5 py-2 text-center text-xs leading-snug text-white shadow-[0_10px_28px_rgba(0,0,0,0.16)] backdrop-blur-md hover:bg-white/25 hover:text-white sm:min-h-11 sm:px-3 sm:py-2.5 sm:text-sm lg:min-h-8 lg:px-2 lg:py-1.5 lg:text-[11px] lg:leading-tight xl:min-h-9 xl:text-xs 2xl:min-h-12 2xl:px-3 2xl:py-3 2xl:text-sm"
                onClick={() => {
                  setMobileNavOpen(false);
                  openLeadPopup();
                }}
              >
                {common.freeConsultation}
              </Button>
            </Magnetic>
          </div>
        </div>
      </aside>

      <main className="relative z-10 pt-20 lg:pt-8 lg:pl-[12rem] xl:pl-[13.25rem] 2xl:pl-[14.5rem]">
        <section
          id="home"
          ref={heroRef}
          className="section-shell pt-8 pb-14 sm:pt-14 sm:pb-24"
        >
          <div>
            <Reveal>
              <div className="space-y-8">
                <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-[#0C3272]/10 bg-white/80 px-3 py-2 text-xs text-[#0C3272] shadow-sm backdrop-blur-sm sm:px-4 sm:text-sm dark:border-white/10 dark:bg-slate-900/70 dark:text-blue-200">
                  <ShieldCheck className="size-4 shrink-0" />
                  <span className="min-w-0 leading-snug">{hero.badge}</span>
                </div>

                <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-10 xl:gap-14">
                  <div className="min-w-0 flex-1 space-y-5 max-w-3xl 2xl:max-w-4xl">
                    <h1 className="text-balance text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl md:text-5xl 2xl:text-6xl dark:text-white">
                      {hero.title.split("\n").map((line) => (
                        <span key={line} className="block">
                          {line}
                        </span>
                      ))}
                    </h1>
                    <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8 md:text-xl 2xl:max-w-3xl 2xl:text-2xl 2xl:leading-10 dark:text-slate-300">
                      {hero.subtitle}
                    </p>
                  </div>

                  <HeroBlogSpotlight
                    blog={sections.blog}
                    limit={6}
                    className="w-full shrink-0 pb-6 lg:mt-8 xl:mt-10 lg:w-[min(100%,300px)] xl:w-[320px] 2xl:w-[360px]"
                  />
                </div>

                <div className="flex flex-col gap-4 sm:flex-row">
                  <Magnetic>
                    <Button
                      type="button"
                      size="large"
                      className="w-full sm:w-auto"
                      onClick={openLeadPopup}
                    >
                      {hero.ctaPrimary}
                      <ArrowUpRight className="ml-2 size-4" />
                    </Button>
                  </Magnetic>
                  <a href="#services">
                    <Button variant="secondary" size="large" className="w-full sm:w-auto">
                      {hero.ctaSecondary}
                    </Button>
                  </a>
                </div>

                <div className="grid gap-4 sm:grid-cols-3 max-w-3xl 2xl:max-w-4xl">
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

          <BrandLogoMarquee label={hero.trustedBrandsLabel} />
        </section>

        <section id="services" className="section-shell py-14 sm:py-20">
          <Reveal>
            <SectionHeading
              title={sections.services.title}
              description={sections.services.description}
            />
          </Reveal>
          <div className="mt-12 space-y-14">
            {services.map((group, groupIndex) => (
              <div key={group.title}>
                <Reveal>
                  <div className="flex items-start gap-4 sm:items-center">
                    <span className="mt-1.5 text-sm font-semibold text-[#0C3272]/50 sm:mt-0 dark:text-blue-300/60">
                      0{groupIndex + 1}
                    </span>
                    <div className="min-w-0 shrink-0">
                      <h3 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl dark:text-white">
                        {group.title}
                      </h3>
                      <p className="mt-0.5 text-xs text-slate-500 sm:text-sm dark:text-slate-400">
                        {sections.services.selectHint}
                      </p>
                    </div>
                    <div className="mt-3 h-px flex-1 self-center bg-gradient-to-r from-[#0C3272]/20 to-transparent dark:from-blue-300/20" />
                  </div>
                </Reveal>

                <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                  {group.items.map((service, itemIndex) => {
                    const iconIndex =
                      groupIndex === 0 ? itemIndex : itemIndex + 7;
                    const Icon = serviceIcons[iconIndex] ?? Sparkles;
                    const isSelected = selectedServices.some(
                      (item) => item.title === service.title,
                    );

                    return (
                      <Reveal
                        key={service.title}
                        delay={itemIndex * 0.06}
                        variant="card"
                      >
                        <button
                          type="button"
                          aria-pressed={isSelected}
                          onClick={() => toggleSelectedService(service)}
                          className={cn(
                            "glass-card group h-full w-full rounded-[28px] border border-white/60 p-5 text-left transition duration-300 hover:-translate-y-1 hover:border-[#0C3272]/20 hover:shadow-[0_24px_70px_rgba(12,50,114,0.14)] dark:border-white/10 dark:hover:border-blue-300/25",
                            isSelected && "service-card--selected relative z-10",
                          )}
                        >
                          <div className="flex items-center gap-3.5">
                            <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#0C3272] text-white shadow-[0_12px_30px_rgba(12,50,114,0.2)] transition-transform duration-300 group-hover:scale-105 dark:bg-blue-600">
                              <Icon className="size-5" />
                            </div>
                            <h4 className="text-lg font-semibold leading-snug text-slate-950 dark:text-white">
                              {service.title}
                            </h4>
                          </div>
                          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                            {service.description}
                          </p>
                        </button>
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
                    <h3 className="mt-4 whitespace-pre-line text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">
                      {content.serviceInquiry.title}
                    </h3>
                    <p className="mt-4 max-w-xl leading-7 text-blue-100/90">
                      {content.serviceInquiry.description}
                    </p>
                    {selectedServices.length > 0 ? (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-blue-100/90">
                          {content.serviceInquiry.selectedServicesLabel}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {selectedServices.map((service) => (
                            <span
                              key={service.title}
                              className="group/chip inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 py-1.5 pr-1.5 pl-3 text-sm text-white"
                            >
                              <span>{service.title}</span>
                              <button
                                type="button"
                                aria-label={`${content.serviceInquiry.removeServiceAria}: ${service.title}`}
                                onClick={() => toggleSelectedService(service)}
                                className="flex size-5 shrink-0 items-center justify-center rounded-full text-white/80 opacity-0 transition-all duration-200 group-hover/chip:opacity-100 hover:scale-125 hover:text-white focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                              >
                                <X className="size-3.5" />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                  <ServiceInquiryForm
                    key={content.locale}
                    content={content}
                    selectedServices={selectedServices}
                    onClearSelectedServices={() => setSelectedServices([])}
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <ProcessScrollCarousel
          copy={sections.process}
          steps={processSteps}
        />

        <PortfolioScrollShowcase
          portfolio={sections.portfolio}
          results={sections.results}
          items={portfolioItems}
          statistics={statistics}
        />

        <BlogSection
          blog={sections.blog}
          limit={3}
          viewAllHref="/blog"
        />

        <MarketerShowcase
          copy={sections.marketer}
          social={baseSiteConfig.social}
        />

        <section id="testimonials" className="section-shell py-14 sm:py-20">
          <Reveal>
            <p className="mb-8 text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-[#0C3272] sm:text-sm sm:tracking-[0.3em] dark:text-blue-300">
              {sections.testimonials.eyebrow}
            </p>
          </Reveal>

          <Reveal variant="card">
            <div
              className={cn(
                "video-marquee overflow-hidden",
                isTestimonialPlaying && "is-playing",
              )}
            >
              <div
                className="video-marquee-track flex w-max"
                style={{
                  animationPlayState: isTestimonialPlaying ? "paused" : "running",
                }}
              >
                {[0, 1].map((groupIndex) => (
                  <div
                    key={groupIndex}
                    aria-hidden={groupIndex === 1 ? "true" : undefined}
                    className="flex shrink-0 gap-5 pr-5"
                  >
                    {videoTestimonials.map((item) => (
                      <div
                        key={`${groupIndex}-${item.src}`}
                        className="w-[min(82vw,283px)] shrink-0 sm:w-[min(75vw,283px)]"
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
            <div className="mx-auto mt-12 flex max-w-3xl flex-col items-center text-center">
              <SectionHeading
                title={sections.testimonials.title}
                description={sections.testimonials.description}
                align="center"
              />
              <div className="mt-8">
                <Magnetic>
                  <Button type="button" size="large" onClick={openLeadPopup}>
                    {sections.testimonials.cta}
                    <ArrowUpRight className="ml-2 size-4" />
                  </Button>
                </Magnetic>
              </div>
            </div>
          </Reveal>
        </section>

        <section id="smm-samarqand" className="section-shell py-14 sm:py-20">
          <Reveal>
            <SectionHeading
              eyebrow={sections.localSeo.eyebrow}
              title={sections.localSeo.title}
              description={sections.localSeo.lead}
            />
            <div className="mt-8 max-w-3xl space-y-4 text-base leading-7 text-slate-600 sm:text-lg sm:leading-8 dark:text-slate-300">
              {sections.localSeo.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-slate-950 dark:text-white">
                {sections.localSeo.servicesTitle}
              </h3>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {sections.localSeo.services.map((item) => (
                  <li
                    key={item}
                    className="rounded-2xl border border-[#0C3272]/10 bg-white/70 px-4 py-3 text-sm font-medium text-slate-800 dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-100"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </section>

        <section className="section-shell py-14 sm:py-20">
          <Reveal>
            <div className="relative overflow-hidden rounded-[28px] bg-[#0C3272] px-5 py-10 text-white shadow-[0_30px_90px_rgba(12,50,114,0.28)] sm:rounded-[40px] sm:px-10 sm:py-12 lg:px-14">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.22),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.16),_transparent_20%)]" />
              <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
                <div className="space-y-4">
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-100">
                    {sections.finalCta.eyebrow}
                  </p>
                  <h2 className="max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl 2xl:max-w-4xl 2xl:text-6xl">
                    {sections.finalCta.title}
                  </h2>
                  <p className="max-w-2xl text-base leading-7 text-blue-50 sm:text-lg sm:leading-8 2xl:max-w-3xl 2xl:text-xl">
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

      <footer id="contact" className="relative z-10 bg-slate-950 py-14 text-white sm:py-20 lg:pl-[12rem] xl:pl-[13.25rem] 2xl:pl-[14.5rem]">
        <div className="section-shell flex flex-col gap-10 lg:grid lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <Reveal className="order-1 lg:order-none lg:col-start-1">
            <div className="space-y-6">
              <h2 className="max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl 2xl:max-w-2xl 2xl:text-6xl">
                {sections.contact.title}
              </h2>
              <p className="max-w-xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8 2xl:max-w-2xl 2xl:text-xl">
                {sections.contact.description}
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.08} className="order-2 lg:order-none lg:col-start-2 lg:row-start-1">
            <div className="rounded-[28px] border border-white/10 bg-white/6 p-5 shadow-2xl shadow-black/20 backdrop-blur-xl sm:rounded-[36px] sm:p-8">
              <ContactForm key={content.locale} content={content} />
            </div>
          </Reveal>

          <Reveal className="order-3 lg:order-none lg:col-start-1">
            <div className="space-y-6">
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
                        className="block break-all text-sm font-semibold text-white transition hover:text-blue-200 sm:text-base"
                      >
                        {phone.display}
                      </a>
                    ))}
                  </div>
                  <a
                    href={baseSiteConfig.phoneHref}
                    aria-label={`${baseSiteConfig.name} — ${baseSiteConfig.phoneDisplay}`}
                    className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-blue-100 transition hover:bg-white/10 hover:text-white"
                  >
                    <PhoneCall className="size-4" />
                    {sections.contact.phoneCallCta}
                  </a>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08} className="order-4 lg:order-none lg:col-start-2">
            <div className="overflow-hidden rounded-[36px] border border-white/10 bg-white/5 shadow-2xl shadow-black/20 backdrop-blur-xl">
              <div className="flex flex-col gap-3 px-4 pt-5 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:px-6">
                <div className="flex min-w-0 items-start gap-2 text-sm font-semibold text-white">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-blue-200" />
                  <span className="min-w-0 break-words">{sections.contact.addressValue}</span>
                </div>
                <a
                  href={baseSiteConfig.mapHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-blue-100 transition hover:bg-white/20"
                >
                  {sections.contact.mapCta}
                  <ArrowUpRight className="size-3.5" />
                </a>
              </div>
              <div className="mt-4 aspect-[4/3] w-full sm:aspect-[16/10]">
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
          </Reveal>
        </div>
      </footer>

      <button
        type="button"
        aria-label={common.backToTop}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={cn(
          "fixed bottom-4 right-4 z-50 flex size-11 items-center justify-center rounded-full bg-[#0C3272] text-white shadow-[0_20px_40px_rgba(12,50,114,0.28)] transition-all sm:bottom-6 sm:right-6 sm:size-12 dark:bg-slate-800",
          showBackToTop
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0",
        )}
      >
        <ChevronUp className="size-5" />
      </button>

    </div>
  );
}

function Reveal({
  children,
  delay = 0,
  variant = "rise",
  className,
}: {
  children: ReactNode;
  delay?: number;
  variant?: "rise" | "card";
  className?: string;
}) {
  const initial =
    variant === "card" ? { opacity: 0, y: 24, scale: 0.94 } : { opacity: 0, y: 24 };
  const whileInView =
    variant === "card" ? { opacity: 1, y: 0, scale: 1 } : { opacity: 1, y: 0 };

  return (
    <motion.div
      className={className}
      initial={initial}
      whileInView={whileInView}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.55, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}


