import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Loader2, Sparkles, X } from 'lucide-react'
import { useMapContext } from '../../context/MapContext'
import { sendChatMessage } from '../../lib/api'
import Button from '../ui/Button'

export default function ChatPanel({ user, initialPrompt, isChatActive }) {
    const [messages, setMessages] = useState([
        {
            role: 'agent',
            text: 'Hello! I\'m Veridian, your real estate financial auditor. To get started, fill out the search form or ask me anything about properties.'
        }
    ])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const messagesEndRef = useRef(null)
    const { updateFilters, clearFilters, explorePropertyId, setExplorePropertyId } = useMapContext()
    const hasProcessedInitialPrompt = useRef(false)

    // Auto-scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    // Handle initial prompt from intake form
    useEffect(() => {
        if (initialPrompt && isChatActive && !hasProcessedInitialPrompt.current) {
            hasProcessedInitialPrompt.current = true
            handleSend(initialPrompt)
        }
    }, [initialPrompt, isChatActive])

    // Handle explore property trigger from map
    useEffect(() => {
        if (explorePropertyId) {
            const exploreMessage = `Analyze the risk factors and investment potential for property ${explorePropertyId}. Provide detailed insights on legal status, financial metrics, and suitability for my risk profile.`
            handleSend(exploreMessage)
            setExplorePropertyId(null) // Reset after handling
        }
    }, [explorePropertyId])

    const handleSend = async (messageText = null) => {
        const userMessage = messageText || input.trim()
        if (!userMessage || loading) return

        if (!messageText) setInput('')

        // Add user message
        setMessages(prev => [...prev, { role: 'user', text: userMessage }])
        setLoading(true)

        try {
            // Send to API
            const response = await sendChatMessage(
                userMessage,
                user || { risk: 'Moderate' },
                messages
            )

            // Add agent response
            setMessages(prev => [...prev, {
                role: 'agent',
                text: response.reply || response.ai_message || response.text
            }])

            // Apply map command if present
            const mapCmd = response.map_command || response.map_action
            if (mapCmd && mapCmd.payload) {
                if (mapCmd.type === 'RESET') {
                    clearFilters()
                } else if (mapCmd.type === 'FILTER_AND_FLY' || mapCmd.type === 'FILTER') {
                    updateFilters(mapCmd.payload)
                }
            }
        } catch (error) {
            console.error('Chat error:', error)
            setMessages(prev => [...prev, {
                role: 'agent',
                text: '❌ Sorry, I encountered an error. Please try again or rephrase your query.'
            }])
        } finally {
            setLoading(false)
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    const handleClearChat = () => {
        setMessages([{
            role: 'agent',
            text: 'Chat cleared. How can I help you find properties today?'
        }])
        clearFilters()
        hasProcessedInitialPrompt.current = false
    }

    return (
        <>
            {/* Zone A: Header (Fixed) */}
            <div className="flex-none p-4 border-b border-bg-input bg-bg-deep">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Sparkles className="text-veridian-neon" size={20} />
                        <h2 className="text-lg font-semibold text-text-head">Veridian Agent</h2>
                        <span className="text-xs text-veridian-neon">(Online)</span>
                    </div>
                    <button
                        onClick={handleClearChat}
                        className="text-text-body hover:text-text-head transition-colors flex items-center gap-1 text-sm"
                        title="Clear Chat"
                    >
                        <X size={16} />
                        Clear
                    </button>
                </div>
            </div>

            {/* Zone B: Scrollable Message Area (Flex-1) */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                <AnimatePresence>
                    {messages.map((message, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[85%] p-3 ${message.role === 'user'
                                    ? 'bg-veridian-neon/20 text-text-head font-medium rounded-lg rounded-tr-none border border-veridian-neon/30'
                                    : 'glass-panel text-text-body rounded-lg rounded-tl-none font-mono text-sm'
                                    }`}
                            >
                                <p className="whitespace-pre-wrap">{message.text}</p>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Typing Indicator */}
                {loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-start"
                    >
                        <div className="glass-panel p-3 rounded-lg rounded-tl-none flex items-center gap-2">
                            <div className="flex gap-1">
                                <span className="w-2 h-2 bg-veridian-neon rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                <span className="w-2 h-2 bg-veridian-neon rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                <span className="w-2 h-2 bg-veridian-neon rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                            </div>
                            <span className="text-sm text-text-body ml-2">Analyzing...</span>
                        </div>
                    </motion.div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Zone C: Fixed Input Area (Flex-None, Never Scrolls) */}
            <div className="flex-none p-4 bg-bg-deep/95 backdrop-blur-sm border-t border-bg-input">
                <div className="flex gap-2">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Ask me to find safe villas in Baner..."
                        disabled={loading}
                        rows={1}
                        className="flex-1 bg-bg-input text-text-body px-4 py-3 rounded-lg border border-white/10 focus:border-veridian-neon focus:outline-none transition-colors disabled:opacity-50 resize-none max-h-32"
                    />
                    <Button
                        onClick={() => handleSend()}
                        disabled={loading || !input.trim()}
                        className="px-4 self-end"
                    >
                        <Send size={20} className={loading ? 'opacity-50' : ''} />
                    </Button>
                </div>
            </div>
        </>
    )
}
