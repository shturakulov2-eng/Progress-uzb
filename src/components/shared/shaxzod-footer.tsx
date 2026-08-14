"use client";

import { ArrowUpRight, Send } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { baseSiteConfig } from "@/content/base";
import { getShaxzodProfile } from "@/content/shaxzod";
import { useLanguage } from "@/context/language-context";
import { cn } from "@/lib/utils";

const profileShell =
  "mx-auto w-full max-w-[100rem] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-14 2xl:max-w-[112rem] 2xl:px-16 min-[1920px]:max-w-[120rem] min-[1920px]:px-20";

const linkClass =
  "block text-sm text-slate-300 transition hover:text-white sm:text-[15px]";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function FooterHeading({ children }: { children: string }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-200/85">
      {children}
    </p>
  );
}

export function ShaxzodFooter() {
  const { content, locale } = useLanguage();
  const profile = getShaxzodProfile(locale);
  const contact = content.sections.contact;
  const marketer = content.sections.marketer;

  const profileLinks = [
    { href: "#top", label: profile.name },
    { href: "#biography", label: profile.nav.biography },
    { href: "#mentors", label: profile.nav.mentors },
    { href: "#journey", label: profile.nav.journey },
    { href: "#ecosystem", label: profile.nav.ecosystem },
    { href: "#vacancies", label: profile.nav.vacancies },
    { href: "#contact", label: profile.nav.contact },
  ];

  const socials = [
    {
      href: baseSiteConfig.social.instagram,
      label: marketer.instagramLabel,
      icon: <InstagramIcon className="size-5" />,
    },
    {
      href: baseSiteConfig.social.telegram,
      label: marketer.telegramLabel,
      icon: <Send className="size-5" />,
    },
    {
      href: baseSiteConfig.social.youtube,
      label: profile.footer.youtubeLabel,
      icon: <YouTubeIcon className="size-5" />,
    },
  ];

  return (
    <footer id="contact" className="scroll-mt-24 bg-slate-950 py-12 text-white sm:py-16">
      <div
        className={cn(
          profileShell,
          "grid gap-10 sm:grid-cols-2 xl:grid-cols-[auto_minmax(0,0.9fr)_minmax(0,0.9fr)_minmax(0,1fr)_minmax(0,1.35fr)] xl:items-start xl:gap-8",
        )}
      >
        <Link href="/" className="inline-flex w-fit shrink-0 self-start">
          <Image
            src="/shaxzod/progress-logo.png"
            alt={baseSiteConfig.name}
            width={180}
            height={180}
            unoptimized
            className="h-auto w-[9.5rem] brightness-0 invert sm:w-[11rem] xl:w-[12.5rem]"
          />
        </Link>

        <nav aria-label={profile.footer.progressNavTitle}>
          <FooterHeading>{profile.footer.progressNavTitle}</FooterHeading>
          <ul className="mt-4 space-y-2.5">
            {content.navigation.map((item) => (
              <li key={item.href}>
                <Link href={`/${item.href}`} className={linkClass}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label={profile.footer.profileNavTitle}>
          <FooterHeading>{profile.footer.profileNavTitle}</FooterHeading>
          <ul className="mt-4 space-y-2.5">
            {profileLinks.map((item) => (
              <li key={item.href}>
                <a href={item.href} className={linkClass}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-8">
          <div>
            <FooterHeading>{profile.footer.phonesTitle}</FooterHeading>
            <div className="mt-4 space-y-2">
              {baseSiteConfig.phones.map((phone) => (
                <a
                  key={phone.href}
                  href={phone.href}
                  className="block text-sm font-semibold text-white transition hover:text-blue-200 sm:text-base"
                >
                  {phone.display}
                </a>
              ))}
            </div>
          </div>

          <div>
            <FooterHeading>{profile.footer.socialTitle}</FooterHeading>
            <div className="mt-4 flex gap-3">
              {socials.map((social) => (
                <a
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  className="flex size-12 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-white/20"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4 sm:col-span-2 xl:col-span-1">
          <div>
            <FooterHeading>{contact.addressLabel}</FooterHeading>
            <p className="mt-3 text-sm font-semibold leading-6 text-white sm:text-base">
              {contact.addressValue}
            </p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              {contact.landmarkLabel}
            </p>
            <p className="mt-1 text-sm leading-6 text-blue-100">{contact.landmarkValue}</p>
          </div>

          <div className="overflow-hidden rounded-[24px] border border-white/10 bg-white/5">
            <div className="flex items-center justify-between gap-3 px-4 pt-4">
              <a
                href={baseSiteConfig.mapHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-100 transition hover:text-white"
              >
                {contact.mapCta}
                <ArrowUpRight className="size-3.5" />
              </a>
            </div>
            <div className="mt-3 aspect-[16/10] w-full">
              <iframe
                src={baseSiteConfig.mapEmbedSrc}
                title={contact.addressValue}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                className="h-full w-full border-0 grayscale-[0.15]"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
