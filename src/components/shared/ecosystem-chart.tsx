"use client";

import { cn } from "@/lib/utils";

export type EcoItem = {
  name: string;
  description: string;
};

function ecoByName(items: EcoItem[], ...names: string[]) {
  const normalized = names.map((name) => name.toLowerCase());
  return items.find((item) => normalized.includes(item.name.toLowerCase()));
}

function EcoCard({
  item,
  className,
}: {
  item: EcoItem;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "flex min-h-[8.5rem] w-full flex-col items-center justify-center rounded-2xl border border-white/[0.18] bg-[#10182b] px-4 py-4 text-center sm:min-h-[9.75rem] sm:px-5 sm:py-6",
        className,
      )}
    >
      <h3 className="text-[15px] font-semibold leading-snug text-white sm:text-base">
        {item.name}
      </h3>
      <p className="mt-2 max-w-[16rem] text-xs leading-[1.65] text-white/55 sm:mt-2.5 sm:text-[13px] sm:leading-6">
        {item.description}
      </p>
    </article>
  );
}

function EcoStem({ className }: { className?: string }) {
  return (
    <div
      className={cn("mx-auto w-px shrink-0 bg-white/50", className)}
      aria-hidden="true"
    />
  );
}

function EcoBar({ className }: { className?: string }) {
  return (
    <div
      className={cn("h-px bg-white/50", className)}
      aria-hidden="true"
    />
  );
}

function MobileEcosystem({
  root,
  row2,
  proActica,
  profinder,
}: {
  root?: EcoItem;
  row2: (EcoItem | undefined)[];
  proActica?: EcoItem;
  profinder?: EcoItem;
}) {
  const branches = row2.filter(Boolean) as EcoItem[];

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-stretch gap-0 lg:hidden">
      {root ? (
        <div className="mx-auto w-full max-w-md">
          <EcoCard item={root} />
        </div>
      ) : null}
      <EcoStem className="h-8" />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
        {branches.map((item) => (
          <EcoCard key={item.name} item={item} />
        ))}
      </div>
      {(proActica || profinder) && (
        <>
          <EcoStem className="h-8" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
            {proActica ? <EcoCard item={proActica} /> : null}
            {profinder ? <EcoCard item={profinder} /> : null}
          </div>
        </>
      )}
    </div>
  );
}

function DesktopEcosystem({
  root,
  row2,
  proActica,
  profinder,
}: {
  root?: EcoItem;
  row2: (EcoItem | undefined)[];
  proActica?: EcoItem;
  profinder?: EcoItem;
}) {
  return (
    <div className="hidden overflow-x-auto lg:block [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="mx-auto w-full min-w-[58rem] max-w-[68rem] px-1 sm:px-2">
        <div className="flex flex-col items-center">
          {root ? (
            <div className="w-full max-w-[24rem] sm:max-w-[26rem]">
              <EcoCard item={root} />
            </div>
          ) : null}
          <EcoStem className="h-14" />
        </div>

        <div className="relative">
          <EcoBar className="absolute inset-x-[8.333%] top-0" />

          <div className="grid grid-cols-6 gap-x-2.5 sm:gap-x-3">
            {row2.map((item, index) => (
              <div key={`eco-row2-${index}`} className="relative pt-14">
                <EcoStem className="absolute left-1/2 top-0 h-14 -translate-x-1/2" />
                {item ? (
                  <EcoCard item={item} />
                ) : (
                  <div className="min-h-[9.25rem] sm:min-h-[9.75rem]" />
                )}
                <EcoStem className="h-12" />
              </div>
            ))}
          </div>

          <EcoBar className="mx-[8.333%]" />
        </div>

        <div className="relative h-14">
          <EcoStem className="absolute bottom-0 left-[33.333%] h-14 -translate-x-1/2" />
          <EcoStem className="absolute bottom-0 left-[83.333%] h-14 -translate-x-1/2" />
        </div>

        <div className="grid grid-cols-6 gap-x-2.5 sm:gap-x-3">
          <div aria-hidden="true" />
          <div className="col-span-2 min-w-0">
            {proActica ? <EcoCard item={proActica} /> : null}
          </div>
          <div aria-hidden="true" />
          <div className="col-span-2 min-w-0">
            {profinder ? <EcoCard item={profinder} /> : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export function EcosystemChart({ items }: { items: EcoItem[] }) {
  const root = ecoByName(items, "Progress Group");
  const row2 = [
    ecoByName(items, "Progress Marketing"),
    ecoByName(items, "ProCode"),
    ecoByName(items, "Prod-Action"),
    ecoByName(items, "Process sales", "Process Sales"),
    ecoByName(items, "Profile Branding"),
    ecoByName(items, "Profit Finance"),
  ];
  const proActica = ecoByName(items, "Pro-Actica", "Proaktika");
  const profinder = ecoByName(items, "Profinder");

  return (
    <>
      <MobileEcosystem
        root={root}
        row2={row2}
        proActica={proActica}
        profinder={profinder}
      />
      <DesktopEcosystem
        root={root}
        row2={row2}
        proActica={proActica}
        profinder={profinder}
      />
    </>
  );
}
