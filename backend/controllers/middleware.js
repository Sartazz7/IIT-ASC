import asyncHandler from 'express-async-handler'

import AuthService from '../services/authService.js'
import InstructorService from '../services/instructorService.js'
import StudentService from '../services/studentService.js'

const authorize = asyncHandler(async (req, res, next) => {
    const session = req.session

    if (!session.userId) {
        res.status(401)
        throw Error('Session Expired')
    }
    const user = await AuthService.getUserById(session.userId)
    if (!user) {
        res.status(401)
        throw Error('Not authorized, authorization failed.')
    }
    req.user = user
    next()
})

const studentAuthorize = asyncHandler(async (req, res, next) => {
    const id = req.user.id
    if (!(await StudentService.getStudentById(id))) {
        res.status(401)
        throw Error(`Not authorized as student.`)
    }
    next()
})

const instructorAuthorize = asyncHandler(async (req, res, next) => {
    const id = req.user.id
    if (!(await InstructorService.getInstructorById(id))) {
        res.status(401)
        throw Error(`Not authorized as instructor.`)
    }
    next()
})

const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode
    res.status(statusCode)
    res.json({
        message: err.message,
        stack: err.stack
    })
}

export { authorize, errorHandler, studentAuthorize, instructorAuthorize }
