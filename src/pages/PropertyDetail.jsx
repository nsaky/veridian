import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, MapPin, Home, TrendingUp, Shield, AlertTriangle, DollarSign, Calendar } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { getProperties, calculateScore } from '../lib/api'
import Navbar from '../components/layout/Navbar'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

export default function PropertyDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [property, setProperty] = useState(null)
    const [score, setScore] = useState(null)
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null)

    useEffect(() => {
        const userData = localStorage.getItem('veridianUser')
        if (userData) {
            setUser(JSON.parse(userData))
        }
        loadProperty()
    }, [id])

    const loadProperty = async () => {
        try {
            const response = await getProperties({ limit: 500 })
            const prop = response.properties.find(p => p.id === id)

            if (!prop) {
                navigate('/search')
                return
            }

            setProperty(prop)

            // Calculate score
            const userData = localStorage.getItem('veridianUser')
            const userProfile = userData ? JSON.parse(userData) : { risk: 'Moderate' }
            const scoreData = await calculateScore(prop.id, userProfile)
            setScore(scoreData)

            setLoading(false)
        } catch (error) {
            console.error('Failed to load property:', error)
            setLoading(false)
        }
    }

    if (loading || !property) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-text-body">Loading property details...</p>
            </div>
        )
    }

    // Generate growth projection data
    const generateGrowthData = () => {
        const currentYear = new Date().getFullYear()
        const data = []
        const appreciationRate = property.appreciation / 100

        for (let i = 0; i <= 5; i++) {
            const year = currentYear + i
            const baseValue = property.price * Math.pow(1 + appreciationRate / 10, i)
            const jitter = (Math.random() - 0.5) * 0.03 * baseValue
            data.push({
                year: year.toString(),
                value: Math.round((baseValue + jitter) / 100000) / 10 // in lakhs
            })
        }
        return data
    }

    const growthData = generateGrowthData()

    // Calculate financials
    const monthlyRent = (property.price * property.rental_yield / 100) / 12
    const emi = calculateEMI(property.price * 0.8, 20, 8.5) // 20% down, 20 years, 8.5% interest
    const maintenance = property.maintenance
    const cashFlow = monthlyRent - emi - maintenance

    return (
        <div className="min-h-screen pb-20">
            {/* Hero Section with Verdict Stamp */}
            <div className="relative h-[60vh] overflow-hidden">
                <img
                    src={property.image_url}
                    alt={property.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg-deep via-bg-deep/50 to-transparent" />

                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-4 left-4 glass-panel p-3 rounded-full hover:border-veridian-neon/50 transition-colors"
                >
                    <ArrowLeft className="text-text-head" size={24} />
                </button>

                {/* Verdict Stamp */}
                <motion.div
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: -5 }}
                    transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                    className={`absolute top-4 right-4 px-6 py-3 rounded-lg font-bold text-2xl border-4 ${score && score.score >= 7
                            ? 'bg-veridian-neon/20 border-veridian-neon text-veridian-neon'
                            : 'bg-signal-danger/20 border-signal-danger text-signal-danger'
                        }`}
                >
                    {score ? score.verdict : 'ANALYZING'}
                </motion.div>

                {/* Property Title */}
                <div className="absolute bottom-0 left-0 right-0 p-8">
                    <h1 className="text-4xl font-bold text-text-head mb-2">{property.title}</h1>
                    <div className="flex items-center gap-4 text-text-body">
                        <div className="flex items-center gap-1">
                            <MapPin size={18} />
                            {property.locality}
                        </div>
                        <div className="flex items-center gap-1">
                            <Home size={18} />
                            {property.bedrooms}BHK • {property.carpet_area} sq.ft
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
                {/* Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-text-body text-sm mb-1">Price</p>
                                <p className="text-2xl font-mono font-bold text-text-head">
                                    ₹{(property.price / 10000000).toFixed(2)}Cr
                                </p>
                            </div>
                            <DollarSign className="text-veridian-neon" size={32} />
                        </div>
                    </Card>

                    <Card>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-text-body text-sm mb-1">Rental Yield</p>
                                <p className="text-2xl font-mono font-bold text-veridian-neon">
                                    {property.rental_yield}%
                                </p>
                            </div>
                            <TrendingUp className="text-veridian-neon" size={32} />
                        </div>
                    </Card>

                    <Card>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-text-body text-sm mb-1">5Y Appreciation</p>
                                <p className="text-2xl font-mono font-bold text-veridian-neon">
                                    +{property.appreciation}%
                                </p>
                            </div>
                            <TrendingUp className="text-veridian-neon" size={32} />
                        </div>
                    </Card>
                </div>

                {/* Veridian Score Breakdown */}
                {score && (
                    <Card neonBorder={score.score >= 7}>
                        <h2 className="text-2xl font-bold text-text-head mb-4 flex items-center gap-2">
                            <span className="text-veridian-neon font-mono text-4xl">{score.score}</span>
                            <span>/ 10</span>
                        </h2>
                        <div className="space-y-3">
                            <ScoreBar label="Rental Yield" score={score.breakdown.yield} />
                            <ScoreBar label="Growth Potential" score={score.breakdown.growth} />
                            <ScoreBar label="Legal Clarity" score={score.breakdown.legal} />
                        </div>
                        {score.warnings && score.warnings.length > 0 && (
                            <div className="mt-4 space-y-2">
                                {score.warnings.map((warning, i) => (
                                    <p key={i} className="text-sm text-text-body bg-bg-input p-3 rounded-lg">
                                        {warning}
                                    </p>
                                ))}
                            </div>
                        )}
                    </Card>
                )}

                {/* Growth Projection Chart */}
                <Card>
                    <h2 className="text-2xl font-bold text-text-head mb-4">5-Year Growth Projection</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={growthData}>
                            <defs>
                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#00FF85" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#00FF85" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#132E1D" />
                            <XAxis dataKey="year" stroke="#A5D6A7" />
                            <YAxis stroke="#A5D6A7" label={{ value: '₹ Lakhs', angle: -90, position: 'insideLeft', fill: '#A5D6A7' }} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#0A1F12', border: '1px solid #132E1D', borderRadius: '8px' }}
                                labelStyle={{ color: '#E8F5E9' }}
                                itemStyle={{ color: '#00FF85' }}
                            />
                            <Area type="monotone" dataKey="value" stroke="#00FF85" strokeWidth={2} fill="url(#colorValue)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </Card>

                {/* Legal Traffic Light */}
                <div>
                    <h2 className="text-2xl font-bold text-text-head mb-4">Legal Assessment</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <LegalCard
                            title="RERA Status"
                            status={property.rera_status}
                            icon={<Shield size={24} />}
                            isGood={property.rera_status === 'Approved'}
                        />
                        <LegalCard
                            title="Title Clarity"
                            status={property.litigation === 0 ? 'Clear' : `${property.litigation} Case(s)`}
                            icon={<AlertTriangle size={24} />}
                            isGood={property.litigation === 0}
                        />
                        <LegalCard
                            title="Developer"
                            status={property.developer}
                            icon={<Home size={24} />}
                            isGood={!property.developer.includes('Unknown')}
                        />
                    </div>
                </div>

                {/* Financial Strategy */}
                <Card>
                    <h2 className="text-2xl font-bold text-text-head mb-4">Cash Flow Analysis</h2>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-text-body mb-1">Monthly Rent (Est.)</p>
                                <p className="text-text-head font-mono font-semibold">₹{monthlyRent.toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-text-body mb-1">EMI (80% loan, 20Y)</p>
                                <p className="text-text-head font-mono font-semibold">-₹{emi.toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-text-body mb-1">Maintenance</p>
                                <p className="text-text-head font-mono font-semibold">-₹{maintenance.toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-text-body mb-1">Net Cash Flow</p>
                                <p className={`font-mono font-bold text-lg ${cashFlow > 0 ? 'text-veridian-neon' : 'text-signal-danger'}`}>
                                    {cashFlow > 0 ? '+' : ''}₹{cashFlow.toLocaleString()}
                                </p>
                            </div>
                        </div>

                        {cashFlow < 0 && (
                            <div className="bg-signal-danger/10 border border-signal-danger/30 p-4 rounded-lg">
                                <p className="text-signal-danger font-semibold mb-1">⚠️ Negative Cash Flow</p>
                                <p className="text-text-body text-sm">
                                    This is a growth asset. You'll need to subsidize ₹{Math.abs(cashFlow).toLocaleString()}/month until appreciation covers the gap.
                                </p>
                            </div>
                        )}

                        <div className="bg-veridian-neon/10 border border-veridian-neon/30 p-4 rounded-lg">
                            <p className="text-veridian-neon font-semibold mb-1">💡 Tax Optimization</p>
                            <p className="text-text-body text-sm">
                                Section 24(b): Claim up to ₹2,00,000/year deduction on home loan interest for self-occupied property.
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Possession */}
                <Card>
                    <div className="flex items-center gap-3">
                        <Calendar className="text-veridian-neon" size={24} />
                        <div>
                            <p className="text-text-body text-sm">Possession Date</p>
                            <p className="text-text-head font-semibold">{new Date(property.possession_date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                    </div>
                </Card>
            </div>

            <Navbar />
        </div>
    )
}

function ScoreBar({ label, score }) {
    return (
        <div>
            <div className="flex justify-between mb-1 text-sm">
                <span className="text-text-body">{label}</span>
                <span className="text-veridian-neon font-mono">{score}/10</span>
            </div>
            <div className="h-2 bg-bg-input rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${score * 10}%` }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="h-full bg-veridian-neon rounded-full"
                />
            </div>
        </div>
    )
}

function LegalCard({ title, status, icon, isGood }) {
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className={`glass-panel p-4 rounded-lg ${!isGood ? 'border-signal-danger animate-pulse-slow' : 'border-transparent'
                }`}
        >
            <div className="flex items-center gap-2 mb-2">
                <div className={isGood ? 'text-veridian-neon' : 'text-signal-danger'}>
                    {icon}
                </div>
                <h3 className="text-text-head font-semibold">{title}</h3>
            </div>
            <p className={`text-sm font-mono ${isGood ? 'text-text-body' : 'text-signal-danger font-bold'}`}>
                {status}
            </p>
        </motion.div>
    )
}

function calculateEMI(principal, years, rate) {
    const monthlyRate = rate / 12 / 100
    const months = years * 12
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1)
    return Math.round(emi)
}
