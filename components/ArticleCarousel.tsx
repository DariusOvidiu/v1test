'use client';

import { useTranslation } from "@/hooks/useTranslation";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from "react";

export function ArticleCarousel() {
  const { t } = useTranslation();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
  }, [emblaApi, onSelect]);

  const articles = [
    {
      title: t("home.articles.introduction.title"),
      description: t("home.articles.introduction.description"),
      readTime: 10
    },
    {
      title: t("home.articles.games.title"),
      description: t("home.articles.games.description"),
      readTime: 30
    },
    {
      title: "Understanding Casino Bonuses",
      description: "Learn about different types of casino bonuses and how to make the most of them.",
      readTime: 15
    },
    {
      title: "Sports Betting Strategies",
      description: "Discover effective strategies for sports betting and how to analyze odds.",
      readTime: 25
    }
  ];

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {articles.map((article, index) => (
            <div key={index} className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_50%] lg:flex-[0_0_33.33%] p-4">
              <article className="p-6 rounded-lg bg-white/5 hover:bg-white/10 transition-colors h-full">
                <h3 className="text-xl font-semibold text-cyan-400 mb-2">
                  {article.title}
                </h3>
                <p className="text-white/70 mb-4">
                  {article.description}
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-white/50">{t("home.minRead", { minutes: article.readTime })}</span>
                  <button className="text-pink-500 hover:text-pink-400 flex items-center gap-1">
                    {t("home.readMore")} <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>

      <button
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/80 transition-all disabled:opacity-50"
        onClick={scrollPrev}
        disabled={!prevBtnEnabled}
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/80 transition-all disabled:opacity-50"
        onClick={scrollNext}
        disabled={!nextBtnEnabled}
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
} 