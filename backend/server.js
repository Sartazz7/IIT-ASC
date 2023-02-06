import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import session from 'express-session'

import studentRoutes from './controllers/studentController.js'
import courseRoutes from './controllers/courseController.js'
import instructorRoutes from './controllers/instructorController.js'
import { SESSION_SECRET, SESSION_TIMEOUT } from './constants.js'
import { errorHandler } from './controllers/middleware.js'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(
	cors({
		origin: true,
		credentials: true,
	}),
)
app.use(cookieParser())

app.use(
	session({
		secret: SESSION_SECRET,
		saveUninitialized: true,
		cookie: { maxAge: SESSION_TIMEOUT },
		resave: false,
	}),
)

const PORT = process.env.PORT || 5000

app.get('/', (req, res) => {
	res.send('Get request')
})

app.use('/api/course', courseRoutes)
app.use('/api/student', studentRoutes)
app.use('/api/instructor', instructorRoutes)

app.use(errorHandler)

app.listen(PORT, console.log(`Server running on port ${PORT} ...`))
