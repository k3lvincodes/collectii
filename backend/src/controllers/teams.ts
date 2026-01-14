
import { Response } from 'express'
import { AuthRequest } from '../middleware/auth'
import { supabase } from '../lib/supabase'

export const getTeams = async (req: AuthRequest, res: Response) => {
    // Logic from actions/teams.ts
    const { data, error } = await supabase
        .from('teams')
        .select(`
            *,
            lead:lead_id(full_name, avatar_url),
            members:team_members(count)
        `)

    if (error) {
        console.error('Error fetching teams:', error)
        return res.status(500).json({ error: 'Failed to fetch teams' })
    }

    // Transform data
    const teams = data.map((team: any) => ({
        ...team,
        members: team.members[0]?.count || 0
    }))

    res.json(teams)
}

export const getTeamMembers = async (req: AuthRequest, res: Response) => {
    const { id } = req.params
    const { data, error } = await supabase
        .from('team_members')
        .select(`
            *,
            user:user_id(full_name, avatar_url)
        `)
        .eq('team_id', id)

    if (error) {
        return res.status(500).json({ error: 'Failed to fetch team members' })
    }

    res.json(data)
}

export const createTeam = async (req: AuthRequest, res: Response) => {
    const user = req.user
    if (!user) return res.status(401).json({ error: 'Unauthorized' })

    const { data: profile } = await supabase.from('profiles').select('user_id').eq('id', user.id).single()
    if (!profile?.user_id) return res.status(403).json({ error: 'No organization found' })

    const { name, description } = req.body

    const { error } = await supabase
        .from('teams')
        .insert({
            organization_id: profile.user_id,
            name,
            description,
            lead_id: user.id
        })

    if (error) {
        return res.status(500).json({ error: 'Failed to create team' })
    }

    res.status(201).json({ success: true })
}
