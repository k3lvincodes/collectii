
import { Router } from 'express'
import { createTeam, getTeamMembers, getTeams } from '../controllers/teams'
import { requireAuth } from '../middleware/auth'

const router = Router()

router.use(requireAuth)

router.get('/', getTeams)
router.get('/:id/members', getTeamMembers)
router.post('/', createTeam)

export default router
