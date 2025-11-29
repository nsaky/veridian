import { motion } from 'framer-motion'

export default function Button({
    children,
    variant = 'primary',
    onClick,
    className = '',
    disabled = false,
    type = 'button'
}) {
    const variants = {
        primary: 'bg-veridian-neon text-bg-deep hover:shadow-[0_0_20px_rgba(0,255,133,0.5)] font-semibold',
        secondary: 'bg-bg-input text-text-head border border-white/20 hover:border-veridian-neon/50',
        danger: 'bg-signal-danger text-white hover:shadow-[0_0_20px_rgba(255,68,68,0.5)] font-semibold'
    }

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            disabled={disabled}
            type={type}
            className={`px-6 py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
        >
            {children}
        </motion.button>
    )
}
