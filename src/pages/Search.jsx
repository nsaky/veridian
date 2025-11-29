import { useState, useEffect } from 'react'
import { useMapContext } from '../context/MapContext'
import Navbar from '../components/layout/Navbar'
import ChatPanel from '../components/features/ChatPanel'
import MapPanel from '../components/features/MapPanel'
import SearchIntakeOverlay from '../components/features/SearchIntakeOverlay'

export default function Search() {
    const [user, setUser] = useState(null)
    const [isChatActive, setIsChatActive] = useState(false)
    const [initialPrompt, setInitialPrompt] = useState(null)

    useEffect(() => {
        const userData = localStorage.getItem('veridianUser')
        if (userData) {
            setUser(JSON.parse(userData))
        }
    }, [])

    const handleStartAnalysis = (formData, prompt) => {
        setInitialPrompt(prompt)
        setIsChatActive(true)
    }

    return (
        <div className="flex w-full h-[calc(100vh-64px)] overflow-hidden bg-bg-deep">
            {/* Left Panel: The Brain */}
            <div className="w-full md:w-[40%] md:min-w-[400px] flex flex-col border-r border-bg-input relative z-10 h-full">

                {/* Zone A: Header (Fixed) */}
                <div className="flex-none p-4 border-b border-bg-input bg-bg-deep">
                    <h1 className="text-2xl font-bold text-text-head font-mono">
                        VERIDIAN <span className="text-veridian-neon">SEARCH</span>
                    </h1>
                    <p className="text-sm text-text-body mt-1">AI-Powered Property Analysis</p>
                </div>

                {/* Chat Panel */}
                <ChatPanel
                    user={user}
                    initialPrompt={initialPrompt}
                    isChatActive={isChatActive}
                />
            </div>

            {/* Right Panel: The Visual */}
            <div className="hidden md:block md:w-[60%] h-full relative z-0">
                <MapPanel />

                {/* Intake Overlay */}
                {!isChatActive && (
                    <SearchIntakeOverlay onStartAnalysis={handleStartAnalysis} />
                )}
            </div>

            <Navbar />
        </div>
    )
}
