import asyncHandler from 'express-async-handler'
import StudentService from '../services/studentService.js'

const authorize = asyncHandler(async (req, res, next) => {
	const session = req.session

	if (!session.studentId) {
		res.status(401)
		throw Error('Session Expired')
	}
	const user = await StudentService.getUserById(session.studentId)
	if (!user) {
		res.status(401)
		throw Error('Not authorized, authorization failed.')
	}
	req.user = user
	next()
})

const errorHandler = (err, req, res, next) => {
	const statusCode = res.statusCode === 200 ? 500 : res.statusCode
	res.status(statusCode)
	res.json({
		message: err.message,
		stack: err.stack,
	})
}

export { authorize, errorHandler }
