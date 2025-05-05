import { Clock } from "lucide-react"
import Image from "next/image"

export default function TopArticles() {
  const articles = [
    {
      title: "Introduction to online casinos",
      description: "Are you new to online casinos? Get to know the basics before you start playing, so that you make good decisions.",
      readTime: "10 min. read",
      href: "/guide/introduction"
    },
    {
      title: "Games of chance: RTP and variance",
      description: "Learn how games of chance work with their payout ratio (RTP), volatility (variance) and other characteristics.",
      readTime: "30 min. read",
      href: "/guide/games-of-chance"
    },
    {
      title: "How to choose a casino",
      description:
        "Choosing a good and safe online casino impacts your entire online gambling experience. Learn what to watch out for.",
      readTime: "16 min. read",
      icon: "/placeholder.svg?height=100&width=100",
      href: "/guide/how-to-choose-casino",
    },
    {
      title: "How we review online casinos",
      description:
        "We have thoroughly and honestly reviewed thousands of online casinos, following the same methodology for each one.",
      readTime: "41 min. read",
      icon: "/placeholder.svg?height=100&width=100",
      href: "/guide/review-methodology",
    },
  ]

  return (
    <div className="mb-10">
      <div className="flex items-center mb-6">
        <div className="mr-3 text-neon-cyan">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h2 className="text-2xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-pink to-neon-cyan">
          Top articles
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {articles.map((article) => (
          <a
            key={article.title}
            href={article.href}
            className="block bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors"
          >
            <h3 className="text-xl font-semibold text-cyan-400 mb-2">
              {article.title}
            </h3>
            <p className="text-gray-300 mb-4">
              {article.description}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">
                {article.readTime}
              </span>
              <span className="text-pink-500 text-sm">
                Read more →
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
