
import { createClient } from "@/lib/supabase/client"

export async function createTask(formData: FormData) {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) return { error: 'Unauthorized' }

    // Convert FormData to JSON object
    const data: Record<string, any> = {}
    formData.forEach((value, key) => data[key] = value)

    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.access_token}`
            },
            body: JSON.stringify(data)
        })

        if (!response.ok) {
            // Try to parse error
            const resJson = await response.json().catch(() => ({}))
            return { error: resJson.error || 'Failed to create task' }
        }

        return { success: true }
    } catch (e) {
        console.error(e)
        return { error: 'Network error' }
    }
}
