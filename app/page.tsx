import { Navbar } from "@/components/navbar"
import TopicButtons from "@/components/topic-buttons"
import TopArticles from "@/components/top-articles"

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl">
          <h1 className="text-4xl font-bold text-white mb-4">
            Guide to Online Casinos and Online Gambling
          </h1>
          <p className="text-gray-400 text-lg mb-8">
            Explore our guide section with educational articles on online casinos and online gambling, casino games, bonuses, responsible gambling, and more.
          </p>
        </div>

        <TopicButtons />
        <TopArticles />
      </div>
    </main>
  )
}
