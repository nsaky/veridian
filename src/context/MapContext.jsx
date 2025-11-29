import { createContext, useContext, useState } from 'react'

const MapContext = createContext()

export function MapProvider({ children }) {
    const [filters, setFilters] = useState({
        locality: null,
        property_type: null,
        min_price: null,
        max_price: null,
        bedrooms: null,
        min_score: null,
        litigation: null,
        rera_status: null,
        ids: null,  // For filtering by specific property IDs
        center_lat: null,
        center_lng: null,
        zoom: null
    })

    const [explorePropertyId, setExplorePropertyId] = useState(null)

    const updateFilters = (newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters }))
    }

    const clearFilters = () => {
        setFilters({
            locality: null,
            property_type: null,
            min_price: null,
            max_price: null,
            bedrooms: null,
            min_score: null,
            litigation: null,
            rera_status: null,
            ids: null,
            center_lat: null,
            center_lng: null,
            zoom: null
        })
    }

    const exploreProperty = (propertyId) => {
        setExplorePropertyId(propertyId)
    }

    return (
        <MapContext.Provider value={{
            filters,
            updateFilters,
            clearFilters,
            exploreProperty,
            explorePropertyId,
            setExplorePropertyId
        }}>
            {children}
        </MapContext.Provider>
    )
}

export function useMapContext() {
    const context = useContext(MapContext)
    if (!context) {
        throw new Error('useMapContext must be used within MapProvider')
    }
    return context
}
