const API_BASE = import.meta.env.PROD ? '' : 'http://localhost:8000'

export async function getProperties(filters = {}) {
    const params = new URLSearchParams()

    Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
            params.append(key, value)
        }
    })

    const url = `${API_BASE}/api/properties?${params.toString()}`
    const response = await fetch(url)

    if (!response.ok) {
        throw new Error('Failed to fetch properties')
    }

    return response.json()
}

export async function calculateScore(propertyId, userProfile) {
    const response = await fetch(`${API_BASE}/api/score`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            property_id: propertyId,
            user_profile: userProfile
        })
    })

    if (!response.ok) {
        throw new Error('Failed to calculate score')
    }

    return response.json()
}

export async function sendChatMessage(message, userProfile, history = []) {
    const response = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            message,
            user_profile: userProfile,
            conversation_history: history
        })
    })

    if (!response.ok) {
        throw new Error('Failed to send message')
    }

    return response.json()
}
