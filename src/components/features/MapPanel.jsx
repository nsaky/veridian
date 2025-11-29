import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import { useMapContext } from '../../context/MapContext'
import { getProperties } from '../../lib/api'

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || 'pk.eyJ1IjoidmVyaWRpYW4iLCJhIjoiY20zeTB3ZjNrMDEyZzJrcHlyNnVxNGV1eSJ9.placeholder'

export default function MapPanel() {
    const mapContainer = useRef(null)
    const map = useRef(null)
    const markers = useRef([])
    const [properties, setProperties] = useState([])
    const { filters, exploreProperty } = useMapContext()
    const [user, setUser] = useState(null)

    useEffect(() => {
        const userData = localStorage.getItem('veridianUser')
        if (userData) {
            setUser(JSON.parse(userData))
        }
    }, [])

    // Initialize map
    useEffect(() => {
        if (map.current) return

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/dark-v11',
            center: [73.8567, 18.5204],
            zoom: 11
        })

        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right')
    }, [])

    // Load properties when filters change
    useEffect(() => {
        loadProperties()
    }, [filters])

    const loadProperties = async () => {
        try {
            const params = new URLSearchParams()

            // Map filters to API parameters
            if (filters.locality) params.append('locality', filters.locality)
            if (filters.property_type) params.append('property_type', filters.property_type)
            if (filters.min_price) params.append('min_price', filters.min_price)
            if (filters.max_price) params.append('max_price', filters.max_price)
            if (filters.bedrooms) params.append('bedrooms', filters.bedrooms)

            const response = await getProperties(filters)
            let filteredProps = response.properties || []

            // If IDs specified (from agentic command), filter by IDs
            if (filters.ids && filters.ids.length > 0) {
                filteredProps = filteredProps.filter(p => filters.ids.includes(p.id))
            }

            setProperties(filteredProps)
        } catch (error) {
            console.error('Failed to load properties:', error)
        }
    }

    // Calculate quick score
    const getPropertyScore = (property) => {
        const yieldScore = property.rental_yield > 3.5 ? 1 : 0.5
        const growthScore = property.appreciation > 45 ? 1 : 0.5
        const legalScore = (property.litigation === 0 && property.rera_status === 'Approved') ? 1 : 0

        const baseScore = (yieldScore * 0.3 + growthScore * 0.4 + legalScore * 0.3)
        return 1 + (baseScore * 9)
    }

    // Update markers when properties change
    useEffect(() => {
        if (!map.current || !properties.length) return

        // Clear existing markers
        markers.current.forEach(marker => marker.remove())
        markers.current = []

        // Add new markers
        properties.forEach(property => {
            const score = getPropertyScore(property)

            // Create marker element
            const el = document.createElement('div')
            el.className = 'custom-marker'
            el.innerHTML = `
                <div class="relative w-12 h-12 flex items-center justify-center cursor-pointer group">
                    <div class="absolute inset-0 rounded-full ${score >= 7
                    ? 'bg-bg-deep border-2 border-veridian-neon shadow-[0_0_10px_rgba(0,255,133,0.4)]'
                    : score >= 4
                        ? 'bg-bg-deep border-2 border-signal-warning shadow-[0_0_10px_rgba(255,215,0,0.4)]'
                        : 'bg-bg-deep border-2 border-signal-danger shadow-[0_0_10px_rgba(255,68,68,0.4)]'
                } group-hover:scale-110 transition-transform"></div>
                    <span class="relative z-10 font-mono font-bold text-white text-sm">${score.toFixed(1)}</span>
                </div>
            `

            // Create popup with "Explore with Veridian" button
            const popupHTML = `
                <div class="glass-panel p-4 rounded-lg min-w-[300px]">
                    <img src="${property.image_url}" alt="${property.title}" class="w-full h-32 object-cover rounded-lg mb-3" />
                    
                    <h3 class="text-text-head font-semibold mb-2 line-clamp-2">${property.title}</h3>
                    
                    <div class="space-y-1 text-sm mb-3">
                        <div class="flex justify-between">
                            <span class="text-text-body">Type:</span>
                            <span class="text-text-head font-medium">${property.property_type}</span>
                        </div>
                        ${property.bedrooms > 0 ? `
                        <div class="flex justify-between">
                            <span class="text-text-body">Config:</span>
                            <span class="text-text-head">${property.bedrooms} BHK</span>
                        </div>
                        ` : ''}
                        <div class="flex justify-between">
                            <span class="text-text-body">Price:</span>
                            <span class="text-text-head font-mono font-bold">₹${(property.price / 10000000).toFixed(2)}Cr</span>
                        </div>
                        ${property.rental_yield > 0 ? `
                        <div class="flex justify-between">
                            <span class="text-text-body">Yield:</span>
                            <span class="text-veridian-neon font-semibold">${property.rental_yield}%</span>
                        </div>
                        ` : ''}
                        <div class="flex justify-between">
                            <span class="text-text-body">Growth:</span>
                            <span class="text-veridian-neon font-semibold">+${property.appreciation}%</span>
                        </div>
                    </div>
                    
                    <div class="space-y-2">
                        <button 
                            data-property-id="${property.id}"
                            data-action="explore"
                            class="w-full bg-veridian-neon/10 border border-veridian-neon text-veridian-neon py-2 px-4 rounded-lg font-semibold hover:bg-veridian-neon/20 transition-all flex items-center justify-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>
                            </svg>
                            Explore with Veridian
                        </button>
                        
                        <button 
                            data-property-id="${property.id}"
                            data-action="memo"
                            class="w-full bg-veridian-neon text-bg-deep py-2 px-4 rounded-lg font-semibold hover:shadow-[0_0_20px_rgba(0,255,133,0.5)] transition-shadow"
                        >
                            Investment Memo →
                        </button>
                    </div>
                </div>
            `

            const popup = new mapboxgl.Popup({
                offset: 25,
                closeButton: false,
                className: 'custom-popup',
                maxWidth: '350px'
            }).setHTML(popupHTML)

            // Add event listeners after popup is added to DOM
            popup.on('open', () => {
                const exploreBtn = document.querySelector(`[data-property-id="${property.id}"][data-action="explore"]`)
                const memoBtn = document.querySelector(`[data-property-id="${property.id}"][data-action="memo"]`)

                if (exploreBtn) {
                    exploreBtn.addEventListener('click', () => {
                        popup.remove()
                        exploreProperty(property.id)
                    })
                }

                if (memoBtn) {
                    memoBtn.addEventListener('click', () => {
                        window.location.href = `/property/${property.id}`
                    })
                }
            })

            const marker = new mapboxgl.Marker(el)
                .setLngLat([property.lng, property.lat])
                .setPopup(popup)
                .addTo(map.current)

            markers.current.push(marker)
        })

        // Fit bounds or center on filtered properties
        if (properties.length > 0) {
            if (filters.center_lat && filters.center_lng && filters.zoom) {
                // Agentic command specified exact center
                map.current.flyTo({
                    center: [filters.center_lng, filters.center_lat],
                    zoom: filters.zoom,
                    duration: 2000
                })
            } else {
                // Auto-fit to show all properties
                const bounds = new mapboxgl.LngLatBounds()
                properties.forEach(p => bounds.extend([p.lng, p.lat]))
                map.current.fitBounds(bounds, { padding: 50, maxZoom: 14, duration: 2000 })
            }
        }
    }, [properties, filters])

    return (
        <div className="relative h-full">
            <div ref={mapContainer} className="w-full h-full" />

            {/* Filter Badge */}
            {Object.values(filters).some(v => v !== null) && (
                <div className="absolute top-4 left-4 glass-panel px-4 py-2 rounded-lg">
                    <p className="text-sm text-text-body">
                        Filters active • {properties.length} properties
                    </p>
                </div>
            )}

            {/* Legend */}
            <div className="absolute bottom-4 right-4 glass-panel p-4 rounded-lg">
                <h4 className="text-text-head font-semibold mb-2 text-sm">Score Legend</h4>
                <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full border-2 border-veridian-neon bg-bg-deep"></div>
                        <span className="text-text-body">7.0+ Strong Buy</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full border-2 border-signal-warning bg-bg-deep"></div>
                        <span className="text-text-body">4.0-6.9 Hold</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full border-2 border-signal-danger bg-bg-deep"></div>
                        <span className="text-text-body">&lt;4.0 High Risk</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
