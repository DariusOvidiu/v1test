import Image from "next/image"

export default function HeroSection() {
  return (
    <div className="relative overflow-hidden rounded-lg mb-8 bg-gradient-to-r from-black via-gray-900 to-neon-purple/30">
      <div className="flex flex-col md:flex-row p-8">
        <div className="md:w-2/3 z-10">
          <h1 className="text-4xl font-orbitron font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-neon-pink to-neon-cyan">
            Guide to Online Casinos and Online Gambling
          </h1>
          <p className="text-lg mb-6 max-w-2xl">
            Explore our guide section with educational articles on online casinos and online gambling, casino games,
            bonuses, responsible gambling, and more.
          </p>
        </div>
        <div className="md:w-1/3 flex justify-center md:justify-end">
          <div className="relative h-64 w-64">
            <Image
              src="/placeholder.svg?height=256&width=256"
              alt="Casino character"
              width={256}
              height={256}
              className="object-contain"
            />
          </div>
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-neon-pink/10 to-neon-cyan/10 opacity-30"></div>
    </div>
  )
}
