"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ImageIcon, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { BiographyPhotoRibbon } from "@/components/shared/biography-photo-ribbon";
import { EcosystemChart } from "@/components/shared/ecosystem-chart";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { ShaxzodFooter } from "@/components/shared/shaxzod-footer";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  getShaxzodProfile,
  type ShaxzodPhotoSlot,
} from "@/content/shaxzod";
import { baseSiteConfig } from "@/content/base";
import { useLanguage } from "@/context/language-context";
import { cn } from "@/lib/utils";

/** Wider page shell for profile — fills more of the viewport than section-shell */
const profileShell =
  "mx-auto w-full max-w-[100rem] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-14 2xl:max-w-[112rem] 2xl:px-16 min-[1920px]:max-w-[120rem] min-[1920px]:px-20";

function PhotoSlot({
  slot,
  className,
  imageClassName,
  priority = false,
}: {
  slot: ShaxzodPhotoSlot;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(!slot.src);

  const aspectClass =
    slot.aspect === "portrait"
      ? "aspect-[3/4]"
      : slot.aspect === "square"
        ? "aspect-square"
        : "aspect-[16/10]";

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[24px] border border-[#0C3272]/10 bg-gradient-to-br from-[#0C3272]/8 via-white to-blue-50 dark:border-white/10 dark:from-slate-900 dark:via-slate-900 dark:to-[#0C3272]/30",
        aspectClass,
        className,
      )}
    >
      {!failed && slot.src ? (
        <Image
          src={slot.src}
          alt={slot.alt}
          fill
          unoptimized
          priority={priority}
          className={cn("object-cover", imageClassName)}
          sizes="(max-width: 768px) 100vw, 40vw"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-4 text-center">
          <ImageIcon className="size-7 text-[#0C3272]/35 dark:text-blue-300/40" />
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#0C3272]/45 dark:text-blue-200/40">
            Photo
          </p>
        </div>
      )}
    </div>
  );
}

