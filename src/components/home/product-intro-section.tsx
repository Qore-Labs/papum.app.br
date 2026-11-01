import Image from "next/image";
import Link from "next/link";

import {
  HOME_PRODUCT_INTRO,
  type HomeProductIllustration,
} from "@/utils/contents/home";

function ProductIllustration({ item }: { item: HomeProductIllustration }) {
  return (
    <figure className="flex items-center justify-between gap-4 py-7 sm:gap-6 lg:gap-4 lg:py-9">
      <figcaption className="font-jakarta max-w-40 text-base leading-snug font-bold text-[#ffc400] sm:text-xl">
        {item.title}
      </figcaption>
      <Image
        src={item.src}
        alt=""
        width={item.width}
        height={item.height}
        sizes="(min-width: 1280px) 192px, (min-width: 1024px) 160px, (min-width: 640px) 176px, 144px"
        className="h-auto w-36 max-w-1/2 shrink-0 sm:w-44 sm:max-w-none lg:w-40 xl:w-48"
      />
    </figure>
  );
}

export function ProductIntroSection() {
  return (
    <section
      id="proposta"
      aria-labelledby="product-intro-title"
      className="site-safe-gutter bg-[#ebebe7] py-10 sm:py-14"
    >
      <div className="mx-auto grid max-w-308 grid-cols-1 overflow-hidden rounded-4xl lg:grid-cols-[3fr_2fr]">
        <div className="relative isolate overflow-hidden bg-linear-150 from-[#ffc400] via-[#ffbc00] to-[#ff9500] px-7 py-10 sm:p-12 lg:p-14">
          <Image
            src="/home/product/lightning.svg"
            alt=""
            aria-hidden="true"
            width={720}
            height={720}
            sizes="(min-width: 640px) 448px, 320px"
            className="pointer-events-none absolute -right-32 -bottom-20 -z-10 h-auto w-80 -rotate-11 opacity-20 sm:-right-44 sm:-bottom-28 sm:w-112"
          />
          <h2
            id="product-intro-title"
            className="font-jakarta text-home-ink max-w-156 text-[clamp(2.25rem,4vw,3.5rem)] leading-[1.1] font-bold tracking-[-0.035em]"
          >
            {HOME_PRODUCT_INTRO.headline.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
          <p className="text-home-ink mt-6 max-w-116 text-lg leading-8">
            {HOME_PRODUCT_INTRO.description}
          </p>
          <p className="text-home-ink mt-9 max-w-88 text-sm leading-6 sm:text-base">
            {HOME_PRODUCT_INTRO.invitation}
          </p>
          <Link
            href="/lancamento"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${HOME_PRODUCT_INTRO.ctaLabel} (abre em nova aba)`}
            data-analytics-cta="plans"
            data-analytics-location="benefits"
            className="mt-4 inline-flex min-h-12 items-center justify-center rounded-full bg-[#191817] px-7 py-3.5 text-base font-semibold text-[#fffaf2] transition-colors hover:bg-[#39352e] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#191817] active:bg-black motion-reduce:transition-none"
          >
            {HOME_PRODUCT_INTRO.ctaLabel}
          </Link>
        </div>
        <div className="flex flex-col justify-center divide-y divide-white/20 bg-[#191817] px-7 py-2 sm:px-12 sm:py-4 lg:px-8">
          {HOME_PRODUCT_INTRO.illustrations.map((item) => (
            <ProductIllustration key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
