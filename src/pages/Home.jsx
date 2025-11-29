import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { TrendingUp, Shield, MapPin } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Card from '../components/ui/Card'
import { getProperties } from '../lib/api'

export default function Home() {
    const [user, setUser] = useState(null)
    const [trending, setTrending] = useState([])
    const [safeBets, setSafeBets] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Load user profile
        const userData = localStorage.getItem('veridianUser')
        if (userData) {
            setUser(JSON.parse(userData))
        }

        // Load properties
        loadProperties()
    }, [])

    const loadProperties = async () => {
        try {
            const response = await getProperties({ limit: 100 })
            const props = response.properties || []

            // Trending: high appreciation
            const trendingProps = props
                .filter(p => p.appreciation > 40)
                .sort((a, b) => b.appreciation - a.appreciation)
                .slice(0, 6)
            setTrending(trendingProps)

            // Safe bets: low litigation, approved RERA, good yield
            const safeProps = props
                .filter(p => p.litigation === 0 && p.rera_status === 'Approved')
                .sort((a, b) => b.rental_yield - a.rental_yield)
                .slice(0, 6)
            setSafeBets(safeProps)

            setLoading(false)
        } catch (error) {
            console.error('Failed to load properties:', error)
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen pb-20">
            {/* Hero Section */}
            <div className="bg-gradient-to-b from-bg-card to-bg-deep border-b border-white/5">
                <div className="max-w-7xl mx-auto px-4 py-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-4xl font-bold text-text-head mb-2">
                            Welcome back, {user?.name || 'Investor'} 👋
                        </h1>
                        <p className="text-text-body flex items-center gap-2">
                            <span className="inline-block w-2 h-2 bg-veridian-neon rounded-full animate-pulse" />
                            Market is <span className="text-veridian-neon font-semibold">Bullish</span> today
                        </p>
                    </motion.div>

                    {/* Profile Health Widget */}
                    <Link to="/profile">
                        <Card className="mt-6 cursor-pointer hover:border-veridian-neon/30 transition-all">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-text-head font-semibold mb-1">Profile Health</h3>
                                    <p className="text-sm text-text-body">
                                        {user?.risk === 'Aggressive' ? '🚀 Aggressive' : user?.risk === 'Conservative' ? '🛡️ Conservative' : '⚖️ Moderate'} Investor
                                    </p>
                                </div>
                                <div className="relative w-16 h-16">
                                    <svg className="transform -rotate-90 w-16 h-16">
                                        <circle
                                            cx="32"
                                            cy="32"
                                            r="28"
                                            stroke="currentColor"
                                            strokeWidth="6"
                                            fill="transparent"
                                            className="text-bg-input"
                                        />
                                        <circle
                                            cx="32"
                                            cy="32"
                                            r="28"
                                            stroke="currentColor"
                                            strokeWidth="6"
                                            fill="transparent"
                                            strokeDasharray={`${28 * 2 * Math.PI}`}
                                            strokeDashoffset={`${28 * 2 * Math.PI * 0.2}`}
                                            className="text-veridian-neon"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-text-head font-mono font-bold">80%</span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </Link>
                </div>
            </div>

            {/* Widgets */}
            <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
                {/* Trending */}
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="text-veridian-neon" size={24} />
                        <h2 className="text-2xl font-bold text-text-head">Trending in Pune</h2>
                    </div>
                    {loading ? (
                        <p className="text-text-body">Loading...</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {trending.map(property => (
                                <PropertyCard key={property.id} property={property} badge="trending" />
                            ))}
                        </div>
                    )}
                </section>

                {/* Safe Bets */}
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <Shield className="text-veridian-neon" size={24} />
                        <h2 className="text-2xl font-bold text-text-head">Safe Bets</h2>
                    </div>
                    {loading ? (
                        <p className="text-text-body">Loading...</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {safeBets.map(property => (
                                <PropertyCard key={property.id} property={property} badge="safe" />
                            ))}
                        </div>
                    )}
                </section>
            </div>

            <Navbar />
        </div>
    )
}

function PropertyCard({ property, badge }) {
    return (
        <Link to={`/property/${property.id}`}>
            <motion.div
                whileHover={{ scale: 1.02 }}
                className="glass-panel rounded-lg overflow-hidden hover:border-veridian-neon/30 transition-all cursor-pointer"
            >
                <div className="relative h-48">
                    <img
                        src={property.image_url}
                        alt={property.title}
                        className="w-full h-full object-cover"
                    />
                    {badge === 'trending' && (
                        <div className="absolute top-2 right-2 bg-veridian-neon text-bg-deep px-3 py-1 rounded-full text-xs font-bold">
                            +{property.appreciation}% Growth
                        </div>
                    )}
                    {badge === 'safe' && (
                        <div className="absolute top-2 right-2 bg-veridian-neon text-bg-deep px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                            <Shield size={12} /> Safe
                        </div>
                    )}
                </div>
                <div className="p-4">
                    <h3 className="text-text-head font-semibold mb-2 line-clamp-1">
                        {property.title}
                    </h3>
                    <div className="flex items-center gap-1 text-text-body text-sm mb-2">
                        <MapPin size={14} />
                        {property.locality}
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-text-head font-mono font-bold">
                            ₹{(property.price / 10000000).toFixed(2)}Cr
                        </span>
                        <span className="text-veridian-neon text-sm">
                            {property.rental_yield}% Yield
                        </span>
                    </div>
                </div>
            </motion.div>
        </Link>
    )
}
