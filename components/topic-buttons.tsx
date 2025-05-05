export default function TopicButtons() {
  const topics = [
    { name: "Introduction to online casinos", href: "/guide/introduction" },
    { name: "Bonuses and promotions", href: "/guide/bonuses" },
    { name: "How we review online casinos", href: "/guide/review-process" },
    { name: "Fair gaming codex", href: "/guide/fair-gaming" },
  ]

  return (
    <div className="flex flex-wrap gap-3 mb-10">
      {topics.map((topic) => (
        <a
          key={topic.name}
          href={topic.href}
          className="px-4 py-2 rounded-md bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white text-sm transition-colors"
        >
          {topic.name}
        </a>
      ))}
    </div>
  )
}
