"use client";

import Image from "next/image";
import type { ReactNode } from "react";

import { brandLogos, type BrandLogo } from "@/content/brands";
import { cn } from "@/lib/utils";

type BrandLogoMarqueeProps = {
  label: string;
};

function toneClassName(tone: BrandLogo["tone"]) {
  switch (tone) {
    case "light":
      return "invert dark:invert-0";
    case "colorOnBlack":
      return "mix-blend-multiply dark:mix-blend-screen";
    default:
      return "";
  }
}

function maskStyle(src: string) {
  return {
    WebkitMaskImage: `url(${src})`,
    maskImage: `url(${src})`,
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
    WebkitMaskPosition: "center",
    maskPosition: "center",
    WebkitMaskSize: "contain",
    maskSize: "contain",
  } as const;
}

function BrandMark({ brand }: { brand: BrandLogo }) {
  const scaleStyle =
    brand.scale && brand.scale !== 1
      ? { transform: `scale(${brand.scale})` }
      : undefined;

  let mark: ReactNode;

  if (brand.tintTheme) {
    const shared = {
      ...maskStyle(brand.src),
      ...scaleStyle,
    };

    mark = (
      <>
        <span
          role="img"
          aria-label={brand.name}
          className="h-16 w-full max-w-full sm:h-[4.5rem] dark:hidden"
          style={{ background: brand.tintTheme.light, ...shared }}
        />
        <span
          aria-hidden="true"
          className="hidden h-16 w-full max-w-full sm:h-[4.5rem] dark:block"
          style={{ background: brand.tintTheme.dark, ...shared }}
        />
      </>
    );
  } else if (brand.tint || brand.tintGradient) {
    const background = brand.tintGradient
      ? `linear-gradient(90deg, ${brand.tintGradient.from} 0%, ${brand.tintGradient.to} 100%)`
      : brand.tint;

    mark = (
      <span
        role="img"
        aria-label={brand.name}
        className="h-16 w-full max-w-full sm:h-[4.5rem]"
        style={{
          background,
          ...maskStyle(brand.src),
          ...scaleStyle,
        }}
      />
    );
  } else {
    mark = (
      <Image
        src={brand.src}
        alt={brand.showName ? "" : brand.name}
        width={280}
        height={140}
        unoptimized
        className={cn(
          brand.showName
            ? "h-10 w-auto shrink-0 object-contain sm:h-12"
            : "h-16 w-auto max-w-full object-contain sm:h-[4.5rem]",
          toneClassName(brand.tone),
          brand.whiteInDark && "dark:brightness-0 dark:invert",
        )}
        style={scaleStyle}
      />
    );
  }

  if (!brand.showName) return mark;

  return (
    <div
      role="img"
      aria-label={brand.name}
      className="flex h-16 w-full max-w-full items-center justify-center gap-2.5 sm:h-[4.5rem] sm:gap-3"
    >
      {mark}
      <span className="truncate text-lg font-semibold tracking-tight text-slate-900 sm:text-xl dark:text-white">
        {brand.name}
      </span>
    </div>
  );
}

export function BrandLogoMarquee({ label }: BrandLogoMarqueeProps) {
  const loop = [...brandLogos, ...brandLogos];

  return (
    <div className="mt-14 sm:mt-16">
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-4">
          <span
            aria-hidden="true"
            className="hidden h-px w-12 bg-gradient-to-r from-transparent to-[#0C3272]/45 sm:block dark:to-blue-300/55"
          />
          <h3 className="text-center text-sm font-semibold uppercase tracking-[0.22em] text-[#0C3272] sm:text-base sm:tracking-[0.26em] dark:text-blue-300">
            {label}
          </h3>
          <span
            aria-hidden="true"
            className="hidden h-px w-12 bg-gradient-to-l from-transparent to-[#0C3272]/45 sm:block dark:to-blue-300/55"
          />
        </div>
      </div>

      <div className="brand-marquee mt-7 overflow-hidden sm:mt-8">
        <div className="brand-marquee-track flex w-max items-center gap-10 sm:gap-12">
          {loop.map((brand, index) => (
            <div
              key={`${brand.name}-${index}`}
              className="flex h-20 w-[13rem] shrink-0 items-center justify-center sm:h-24 sm:w-[15rem]"
            >
              <BrandMark brand={brand} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
