"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ImageIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { BiographyPhotoRibbon } from "@/components/shared/biography-photo-ribbon";
import { EcosystemChart } from "@/components/shared/ecosystem-chart";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { ShaxzodFooter } from "@/components/shared/shaxzod-footer";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  getShaxzodProfile,
  type ShaxzodPhotoSlot,
  type ShaxzodProfile,
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

  const navItems = [
    { href: "#biography", label: profile.nav.biography },
    { href: "#mentors", label: profile.nav.mentors },
    { href: "#journey", label: profile.nav.journey },
    { href: "#ecosystem", label: profile.nav.ecosystem },
    { href: "#vacancies", label: profile.nav.vacancies },
    { href: "#contact", label: profile.nav.contact },
  ] as const;

  return (
    <div
      id="top"
      className="relative min-h-screen overflow-x-clip bg-[linear-gradient(180deg,#f6f8ff_0%,#ffffff_30%,#eef4ff_100%)] dark:bg-[linear-gradient(180deg,#0b1220_0%,#0f172a_38%,#0b1220_100%)]"
    >
      <header className="sticky top-0 z-40 border-b border-[#0C3272]/8 bg-white/75 backdrop-blur-md dark:border-white/10 dark:bg-slate-950/70">
        <div className={cn(profileShell, "flex items-center gap-2 py-3.5 sm:gap-3 lg:gap-4")}>
          <div className="flex shrink-0 items-center sm:min-w-[19.5rem] md:min-w-[21rem]">
            <Link
              href="#top"
              className="shrink-0 text-sm font-semibold tracking-tight text-[#0C3272] sm:text-base dark:text-blue-300"
            >
              {profile.name}
            </Link>
            <div className="hidden flex-1 justify-center sm:flex">
              <Link href="#top" aria-label="Progress" className="shrink-0">
                <Image
                  src="/shaxzod/progress-horizontal.png"
                  alt="Progress"
                  width={521}
                  height={107}
                  priority
                  className="h-[18px] w-auto dark:brightness-0 dark:invert"
                />
              </Link>
            </div>
          </div>

          <nav
            aria-label="Profile sections"
            className="min-w-0 flex-1 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <ul className="flex w-max min-w-full items-center justify-center gap-0.5 px-1 sm:gap-1 lg:gap-1.5 xl:gap-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="inline-flex whitespace-nowrap rounded-full px-2 py-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-600 transition hover:bg-[#0C3272]/8 hover:text-[#0C3272] sm:px-2.5 sm:text-[11px] xl:px-3 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-blue-200"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-2.5">
            <LanguageSwitcher className="w-auto [&_button]:w-auto [&_button]:min-w-0 [&_button]:px-3" />
            <ThemeToggle />
          </div>
        </div>
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
            className="pointer-events-none absolute inset-0 z-0 flex flex-col items-center justify-center overflow-hidden text-center font-heading text-[clamp(4.5rem,14vw,14rem)] font-black uppercase leading-[0.84] tracking-[-0.075em] text-[#0C3272]/10 select-none dark:text-white/[0.07]"
          >
            <span>Shakhzod</span>
            <span>Turakulov</span>
          </div>

          <div className="relative grid w-full items-start gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1.2fr)_minmax(0,1.05fr)] lg:items-end lg:gap-8 xl:gap-12">
            {/* Left: role badge + mission */}
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="order-2 relative z-20 space-y-4 self-end lg:order-none lg:self-start lg:translate-y-0 lg:pb-0 lg:pt-2 xl:pt-4"
            >
              <span className="inline-flex rounded-full bg-[#0C3272] px-4 py-2.5 text-base font-semibold tracking-tight text-white shadow-[0_12px_32px_rgba(12,50,114,0.28)] dark:bg-blue-400 dark:text-slate-950">
                {profile.role}
              </span>
              <p className="max-w-md text-base leading-8 text-slate-600 sm:text-lg sm:leading-8 xl:max-w-lg dark:text-slate-300">
                <span className="block">&ldquo;{profile.mission.body.line1}</span>
                <span className="block font-bold text-[#0C3272] dark:text-white">
                  {profile.mission.body.highlight}
                </span>
                <span className="block">{profile.mission.body.line3}&rdquo;</span>
              </p>
            </motion.div>

            {/* Center: person cutout, no card background */}
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.06 }}
              className="order-1 relative z-10 mx-auto flex w-full max-w-[26rem] justify-center sm:max-w-[32rem] lg:order-none lg:max-w-none"
            >
              <div className="relative h-[22rem] w-full overflow-hidden bg-transparent sm:h-[28rem] lg:h-[36rem] xl:h-[40rem] 2xl:h-[44rem]">
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
                  className="translate-y-3 object-contain object-bottom drop-shadow-[0_28px_50px_rgba(15,23,42,0.18)] lg:translate-y-4"
                  sizes="(max-width: 1024px) 32rem, 42rem"
                />
                {/* Fade only over the portrait cut-off — into page white */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-44 sm:h-52 lg:h-64 xl:h-72"
                >
                  <div className="absolute inset-0 backdrop-blur-[6px] [mask-image:linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.35)_35%,#000_72%)]" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(246,248,255,0.35)_28%,rgba(246,248,255,0.88)_68%,#f6f8ff_100%)] dark:bg-[linear-gradient(180deg,transparent_0%,rgba(11,18,32,0.38)_28%,rgba(11,18,32,0.9)_68%,#0b1220_100%)]" />
                </div>
              </div>
            </motion.div>

            {/* Right: intro + CTA */}
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="order-3 relative z-20 space-y-5 self-end lg:order-none lg:justify-self-end lg:-translate-y-12 lg:pb-6 xl:-translate-y-16"
            >
              <p className="max-w-md text-base leading-8 text-slate-600 sm:text-lg sm:leading-8 xl:max-w-lg dark:text-slate-300 lg:text-right">
                {profile.intro}
              </p>
              <div className="lg:flex lg:justify-end">
                <Link
                  href={baseSiteConfig.social.telegram}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(buttonVariants({ size: "large" }), "min-h-14 px-8 text-base sm:text-lg")}
                >
                  {profile.heroCta}
                  <ArrowUpRight className="ml-2 size-4" />
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Biography */}
        <section id="biography" className={cn(profileShell, "scroll-mt-24 py-12 sm:py-16")}>
          <div className="space-y-8 lg:space-y-10">
            <div className="space-y-3 text-center">
              <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl dark:text-white">
                {profile.biography.title}
              </h2>
            </div>

            <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-10 xl:gap-12">
              <div className="space-y-6 lg:space-y-8">
                <div className="grid gap-4 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-5">
                  <div className="grid gap-4 lg:gap-5">
                    {profile.biography.facts.slice(0, 2).map((fact) => (
                      <div
                        key={fact.label}
                        className="rounded-[20px] border border-slate-200/80 bg-white/70 px-5 py-4 dark:border-white/10 dark:bg-slate-900/50"
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
                      className="flex flex-col justify-center rounded-[24px] border border-slate-200/80 bg-white/70 p-5 sm:p-6 dark:border-white/10 dark:bg-slate-900/50"
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

                <div className="grid gap-6 sm:grid-cols-2 lg:gap-6">
                  <div className="rounded-[28px] border border-slate-200/80 bg-white/70 p-6 sm:p-7 dark:border-white/10 dark:bg-slate-900/50">
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
                  <div className="rounded-[28px] border border-slate-200/80 bg-white/70 p-6 sm:p-7 dark:border-white/10 dark:bg-slate-900/50">
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
                className="mx-auto w-full max-w-md lg:sticky lg:top-28 lg:max-w-none"
              />
            </div>

            <BiographyPhotoRibbon
              photos={profile.biography.gallery}
              label={profile.biography.galleryLabel}
            />
          </div>
        </section>

        {/* Mentors */}
        <section id="mentors" className={cn(profileShell, "scroll-mt-24 py-12 sm:py-16")}>
          <div className="space-y-8 lg:space-y-10">
            <div className="max-w-3xl space-y-3 lg:max-w-4xl">
              <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl dark:text-white">
                {profile.mentors.title}
              </h2>
              <p className="text-base leading-8 text-slate-600 sm:text-lg dark:text-slate-300">
                {profile.mentors.intro}
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 lg:gap-4">
              {profile.mentors.names.map((name) => (
                <div
                  key={name}
                  className="interactive-glow relative isolate overflow-hidden rounded-[24px] border border-white bg-[#0C3272]/22 px-5 py-4 text-center text-sm font-semibold text-[#0C3272] shadow-[0_0_18px_rgba(255,255,255,0.55),0_8px_24px_rgba(12,50,114,0.12),inset_0_1px_0_rgba(255,255,255,0.75)] backdrop-blur-md sm:text-base dark:border-white/50 dark:bg-[#0C3272]/40 dark:text-blue-100 dark:shadow-[0_0_16px_rgba(255,255,255,0.22),0_8px_24px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.28)]"
                >
                  <span className="relative z-[2]">{name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Business journey */}
        <section id="journey" className={cn(profileShell, "scroll-mt-24 py-12 sm:py-16")}>
          <div className="max-w-3xl space-y-3 lg:max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#0C3272] dark:text-blue-300">
              {profile.journey.eyebrow}
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl dark:text-white">
              {profile.journey.title}
            </h2>
          </div>

          <ol className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 xl:gap-6">
            {profile.journey.items.map((item, index) => (
              <li
                key={`${item.period}-${item.name}`}
                className="relative rounded-[28px] border border-slate-200/80 bg-white/70 p-6 sm:p-7 dark:border-white/10 dark:bg-slate-900/50"
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
        <section id="ecosystem" className={cn(profileShell, "scroll-mt-24 py-12 sm:py-16")}>
          <div className="overflow-hidden rounded-[32px] bg-[#070d1a] px-4 py-12 sm:px-8 sm:py-16 lg:px-12">
            <h2 className="text-center text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
              {profile.ecosystem.title}
            </h2>
            <div className="mt-10 sm:mt-12">
              <EcosystemChart items={profile.ecosystem.items} />
            </div>
          </div>
        </section>

        {/* Vacancies */}
        <section id="vacancies" className={cn(profileShell, "scroll-mt-24 py-12 sm:py-16")}>
          <div className="overflow-hidden rounded-[32px] bg-[#0C3272] px-6 py-10 text-white shadow-[0_30px_90px_rgba(12,50,114,0.28)] sm:px-10 sm:py-12 lg:px-14 lg:py-14">
            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:gap-12">
              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-100">
                  {profile.vacancies.eyebrow}
                </p>
                <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
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
                    className="bg-white text-[#0C3272] hover:bg-blue-50 hover:text-[#0C3272]"
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
