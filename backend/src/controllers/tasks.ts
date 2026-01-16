
import { Response } from 'express'
import { AuthRequest } from '../middleware/auth.js'
import { supabase } from '../lib/supabase.js'

export const getKey = async (req: AuthRequest, res: Response) => {
    // This is just a placeholder example based on nothing, checking previous conversation summaries
    // But honestly I should focus on the requested migration tasks.
    // The previous summary mentioned verifying API endpoints.
    // I'll skip this file if it's not needed, but I'll implement tasks controller instead.
    res.status(501).send('Not implemented')
}

export const getTasks = async (req: AuthRequest, res: Response) => {
    const user = req.user

    if (!user) {
        return res.status(401).json({ error: 'Unauthorized' })
    }

    // Get all organization IDs the user belongs to
    const { data: memberships } = await supabase
        .from('organization_members')
        .select('organization_id')
        .eq('user_id', user.id)

    const orgIds = memberships?.map(m => m.organization_id) || []

    // Fetch tasks from all user's organizations + tasks assigned directly to user
    let query = supabase
        .from('tasks')
        .select(`
      *,
      assignee:assignee_id(full_name, avatar_url),
      team:team_id(name)
    `)
        .order('created_at', { ascending: false })

    // If user has orgs, get tasks from those orgs OR tasks assigned to user
    if (orgIds.length > 0) {
        query = query.or(`organization_id.in.(${orgIds.join(',')}),assignee_id.eq.${user.id}`)
    } else {
        // No org memberships - just get tasks assigned to this user
        query = query.eq('assignee_id', user.id)
    }

    const { data, error } = await query

    if (error) {
        console.error('Error fetching tasks:', error)
        return res.status(500).json({ error: 'Failed to fetch tasks' })
    }

    res.json(data || [])
}

export const createTask = async (req: AuthRequest, res: Response) => {
    const user = req.user
    if (!user) return res.status(401).json({ error: 'Unauthorized' })

    const { title, description, priority, status, estimatedHours, assigneeId, teamId, deadline, organization_id } = req.body

    // If organization_id provided, verify user is a member
    if (organization_id) {
        const { data: membership } = await supabase
            .from('organization_members')
            .select('id')
            .eq('organization_id', organization_id)
            .eq('user_id', user.id)
            .single()

        if (!membership) {
            return res.status(403).json({ error: 'Not a member of this organization' })
        }
    }

    const { error } = await supabase
        .from('tasks')
        .insert({
            organization_id: organization_id || null,
            title,
            description,
            priority,
            status: status || 'todo',
            estimated_hours: estimatedHours,
            assignee_id: assigneeId || user.id,
            team_id: teamId,
            deadline
        })

    if (error) {
        console.error('Error creating task:', error)
        return res.status(500).json({ error: 'Failed to create task' })
    }

    res.status(201).json({ success: true })
}

export const updateTask = async (req: AuthRequest, res: Response) => {
    const { id } = req.params
    const updates = req.body
    const user = req.user

    if (!user) return res.status(401).json({ error: 'Unauthorized' })

    // Fetch task to verify access
    const { data: task } = await supabase.from('tasks').select('organization_id, assignee_id').eq('id', id).single()

    if (!task) {
        return res.status(404).json({ error: 'Task not found' })
    }

    // Check authorization: user is assignee OR user is member of task's organization
    let authorized = task.assignee_id === user.id

    if (!authorized && task.organization_id) {
        const { data: membership } = await supabase
            .from('organization_members')
            .select('id')
            .eq('organization_id', task.organization_id)
            .eq('user_id', user.id)
            .single()
        authorized = !!membership
    }

    if (!authorized) {
        return res.status(403).json({ error: 'Unauthorized' })
    }

    const { error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)

    if (error) {
        return res.status(500).json({ error: 'Failed to update task' })
    }

    res.json({ success: true })
}

export const deleteTask = async (req: AuthRequest, res: Response) => {
    const { id } = req.params
    const user = req.user

    if (!user) return res.status(401).json({ error: 'Unauthorized' })

    // Fetch task to verify access
    const { data: task } = await supabase.from('tasks').select('organization_id, assignee_id').eq('id', id).single()

    if (!task) {
        return res.status(404).json({ error: 'Task not found' })
    }

    // Check authorization: user is assignee OR user is member of task's organization
    let authorized = task.assignee_id === user.id

    if (!authorized && task.organization_id) {
        const { data: membership } = await supabase
            .from('organization_members')
            .select('id')
            .eq('organization_id', task.organization_id)
            .eq('user_id', user.id)
            .single()
        authorized = !!membership
    }

    if (!authorized) {
        return res.status(403).json({ error: 'Unauthorized' })
    }

    const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)

    if (error) {
        return res.status(500).json({ error: 'Failed to delete task' })
    }

    res.json({ success: true })
}
