import express from 'express'
import asyncHandler from 'express-async-handler'

import { authorize } from './middleware.js'
import InstructorService from '../services/instructorService.js'
import UtilityService from '../services/utilityService.js'
import CourseService from '../services/courseService.js'

const router = express.Router()

// @desc    Get instructor data
// @route   GET /api/instructor/:instructor_id
// @access  Private
const getInstructorDetails = asyncHandler(async (req, res) => {
    const id = req.params.instructor_id
    const instructor = await InstructorService.getInstructorById(id)
    if (!instructor) {
        res.status(404)
        throw Error(`Instructor with id ${id} not found.`)
    }
    const filteredCourses = UtilityService.filterByRunningSemester(
        await InstructorService.getInstructorCourses(id),
        await CourseService.getRunningSemester()
    )
    res.status(200).json({
        instructor_info: instructor,
        previous_courses: filteredCourses.notRunning,
        current_courses: filteredCourses.running
    })
})

// @desc    Get all instructors
// @route   GET /api/instructor
// @access  Private
const getInstructors = asyncHandler(async (req, res) => {
    const instructors = await InstructorService.getAllInstructors()
    res.status(200).json(instructors)
})

router.route('/').get(authorize, getInstructors)
router.route('/:instructor_id').get(authorize, getInstructorDetails)

export default router
