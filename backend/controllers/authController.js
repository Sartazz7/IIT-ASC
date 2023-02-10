import express from 'express'
import asyncHandler from 'express-async-handler'

import StudentService from '../services/studentService.js'
import AuthService from '../services/authService.js'
import InstructorService from '../services/instructorService.js'

const router = express.Router()

// @desc    Register Student
// @route   GET /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
    const id = req.body.id
    const password = req.body.password
    if (!id || !password) {
        res.status(400)
        throw Error('id or Password not provided.')
    }
    if (await AuthService.getUserById(id)) {
        res.status(403)
        throw Error(`User with ${id} already registered.`)
    }
    if (!(await StudentService.getStudentById(id)) && !(await InstructorService.getInstructorById(id))) {
        res.status(400)
        throw Error(`Instructor or Student with id = '${id}' doesn't exists.`)
    }
    await AuthService.createUser(id, password)
    res.status(200).json({
        message: 'Registration successful'
    })
})

// @desc    Login Student
// @route   GET /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
    const id = req.body.id
    const password = req.body.password
    if (!id || !password) {
        res.status(400)
        throw Error('ID or Password not provided.')
    }
    await AuthService.checkPassword(id, password)
    var session = req.session
    session.userId = id
    res.status(200).json({
        message: 'Login successful'
    })
})

// @desc    Get student
// @route   GET /api/auth/logout
// @access  Private
const logout = asyncHandler(async (req, res) => {
    req.session.destroy()
    res.status(200).json({
        message: 'Logout successful'
    })
})

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/logout').get(logout)

export default router
