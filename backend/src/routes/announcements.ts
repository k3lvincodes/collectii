
import { Router } from 'express'
import { createAnnouncement, getAnnouncements } from '../controllers/announcements'
import { requireAuth } from '../middleware/auth'

const router = Router()

router.use(requireAuth)

router.get('/', getAnnouncements)
router.post('/', createAnnouncement)

export default router
