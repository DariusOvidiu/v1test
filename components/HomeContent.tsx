'use client';

import { useTranslation } from "@/hooks/useTranslation";
import { Navbar } from "@/components/navbar";
import { ArrowRight } from "lucide-react";
import WelcomeModal from './WelcomeModal';
import { ArticleCarousel } from "./ArticleCarousel";

export function HomeContent() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen bg-black">
      <WelcomeModal />
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-500 to-cyan-500 bg-clip-text text-transparent mb-6">
            {t("home.title")}
          </h1>
          <p className="text-xl text-white/80 mb-8 max-w-3xl">
            {t("home.description")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <button className="px-6 py-3 rounded-lg bg-gradient-to-r from-pink-500 to-cyan-500 text-white font-semibold hover:opacity-90 transition-all flex items-center gap-2">
              {t("home.getStarted")} <ArrowRight className="w-5 h-5" />
            </button>
            <p className="text-white/60 text-sm">
              {t("home.trustedBy")} <span className="text-cyan-400">10,000+</span> {t("home.users")}
            </p>
          </div>
        </div>

        {/* Topic Buttons */}
        <div className="flex flex-wrap gap-4 mb-12">
          <button className="px-4 py-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all">
            {t("home.topics.introduction")}
          </button>
          <button className="px-4 py-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all">
            {t("home.topics.bonuses")}
          </button>
          <button className="px-4 py-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all">
            {t("home.topics.reviews")}
          </button>
          <button className="px-4 py-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all">
            {t("home.topics.fairGaming")}
          </button>
        </div>

        {/* Articles Section */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="text-cyan-400">⭐</span> {t("home.topArticles")}
          </h2>
          
          <ArticleCarousel />
        </section>
      </div>
    </main>
  );
} 