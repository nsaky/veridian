import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, MapPin, DollarSign, Home, TrendingUp } from 'lucide-react'
import Button from '../ui/Button'

const LOCALITIES = [
    "Baner", "Hinjewadi", "Wagholi", "Kothrud",
    "Viman Nagar", "Koregaon Park", "Magarpatta", "Aundh"
]

const PROPERTY_TYPES = [
    { value: "Apartment", icon: Home, label: "Apartment" },
    { value: "Villa", icon: Home, label: "Villa" },
    { value: "Plot", icon: MapPin, label: "Plot" },
    { value: "Commercial", icon: TrendingUp, label: "Commercial" }
]

const GOALS = [
    { value: "rental", label: "Rental Income", icon: DollarSign },
    { value: "growth", label: "Capital Growth", icon: TrendingUp }
]

export default function SearchIntakeOverlay({ onStartAnalysis }) {
    const [formData, setFormData] = useState({
        locality: "",
        budget: 100,  // in lakhs
        propertyType: "",
        goal: ""
    })

    const handleStartAnalysis = () => {
        if (!formData.locality || !formData.propertyType) {
            alert("Please select location and property type")
            return
        }

        // Format prompt for backend
        const budgetCr = (formData.budget / 100).toFixed(2)
        const prompt = `I'm looking for ${formData.propertyType} in ${formData.locality} under ${budgetCr} crore${formData.goal ? ` for ${formData.goal === 'rental' ? 'rental income' : 'capital appreciation'}` : ''}.`

        onStartAnalysis(formData, prompt)
    }

    return (
        <div className="absolute inset-0 z-50 bg-bg-deep/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-panel p-8 rounded-2xl max-w-2xl w-full"
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-3 mb-3">
                        <Sparkles className="text-veridian-neon" size={32} />
                        <h2 className="text-3xl font-bold text-text-head font-mono">
                            Start Your Search
                        </h2>
                    </div>
                    <p className="text-text-body">
                        Let Veridian analyze the best investment opportunities for you
                    </p>
                </div>

                <div className="space-y-6">
                    {/* Location */}
                    <div>
                        <label className="block text-text-head font-semibold mb-2 flex items-center gap-2">
                            <MapPin size={18} className="text-veridian-neon" />
                            Location
                        </label>
                        <select
                            value={formData.locality}
                            onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                            className="w-full bg-bg-input text-text-body px-4 py-3 rounded-lg border border-white/10 focus:border-veridian-neon focus:outline-none transition-colors"
                        >
                            <option value="">Select locality...</option>
                            {LOCALITIES.map(loc => (
                                <option key={loc} value={loc}>{loc}</option>
                            ))}
                        </select>
                    </div>

                    {/* Budget Slider */}
                    <div>
                        <label className="block text-text-head font-semibold mb-2">
                            Budget: ₹{(formData.budget / 100).toFixed(2)} Cr
                        </label>
                        <input
                            type="range"
                            min="20"
                            max="500"
                            step="10"
                            value={formData.budget}
                            onChange={(e) => setFormData({ ...formData, budget: parseInt(e.target.value) })}
                            className="w-full h-2 bg-bg-input rounded-lg appearance-none cursor-pointer accent-veridian-neon"
                        />
                        <div className="flex justify-between text-xs text-text-body mt-1">
                            <span>₹20L</span>
                            <span>₹5Cr</span>
                        </div>
                    </div>

                    {/* Property Type */}
                    <div>
                        <label className="block text-text-head font-semibold mb-3">
                            Property Type
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {PROPERTY_TYPES.map(type => {
                                const Icon = type.icon
                                return (
                                    <button
                                        key={type.value}
                                        onClick={() => setFormData({ ...formData, propertyType: type.value })}
                                        className={`p-4 rounded-lg border-2 transition-all ${formData.propertyType === type.value
                                                ? 'border-veridian-neon bg-veridian-neon/10'
                                                : 'border-white/10 hover:border-white/30'
                                            }`}
                                    >
                                        <Icon className={formData.propertyType === type.value ? 'text-veridian-neon mx-auto mb-2' : 'text-text-body mx-auto mb-2'} size={24} />
                                        <span className="text-sm text-text-head">{type.label}</span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Investment Goal */}
                    <div>
                        <label className="block text-text-head font-semibold mb-3">
                            Investment Goal (Optional)
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {GOALS.map(goal => {
                                const Icon = goal.icon
                                return (
                                    <button
                                        key={goal.value}
                                        onClick={() => setFormData({ ...formData, goal: formData.goal === goal.value ? "" : goal.value })}
                                        className={`p-4 rounded-lg border-2 transition-all ${formData.goal === goal.value
                                                ? 'border-veridian-neon bg-veridian-neon/10'
                                                : 'border-white/10 hover:border-white/30'
                                            }`}
                                    >
                                        <Icon className={formData.goal === goal.value ? 'text-veridian-neon mx-auto mb-2' : 'text-text-body mx-auto mb-2'} size={20} />
                                        <span className="text-xs text-text-head">{goal.label}</span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                        onClick={handleStartAnalysis}
                        className="w-full py-4 text-lg font-bold"
                        disabled={!formData.locality || !formData.propertyType}
                    >
                        <Sparkles size={20} className="mr-2" />
                        Start Analysis
                    </Button>
                </div>
            </motion.div>
        </div>
    )
}
