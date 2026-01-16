
import { Response } from 'express'
import { AuthRequest } from '../middleware/auth.js'
import { supabase } from '../lib/supabase.js'

export const getAnnouncements = async (req: AuthRequest, res: Response) => {
    const { data, error } = await supabase
        .from('announcements')
        .select(`
            *,
            author:author_id(full_name, avatar_url)
        `)
        .order('created_at', { ascending: false })

    if (error) {
        return res.status(500).json({ error: 'Failed to fetch announcements' })
    }

    res.json(data)
}

export const createAnnouncement = async (req: AuthRequest, res: Response) => {
    const user = req.user
    if (!user) return res.status(401).json({ error: 'Unauthorized' })

    const { data: profile } = await supabase.from('profiles').select('user_id').eq('id', user.id).single()
    if (!profile?.user_id) return res.status(403).json({ error: 'No organization found' })

    const { title, content, group, isPinned } = req.body

    const { error } = await supabase
        .from('announcements')
        .insert({
            organization_id: profile.user_id,
            author_id: user.id,
            title,
            content,
            group,
            is_pinned: isPinned
        })

    if (error) {
        return res.status(500).json({ error: 'Failed to create announcement' })
    }

    res.status(201).json({ success: true })
}
