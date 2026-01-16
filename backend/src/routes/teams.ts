
import { Router } from 'express'
import { createTeam, getTeamMembers, getTeams } from '../controllers/teams.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.use(requireAuth)

router.get('/', getTeams)
router.get('/:id/members', getTeamMembers)
router.post('/', createTeam)

export default router
