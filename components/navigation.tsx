import {
  Home,
  Monitor,
  Gamepad2,
  Gift,
  BookOpen,
  AlertTriangle,
  MessageSquare,
  Star,
  Trophy,
  Newspaper,
} from "lucide-react"

export default function Navigation() {
  const navItems = [
    { name: "Home", icon: <Home className="h-5 w-5" />, href: "/" },
    { name: "Online Casinos", icon: <Monitor className="h-5 w-5" />, href: "/online-casinos" },
    { name: "Games", icon: <Gamepad2 className="h-5 w-5" />, href: "/games" },
    { name: "Bonuses", icon: <Gift className="h-5 w-5" />, href: "/bonuses" },
    { name: "Guide", icon: <BookOpen className="h-5 w-5" />, href: "/guide" },
    { name: "Complaints", icon: <AlertTriangle className="h-5 w-5" />, href: "/complaints" },
    { name: "Forum", icon: <MessageSquare className="h-5 w-5" />, href: "/forum", highlight: true },
    { name: "Reviews", icon: <Star className="h-5 w-5" />, href: "/reviews" },
    { name: "Tournaments", icon: <Trophy className="h-5 w-5" />, href: "/tournaments" },
    { name: "News", icon: <Newspaper className="h-5 w-5" />, href: "/news" },
  ]

  return (
    <div className="bg-gray-900 border-b border-neon-purple/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center overflow-x-auto py-2 space-x-6">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={`flex items-center whitespace-nowrap ${
                item.highlight ? "text-neon-pink" : "text-white hover:text-neon-cyan"
              } transition-colors`}
            >
              <span className="mr-1">{item.icon}</span>
              <span className="font-orbitron">{item.name}</span>
              {item.name === "Forum" && <span className="ml-1 text-xs bg-neon-pink text-black px-1 rounded">NEW</span>}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
