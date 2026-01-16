
import { Router } from 'express'
import { createAnnouncement, getAnnouncements } from '../controllers/announcements.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.use(requireAuth)

router.get('/', getAnnouncements)
router.post('/', createAnnouncement)

export default router
