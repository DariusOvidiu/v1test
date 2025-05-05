import Header from "@/components/header"
import Navigation from "@/components/navigation"

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <Header />
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card pentru Statistici */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Statistici Generale</h2>
            <div className="space-y-4">
              <div>
                <p className="text-gray-400">Total Sesiuni</p>
                <p className="text-2xl font-bold text-white">0</p>
              </div>
              <div>
                <p className="text-gray-400">Profit/Pierdere Totală</p>
                <p className="text-2xl font-bold text-green-500">0 RON</p>
              </div>
            </div>
          </div>

          {/* Card pentru Sesiunea Curentă */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Sesiune Curentă</h2>
            <div className="space-y-4">
              <div>
                <p className="text-gray-400">Durată</p>
                <p className="text-2xl font-bold text-white">00:00:00</p>
              </div>
              <div>
                <p className="text-gray-400">Profit/Pierdere</p>
                <p className="text-2xl font-bold text-red-500">0 RON</p>
              </div>
            </div>
          </div>

          {/* Card pentru Limite */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Limite Setate</h2>
            <div className="space-y-4">
              <div>
                <p className="text-gray-400">Limită Zilnică</p>
                <p className="text-2xl font-bold text-white">500 RON</p>
              </div>
              <div>
                <p className="text-gray-400">Timp Rămas</p>
                <p className="text-2xl font-bold text-white">04:00:00</p>
              </div>
            </div>
          </div>
        </div>

        {/* Secțiune pentru Grafic */}
        <div className="mt-8 bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Evoluție Profit/Pierdere</h2>
          <div className="h-64 bg-gray-700 rounded-lg">
            {/* Aici va fi implementat graficul */}
          </div>
        </div>
      </div>
    </main>
  )
} 