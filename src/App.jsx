import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { MapProvider } from './context/MapContext'
import Onboarding from './pages/Onboarding'
import Home from './pages/Home'
import Search from './pages/Search'
import PropertyDetail from './pages/PropertyDetail'
import Profile from './pages/Profile'

export default function App() {
    return (
        <BrowserRouter>
            <MapProvider>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/onboarding" element={<Onboarding />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/property/:propertyId" element={<PropertyDetail />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </MapProvider>
        </BrowserRouter>
    )
}
