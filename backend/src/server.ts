
// Force reload
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const port = process.env.PORT || 4000

app.use(cors())
app.use(morgan('dev'))
app.use(express.json())

import tasksRouter from './routes/tasks.js'
app.use('/api/tasks', tasksRouter)

import teamsRouter from './routes/teams.js'
app.use('/api/teams', teamsRouter)

import announcementsRouter from './routes/announcements.js'
app.use('/api/announcements', announcementsRouter)

import systemRouter from './routes/system.js'
app.use('/api/system', systemRouter)

import adminRouter from './routes/admin.js'
app.use('/api/admin', adminRouter)

import authRouter from './routes/auth.js'
app.use('/api/auth', authRouter)



app.get('/', (req, res) => {
    res.send('Collectii Backend is running')
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})
