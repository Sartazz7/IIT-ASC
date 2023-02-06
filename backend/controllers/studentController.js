import express from 'express'
import asyncHandler from 'express-async-handler'

import { authorize } from './middleware.js'
import StudentService from '../services/studentService.js'
import CourseService from '../services/courseService.js'
import UtilityService from '../services/utilityService.js'

const router = express.Router()

// @desc    Register Student
// @route   GET /api/student/register
// @access  Public
const studentRegister = asyncHandler(async (req, res) => {
    const id = req.body.id
    const password = req.body.password
    if (!id || !password) {
        res.status(400)
        throw Error('id or Password not provided.')
    }
    if (await StudentService.getUserById(id)) {
        res.status(403)
        throw Error(`User with ${id} already registered.`)
    }
    if (!(await StudentService.getStudentById(id))) {
        res.status(400)
        throw Error(`student with id = '${id}' doesn't exists.`)
    }
    await StudentService.createUser(id, password)
    res.status(200).json({
        id: id
    })
})

// @desc    Login Student
// @route   GET /api/student/login
// @access  Public
const studentLogin = asyncHandler(async (req, res) => {
    const id = req.body.id
    const password = req.body.password
    if (!id || !password) {
        res.status(400)
        throw Error('ID or Password not provided.')
    }
    await StudentService.checkPassword(id, password)
    var session = req.session
    session.studentId = id
    res.status(200).json({
        id: id
    })
})

// @desc    Get student data
// @route   GET /api/student
// @access  Private
const getStudentDetails = asyncHandler(async (req, res) => {
    const id = req.user.id
    const student = await StudentService.getStudentById(id)
    const filteredCourses = UtilityService.filterByRunningSemester(
        await StudentService.getStudentCourses(id),
        await CourseService.getRunningSemester()
    )
    res.status(200).json({
        student_info: student,
        previous_courses: UtilityService.groupCoursesByYearSemester(filteredCourses.notRunning),
        current_courses: filteredCourses.running
    })
})

// @desc    Get student
// @route   GET /api/student/info
// @access  Private
const getStudentInfo = asyncHandler(async (req, res) => {
    const id = req.user.id
    const student = await StudentService.getStudentById(id)
    res.status(200).json(student)
})

// @desc    Get student
// @route   GET /api/student/info
// @access  Private
const studentLogout = asyncHandler(async (req, res) => {
    req.session.destroy()
    res.status(200).json({
        message: 'successful'
    })
})

router.route('/register').post(studentRegister)
router.route('/login').post(studentLogin)
router.route('/').get(authorize, getStudentDetails)
router.route('/info').get(authorize, getStudentInfo)
router.route('/logout').get(studentLogout)

export default router
