import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-3xl space-y-4",
        align === "center" && "mx-auto text-center",
      )}
    >
      {eyebrow ? (
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#0C3272] sm:text-sm sm:tracking-[0.3em] dark:text-blue-300">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="whitespace-pre-line text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl md:text-4xl dark:text-white">
        {title}
      </h2>
      {description ? (
        <p className="whitespace-pre-line text-base leading-7 text-slate-600 sm:text-lg sm:leading-8 dark:text-slate-300">
          {description}
        </p>
      ) : null}
    </div>
  );
}
