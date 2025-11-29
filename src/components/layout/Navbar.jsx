import { Link, useLocation } from 'react-router-dom'
import { Home, Search, User } from 'lucide-react'

export default function Navbar() {
    const location = useLocation()

    // Don't show navbar on onboarding
    if (location.pathname === '/onboarding') return null

    const isActive = (path) => location.pathname === path

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 glass-panel-solid border-t border-white/10">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-around items-center h-16">
                    <NavItem to="/" icon={<Home size={24} />} label="Home" active={isActive('/')} />
                    <NavItem to="/search" icon={<Search size={24} />} label="Search" active={isActive('/search')} />
                    <NavItem to="/profile" icon={<User size={24} />} label="Profile" active={isActive('/profile')} />
                </div>
            </div>
        </nav>
    )
}

function NavItem({ to, icon, label, active }) {
    return (
        <Link
            to={to}
            className={`flex flex-col items-center gap-1 px-4 py-2 transition-colors ${active ? 'text-veridian-neon' : 'text-text-body hover:text-text-head'
                }`}
        >
            {icon}
            <span className="text-xs font-medium">{label}</span>
        </Link>
    )
}
