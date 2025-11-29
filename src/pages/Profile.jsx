import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, TrendingUp, Shield, AlertTriangle, Edit2, CheckCircle, Mail } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

export default function Profile() {
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [editing, setEditing] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        risk: 'Moderate'
    })

    useEffect(() => {
        // Load user from localStorage
        const userData = localStorage.getItem('veridianUser')
        if (userData) {
            const parsed = JSON.parse(userData)
            setUser(parsed)
            setFormData({
                name: parsed.name || '',
                email: parsed.email || '',
                risk: parsed.risk || 'Moderate'
            })
        } else {
            // If no user, redirect to onboarding
            navigate('/onboarding')
        }
    }, [navigate])

    const handleSave = () => {
        const updatedUser = {
            ...user,
            ...formData
        }
        localStorage.setItem('veridianUser', JSON.stringify(updatedUser))
        setUser(updatedUser)
        setEditing(false)
    }

    const calculateProfileCompletion = () => {
        let score = 0
        if (user?.name) score += 30
        if (user?.email) score += 20
        if (user?.risk) score += 30
        if (user?.preferences) score += 20
        return score
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-text-body">Loading...</p>
            </div>
        )
    }

    const completion = calculateProfileCompletion()

    return (
        <div className="min-h-screen pb-20 bg-bg-deep">
            {/* Header */}
            <div className="bg-gradient-to-b from-bg-card to-bg-deep border-b border-white/5">
                <div className="max-w-4xl mx-auto px-4 py-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-20 h-20 rounded-full bg-veridian-neon/10 border-2 border-veridian-neon flex items-center justify-center">
                                <User className="text-veridian-neon" size={40} />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-text-head">
                                    {user.name || 'Investor'}
                                </h1>
                                <p className="text-text-body">{user.email || 'No email set'}</p>
                            </div>
                        </div>

                        {/* Profile Completion */}
                        <Card>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-text-head font-semibold mb-1">Profile Completion</h3>
                                    <p className="text-sm text-text-body">
                                        {completion === 100 ? '✅ Complete!' : `${100 - completion}% remaining`}
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
                                            strokeDashoffset={`${28 * 2 * Math.PI * (1 - completion / 100)}`}
                                            className="text-veridian-neon transition-all duration-500"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-text-head font-mono font-bold">{completion}%</span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                </div>
            </div>

            {/* Profile Details */}
            <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
                {/* Personal Information */}
                <Card>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-text-head">Personal Information</h2>
                        <Button
                            onClick={() => editing ? handleSave() : setEditing(true)}
                            variant="outline"
                            className="text-sm"
                        >
                            {editing ? (
                                <>
                                    <CheckCircle size={16} className="mr-1" />
                                    Save
                                </>
                            ) : (
                                <>
                                    <Edit2 size={16} className="mr-1" />
                                    Edit
                                </>
                            )}
                        </Button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="text-text-body text-sm mb-1 block">Full Name</label>
                            {editing ? (
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-bg-input text-text-head px-4 py-2 rounded-lg border border-white/10 focus:border-veridian-neon focus:outline-none"
                                />
                            ) : (
                                <p className="text-text-head font-medium">{user.name || 'Not set'}</p>
                            )}
                        </div>

                        <div>
                            <label className="text-text-body text-sm mb-1 block">Email Address</label>
                            {editing ? (
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-bg-input text-text-head px-4 py-2 rounded-lg border border-white/10 focus:border-veridian-neon focus:outline-none"
                                    placeholder="your.email@example.com"
                                />
                            ) : (
                                <p className="text-text-head font-medium">{user.email || 'Not set'}</p>
                            )}
                        </div>
                    </div>
                </Card>

                {/* Investment Profile */}
                <Card>
                    <h2 className="text-xl font-bold text-text-head mb-4">Investment Profile</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="text-text-body text-sm mb-2 block">Risk Appetite</label>
                            {editing ? (
                                <div className="grid grid-cols-3 gap-2">
                                    {['Conservative', 'Moderate', 'Aggressive'].map((risk) => (
                                        <button
                                            key={risk}
                                            onClick={() => setFormData({ ...formData, risk })}
                                            className={`px-4 py-3 rounded-lg border-2 transition-all ${formData.risk === risk
                                                    ? 'border-veridian-neon bg-veridian-neon/10 text-veridian-neon'
                                                    : 'border-white/10 text-text-body hover:border-white/20'
                                                }`}
                                        >
                                            <div className="flex flex-col items-center gap-1">
                                                {risk === 'Conservative' && <Shield size={20} />}
                                                {risk === 'Moderate' && <TrendingUp size={20} />}
                                                {risk === 'Aggressive' && <AlertTriangle size={20} />}
                                                <span className="text-sm font-medium">{risk}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    {user.risk === 'Conservative' && (
                                        <>
                                            <Shield className="text-veridian-neon" size={20} />
                                            <span className="text-text-head font-medium">🛡️ Conservative</span>
                                        </>
                                    )}
                                    {user.risk === 'Moderate' && (
                                        <>
                                            <TrendingUp className="text-veridian-neon" size={20} />
                                            <span className="text-text-head font-medium">⚖️ Moderate</span>
                                        </>
                                    )}
                                    {user.risk === 'Aggressive' && (
                                        <>
                                            <AlertTriangle className="text-veridian-neon" size={20} />
                                            <span className="text-text-head font-medium">🚀 Aggressive</span>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="bg-bg-input/50 rounded-lg p-4 border border-white/5">
                            <p className="text-text-body text-sm">
                                {user.risk === 'Conservative' && 'You prefer stable, low-risk investments with predictable returns. Veridian will prioritize properties with minimal legal issues and strong fundamentals.'}
                                {user.risk === 'Moderate' && 'You seek a balanced approach between risk and reward. Veridian will recommend properties with good growth potential and acceptable risk levels.'}
                                {user.risk === 'Aggressive' && 'You\'re willing to take higher risks for potentially greater returns. Veridian will show you high-growth opportunities, even if they carry more uncertainty.'}
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Quick Actions */}
                <Card>
                    <h2 className="text-xl font-bold text-text-head mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-2 gap-3">
                        <Link to="/search">
                            <Button variant="outline" className="w-full">
                                🔍 Search Properties
                            </Button>
                        </Link>
                        <Link to="/">
                            <Button variant="outline" className="w-full">
                                🏠 Dashboard
                            </Button>
                        </Link>
                    </div>
                </Card>
            </div>

            <Navbar />
        </div>
    )
}
