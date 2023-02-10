import express from 'express'
import asyncHandler from 'express-async-handler'

import { authorize, studentAuthorize } from './middleware.js'
import StudentService from '../services/studentService.js'
import CourseService from '../services/courseService.js'
import UtilityService from '../services/utilityService.js'

const router = express.Router()

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

router.route('/').get(authorize, studentAuthorize, getStudentDetails)
router.route('/info').get(authorize, studentAuthorize, getStudentInfo)

export default router
