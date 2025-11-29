import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'

export default function Onboarding() {
    const navigate = useNavigate()
    const [stage, setStage] = useState(1)
    const [name, setName] = useState('')
    const [risk, setRisk] = useState(5)

    const handleStart = () => {
        if (!name) return
        setStage(2)
    }

    const handleComplete = () => {
        // Save to localStorage
        const userProfile = {
            name,
            risk: risk >= 7 ? 'Aggressive' : risk >= 4 ? 'Moderate' : 'Conservative',
            riskScore: risk,
            onboarded: true
        }
        localStorage.setItem('veridianUser', JSON.stringify(userProfile))
        navigate('/home')
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            {/* Animated background grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#132E1D_1px,transparent_1px),linear-gradient(to_bottom,#132E1D_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative max-w-2xl w-full"
            >
                <Card className="text-center" neonBorder>
                    {stage === 1 ? (
                        <>
                            <motion.div
                                initial={{ y: -20 }}
                                animate={{ y: 0 }}
                                className="mb-8"
                            >
                                <h1 className="text-5xl font-bold text-text-head mb-4 font-mono text-glow">
                                    VERIDIAN
                                </h1>
                                <p className="text-xl text-text-body">
                                    The Bloomberg Terminal for Real Estate
                                </p>
                            </motion.div>

                            <div className="space-y-6">
                                <Input
                                    label="What's your name?"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter your name"
                                    className="max-w-md mx-auto"
                                />

                                <Button onClick={handleStart} disabled={!name} className="w-full max-w-md mx-auto">
                                    Get Started
                                </Button>
                            </div>

                            <p className="mt-8 text-sm text-text-body/60">
                                AI-Powered Investment Analysis • Real-Time Market Data • Legal Risk Assessment
                            </p>
                        </>
                    ) : (
                        <>
                            <h2 className="text-3xl font-bold text-text-head mb-2">
                                Risk Assessment
                            </h2>
                            <p className="text-text-body mb-8">
                                How would you describe your investment philosophy?
                            </p>

                            <div className="space-y-6">
                                <div>
                                    <div className="flex justify-between mb-2 text-sm">
                                        <span className="text-text-body">Conservative</span>
                                        <span className="text-veridian-neon font-mono text-lg">{risk}/10</span>
                                        <span className="text-text-body">Aggressive</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="1"
                                        max="10"
                                        value={risk}
                                        onChange={(e) => setRisk(parseInt(e.target.value))}
                                        className="w-full h-2 bg-bg-input rounded-lg appearance-none cursor-pointer accent-veridian-neon"
                                    />
                                </div>

                                <div className="glass-panel-solid p-4 rounded-lg text-left">
                                    <h3 className="text-text-head font-semibold mb-2">
                                        {risk >= 7 ? '🚀 Aggressive Investor' : risk >= 4 ? '⚖️ Balanced Investor' : '🛡️ Conservative Investor'}
                                    </h3>
                                    <p className="text-sm text-text-body">
                                        {risk >= 7
                                            ? 'Focused on high-growth metro properties, willing to accept higher risk for appreciation potential.'
                                            : risk >= 4
                                                ? 'Balanced approach seeking steady returns with moderate risk exposure.'
                                                : 'Prioritizing safety and legal clarity, avoiding properties with litigation or unclear titles.'}
                                    </p>
                                </div>

                                <Button onClick={handleComplete} className="w-full">
                                    Enter Veridian
                                </Button>
                            </div>
                        </>
                    )}
                </Card>
            </motion.div>
        </div>
    )
}