export function ShaxzodProfilePage() {
  const { locale } = useLanguage();
  const profile = getShaxzodProfile(locale);
  const reduceMotion = useReducedMotion();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const shortName = profile.name.split(" ")[0] ?? profile.name;

  const navItems = [
    { href: "#biography", label: profile.nav.biography },
    { href: "#mentors", label: profile.nav.mentors },
    { href: "#journey", label: profile.nav.journey },
    { href: "#ecosystem", label: profile.nav.ecosystem },
    { href: "#vacancies", label: profile.nav.vacancies },
    { href: "#contact", label: profile.nav.contact },
  ] as const;

  useEffect(() => {
    if (!mobileNavOpen) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setMobileNavOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mobileNavOpen]);

  useEffect(() => {
    function onResize() {
      if (window.matchMedia("(min-width: 1024px)").matches) {
        setMobileNavOpen(false);
      }
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div
      id="top"
      className="relative min-h-screen overflow-x-clip bg-[linear-gradient(180deg,#f6f8ff_0%,#ffffff_30%,#eef4ff_100%)] dark:bg-[linear-gradient(180deg,#0b1220_0%,#0f172a_38%,#0b1220_100%)]"
    >
      <header className="sticky top-0 z-40 border-b border-[#0C3272]/8 bg-white/75 backdrop-blur-md dark:border-white/10 dark:bg-slate-950/70">
        <div className={cn(profileShell, "flex items-center gap-2 py-3 sm:gap-3 sm:py-3.5 lg:gap-4")}>
          <div className="flex min-w-0 shrink items-center gap-2 sm:gap-3 lg:min-w-[19.5rem] xl:min-w-[21rem]">
            <Link
              href="#top"
              className="min-w-0 shrink truncate text-sm font-semibold tracking-tight text-[#0C3272] sm:text-base dark:text-blue-300"
            >
              <span className="lg:hidden">{shortName}</span>
              <span className="hidden lg:inline">{profile.name}</span>
            </Link>
            <a
              href={`${baseSiteConfig.url.replace(/\/$/, "")}/#blog`}
              aria-label="Progress.uzb — Blog"
              className="hidden shrink-0 sm:inline-flex"
            >
              <Image
                src="/shaxzod/progress-horizontal.webp"
                alt="Progress"
                width={521}
                height={107}
                priority
                className="h-[16px] w-auto sm:h-[18px] dark:brightness-0 dark:invert"
              />
            </a>
          </div>

          <nav
            aria-label="Profile sections"
            className="hidden min-w-0 flex-1 lg:block"
          >
            <ul className="flex w-full items-center justify-center gap-0.5 px-1 lg:gap-1.5 xl:gap-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="inline-flex whitespace-nowrap rounded-full px-2 py-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-600 transition hover:bg-[#0C3272]/8 hover:text-[#0C3272] lg:px-2.5 lg:text-[11px] xl:px-3 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-blue-200"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
            <LanguageSwitcher
              compact
              className="w-auto [&_button]:w-auto [&_button]:min-w-0"
            />
            <ThemeToggle className="!size-9 sm:!size-11" />
            <button
              type="button"
              className="inline-flex size-9 items-center justify-center rounded-full border border-slate-200/80 bg-white/90 text-slate-700 transition hover:border-[#0C3272]/40 hover:text-[#0C3272] lg:hidden dark:border-white/30 dark:bg-white/10 dark:text-white dark:hover:border-white/60"
              aria-expanded={mobileNavOpen}
              aria-controls="shaxzod-mobile-nav"
              aria-label={mobileNavOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileNavOpen((open) => !open)}
            >
              {mobileNavOpen ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileNavOpen ? (
            <motion.nav
              id="shaxzod-mobile-nav"
              aria-label="Profile sections"
              initial={reduceMotion ? false : { height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="overflow-hidden border-t border-[#0C3272]/8 lg:hidden dark:border-white/10"
            >
              <ul className={cn(profileShell, "flex flex-col gap-1 py-3")}>
                {navItems.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      onClick={() => setMobileNavOpen(false)}
                      className="flex rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-[#0C3272]/8 hover:text-[#0C3272] dark:text-slate-200 dark:hover:bg-white/10 dark:hover:text-blue-200"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.nav>
          ) : null}
        </AnimatePresence>
      </header>

      <main>
        {/* Hero — centered cutout portrait */}
        <section
          className={cn(
            profileShell,
            "relative overflow-hidden pb-8 pt-0 sm:pb-12 lg:pb-14",
          )}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0 flex flex-col items-center justify-center overflow-hidden text-center font-heading text-[clamp(2.75rem,12vw,14rem)] font-black uppercase leading-[0.84] tracking-[-0.075em] text-[#0C3272]/10 select-none dark:text-white/[0.07]"
          >
            <span>Shakhzod</span>
            <span>Turakulov</span>
          </div>

          <div className="relative grid w-full items-start gap-6 lg:grid-cols-2 lg:items-end lg:gap-8 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,1.2fr)_minmax(0,1.05fr)] xl:gap-12">
            {/* Center portrait — first on mobile, middle on xl */}
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.06 }}
              className="order-1 relative z-10 mx-auto flex w-full max-w-[22rem] justify-center sm:max-w-[28rem] lg:col-span-2 lg:max-w-none xl:order-none xl:col-span-1 xl:col-start-2"
            >
              <div className="relative h-[18rem] w-full overflow-hidden bg-transparent sm:h-[24rem] lg:h-[32rem] xl:h-[40rem] 2xl:h-[44rem]">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-[18%] bottom-2 h-10 rounded-full bg-black/10 blur-2xl"
                />
                <Image
                  src={profile.portraitSrc}
                  alt={profile.name}
                  fill
                  unoptimized
                  priority
                  className="translate-y-3 object-contain object-bottom drop-shadow-[0_28px_50px_rgba(15,23,42,0.18)] xl:translate-y-4"
                  sizes="(max-width: 1024px) 28rem, 42rem"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-32 sm:h-40 lg:h-52 xl:h-72"
                >
                  <div className="absolute inset-0 backdrop-blur-[6px] [mask-image:linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.35)_35%,#000_72%)]" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(246,248,255,0.35)_28%,rgba(246,248,255,0.88)_68%,#f6f8ff_100%)] dark:bg-[linear-gradient(180deg,transparent_0%,rgba(11,18,32,0.38)_28%,rgba(11,18,32,0.9)_68%,#0b1220_100%)]" />
                </div>
              </div>
            </motion.div>

            {/* Left: role badge + mission */}
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="order-2 relative z-20 space-y-3 self-end sm:space-y-4 lg:order-none lg:col-start-1 lg:row-start-2 lg:self-start lg:pt-2 xl:col-start-1 xl:row-start-1 xl:pt-4"
            >
              <span className="inline-flex max-w-full whitespace-normal rounded-full bg-[#0C3272] px-3.5 py-2 text-sm font-semibold tracking-tight text-white shadow-[0_12px_32px_rgba(12,50,114,0.28)] sm:px-4 sm:py-2.5 sm:text-base dark:bg-blue-400 dark:text-slate-950">
                {profile.role}
              </span>
              <p className="max-w-md text-sm leading-7 text-slate-600 sm:text-base sm:leading-8 xl:max-w-lg xl:text-lg dark:text-slate-300">
                <span className="block">&ldquo;{profile.mission.body.line1}</span>
                <span className="block font-bold text-[#0C3272] dark:text-white">
                  {profile.mission.body.highlight}
                </span>
                <span className="block">{profile.mission.body.line3}&rdquo;</span>
              </p>
            </motion.div>

            {/* Right: intro + CTA */}
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="order-3 relative z-20 space-y-4 self-end sm:space-y-5 lg:order-none lg:col-start-2 lg:row-start-2 lg:justify-self-end xl:col-start-3 xl:row-start-1 xl:-translate-y-16 xl:pb-6"
            >
              <p className="max-w-md text-sm leading-7 text-slate-600 sm:text-base sm:leading-8 xl:max-w-lg xl:text-lg dark:text-slate-300 xl:text-right">
                {profile.intro}
              </p>
              <div className="xl:flex xl:justify-end">
                <Link
                  href={baseSiteConfig.social.telegram}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(
                    buttonVariants({ size: "large" }),
                    "min-h-12 w-full px-6 text-base sm:min-h-14 sm:w-auto sm:px-8 sm:text-lg",
                  )}
                >
                  {profile.heroCta}
                  <ArrowUpRight className="ml-2 size-4" />
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Biography */}
        <section id="biography" className={cn(profileShell, "scroll-mt-24 py-10 sm:py-16")}>
          <div className="space-y-7 lg:space-y-10">
            <div className="space-y-3 text-center">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl dark:text-white">
                {profile.biography.title}
              </h2>
            </div>

            <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-10 xl:gap-12">
              <div className="space-y-5 lg:space-y-8">
                <div className="grid gap-3 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] sm:gap-4 lg:gap-5">
                  <div className="grid gap-3 lg:gap-5">
                    {profile.biography.facts.slice(0, 2).map((fact) => (
                      <div
                        key={fact.label}
                        className="rounded-[20px] border border-slate-200/80 bg-white/70 px-4 py-3.5 sm:px-5 sm:py-4 dark:border-white/10 dark:bg-slate-900/50"
                      >
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                          {fact.label}
                        </p>
                        <p className="mt-1.5 text-sm font-medium leading-6 text-slate-900 sm:text-base dark:text-slate-100">
                          {fact.value}
                        </p>
                      </div>
                    ))}
                  </div>
                  {profile.biography.facts.slice(2).map((fact) => (
                    <div
                      key={fact.label}
                      className="flex flex-col justify-center rounded-[24px] border border-slate-200/80 bg-white/70 p-4 sm:p-6 dark:border-white/10 dark:bg-slate-900/50"
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                        {fact.label}
                      </p>
                      <p className="mt-2 text-sm font-medium leading-6 text-slate-900 sm:text-base dark:text-slate-100">
                        {fact.value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                  <div className="rounded-[28px] border border-slate-200/80 bg-white/70 p-5 sm:p-7 dark:border-white/10 dark:bg-slate-900/50">
                    <h3 className="text-lg font-semibold text-slate-950 sm:text-xl dark:text-white">
                      {profile.biography.educationTitle}
                    </h3>
                    <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-600 sm:text-base sm:leading-8 dark:text-slate-300">
                      {profile.biography.education.map((item) => (
                        <li key={item.slice(0, 40)} className="flex gap-2">
                          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[#0C3272] dark:bg-blue-300" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-[28px] border border-slate-200/80 bg-white/70 p-5 sm:p-7 dark:border-white/10 dark:bg-slate-900/50">
                    <h3 className="text-lg font-semibold text-slate-950 sm:text-xl dark:text-white">
                      {profile.biography.careerTitle}
                    </h3>
                    <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-600 sm:text-base sm:leading-8 dark:text-slate-300">
                      {profile.biography.career.map((item) => (
                        <li key={item.slice(0, 40)} className="flex gap-2">
                          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[#0C3272] dark:bg-blue-300" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <PhotoSlot
                slot={profile.photos.biography}
                priority
                className="mx-auto w-full max-w-md xl:sticky xl:top-28 xl:max-w-none"
              />
            </div>

            <BiographyPhotoRibbon
              photos={profile.biography.gallery}
              label={profile.biography.galleryLabel}
            />
          </div>
        </section>

        {/* Mentors */}
        <section id="mentors" className={cn(profileShell, "scroll-mt-24 py-10 sm:py-16")}>
          <div className="space-y-6 lg:space-y-10">
            <div className="max-w-3xl space-y-3 lg:max-w-4xl">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl dark:text-white">
                {profile.mentors.title}
              </h2>
              <p className="text-sm leading-7 text-slate-600 sm:text-lg sm:leading-8 dark:text-slate-300">
                {profile.mentors.intro}
              </p>
            </div>
            <div className="grid gap-2.5 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 lg:gap-4">
              {profile.mentors.names.map((name) => (
                <div
                  key={name}
                  className="interactive-glow relative isolate overflow-hidden rounded-[24px] border border-white bg-[#0C3272]/22 px-4 py-3 text-center text-sm font-semibold text-[#0C3272] shadow-[0_0_18px_rgba(255,255,255,0.55),0_8px_24px_rgba(12,50,114,0.12),inset_0_1px_0_rgba(255,255,255,0.75)] backdrop-blur-md sm:px-5 sm:py-4 sm:text-base dark:border-white/50 dark:bg-[#0C3272]/40 dark:text-blue-100 dark:shadow-[0_0_16px_rgba(255,255,255,0.22),0_8px_24px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.28)]"
                >
                  <span className="relative z-[2]">{name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Business journey */}
        <section id="journey" className={cn(profileShell, "scroll-mt-24 py-10 sm:py-16")}>
          <div className="max-w-3xl space-y-3 lg:max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#0C3272] dark:text-blue-300">
              {profile.journey.eyebrow}
            </p>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl dark:text-white">
              {profile.journey.title}
            </h2>
          </div>

          <ol className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3 2xl:grid-cols-4 xl:gap-6">
            {profile.journey.items.map((item, index) => (
              <li
                key={`${item.period}-${item.name}`}
                className="relative rounded-[28px] border border-slate-200/80 bg-white/70 p-5 sm:p-7 dark:border-white/10 dark:bg-slate-900/50"
              >
                <span className="inline-flex size-8 items-center justify-center rounded-full bg-[#0C3272]/10 text-xs font-bold text-[#0C3272] dark:bg-blue-300/15 dark:text-blue-300">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#0C3272] dark:text-blue-300">
                  {item.period}
                </p>
                <h3 className="mt-1 text-lg font-semibold text-slate-950 sm:text-xl dark:text-white">
                  {item.name}
                </h3>
                <p className="mt-2 text-sm leading-7 text-slate-600 sm:text-base sm:leading-8 dark:text-slate-300">
                  {item.description}
                </p>
              </li>
            ))}
          </ol>
        </section>

        {/* Ecosystem */}
        <section id="ecosystem" className={cn(profileShell, "scroll-mt-24 py-10 sm:py-16")}>
          <div className="overflow-hidden rounded-[28px] bg-[#070d1a] px-3 py-10 sm:rounded-[32px] sm:px-8 sm:py-16 lg:px-12">
            <h2 className="text-center text-2xl font-bold tracking-tight text-white sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
              {profile.ecosystem.title}
            </h2>
            <div className="mt-8 sm:mt-12">
              <EcosystemChart items={profile.ecosystem.items} />
            </div>
          </div>
        </section>

        {/* Vacancies */}
        <section id="vacancies" className={cn(profileShell, "scroll-mt-24 py-10 sm:py-16")}>
          <div className="overflow-hidden rounded-[28px] bg-[#0C3272] px-5 py-8 text-white shadow-[0_30px_90px_rgba(12,50,114,0.28)] sm:rounded-[32px] sm:px-10 sm:py-12 lg:px-14 lg:py-14">
            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:gap-12">
              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-100">
                  {profile.vacancies.eyebrow}
                </p>
                <h2 className="text-2xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                  {profile.vacancies.title}
                </h2>
                <p className="max-w-3xl text-sm leading-7 text-blue-50/90 sm:text-base sm:leading-8">
                  {profile.vacancies.intro}
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {profile.vacancies.roles.map((role) => (
                    <span
                      key={role}
                      className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-blue-50 sm:text-sm"
                    >
                      {role}
                    </span>
                  ))}
                </div>
                <div className="pt-4">
                  <p className="text-sm font-semibold text-white sm:text-base">
                    {profile.vacancies.internshipTitle}
                  </p>
                  <p className="mt-2 max-w-3xl text-sm leading-7 text-blue-100/90 sm:text-base sm:leading-8">
                    {profile.vacancies.internshipBody}
                  </p>
                </div>
                <div className="pt-2">
                  <Button
                    type="button"
                    disabled
                    size="large"
                    className="w-full bg-white text-[#0C3272] hover:bg-blue-50 hover:text-[#0C3272] sm:w-auto"
                  >
                    {profile.vacancies.cta}
                    <ArrowUpRight className="ml-2 size-4" />
                  </Button>
                </div>
              </div>
              <PhotoSlot
                slot={profile.photos.vacancies}
                imageClassName="object-[center_38%] scale-[1.02]"
                className="w-full border border-white/25 bg-white/5 shadow-[0_24px_60px_rgba(0,0,0,0.28)] ring-1 ring-white/20"
              />
            </div>
          </div>
        </section>
      </main>

      <ShaxzodFooter />
    </div>
  );
}
