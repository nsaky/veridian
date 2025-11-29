import { motion } from 'framer-motion'

export default function Card({
    children,
    className = '',
    neonBorder = false,
    dangerBorder = false
}) {
    const borderClass = neonBorder
        ? 'neon-border'
        : dangerBorder
            ? 'danger-border'
            : ''

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-panel rounded-xl p-6 ${borderClass} ${className}`}
        >
            {children}
        </motion.div>
    )
}
