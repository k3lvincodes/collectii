
import { createClient } from "@/lib/supabase/client"

export async function createAnnouncement(formData: FormData) {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) return { error: 'Unauthorized' }

    const data: Record<string, any> = {}
    formData.forEach((value, key) => {
        // Handle checkbox/boolean if needed, simplified here
        if (key === 'isPinned') {
            data[key] = value === 'on'
        } else {
            data[key] = value
        }
    })

    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/announcements`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.access_token}`
            },
            body: JSON.stringify(data)
        })

        if (!response.ok) {
            const resJson = await response.json().catch(() => ({}))
            return { error: resJson.error || 'Failed to post announcement' }
        }

        return { success: true }
    } catch (e) {
        return { error: 'Network error' }
    }
}
