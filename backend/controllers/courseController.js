import express from 'express'
import asyncHandler from 'express-async-handler'
import CourseService from '../services/courseService.js'
import RegistrationService from '../services/registrationService.js'
import UtilityService from '../services/utilityService.js'
import { authorize, studentAuthorize } from './middleware.js'

const router = express.Router()

// @desc    Get running courses
// @route   GET /api/course/running
// @access  Private
const getRunningCourses = asyncHandler(async (req, res) => {
    const courses = UtilityService.groupSectionsByCourse(await CourseService.getRunningSections())
    res.status(200).json(courses)
})

// @desc    Register a course
// @route   POST /api/course/register
// @access  Private
const courseRegister = asyncHandler(async (req, res) => {
    const id = req.user.id
    const section = req.body
    if (!(section && section.year && section.semester && section.course_id && section.sec_id)) {
        throw Error(`Section not valid`)
    }
    const runningSemester = await CourseService.getRunningSemester()
    if (!(section.year == runningSemester.year && section.semester == runningSemester.semester)) {
        throw Error(`Section not running.`)
    }
    if (!(await RegistrationService.checkSlotClash(id, section))) {
        throw Error(`Slot clash in this section.`)
    }
    if (!(await RegistrationService.checkPrereq(id, section.course_id))) {
        throw Error(`Prereqs not satisfied.`)
    }
    await RegistrationService.sectionRegister(id, section)
    res.status(200).json({
        message: 'Registration successful.'
    })
})

// @desc    Drop a course
// @route   POST /api/course/drop
// @access  Private
const courseDrop = asyncHandler(async (req, res) => {
    const id = req.user.id
    const section = req.body
    if (!(section && section.year && section.semester && section.course_id && section.sec_id)) {
        throw Error(`Section not valid`)
    }
    const runningSemester = await CourseService.getRunningSemester()
    if (!(section.year == runningSemester.year && section.semester == runningSemester.semester)) {
        throw Error(`Section not running.`)
    }
    await RegistrationService.sectionDrop(id, section)
    res.status(200).json({
        message: 'Drop successful.'
    })
})

// @desc    Get course details
// @route   GET /api/course/:course_id
// @access  Private
const getCourseDetails = asyncHandler(async (req, res) => {
    const id = req.params.course_id
    const course = UtilityService.groupSectionsByCourse(await CourseService.getCourseSections(id))[0]
    const prereqs = await CourseService.getPrereqs(id)
    const teaches = await CourseService.getTeaches(id)
    res.status(200).json({
        course: course,
        prereqs: prereqs,
        teaches: teaches
    })
})

// @desc    Get all departments
// @route   GET /api/course/departments
// @access  Private
const getDepartments = asyncHandler(async (req, res) => {
    const running = req.query.running ? Boolean(req.query.running) : false
    const departments = running ? await CourseService.getRunningDepartments() : await CourseService.getAllDepartments()
    res.status(200).json(departments)
})

// @desc    Get courses based on query params
// @route   GET /api/course/
// @access  Private
const getCourses = asyncHandler(async (req, res) => {
    const dept_name = req.query.dept_name ? String(req.query.dept_name) : null
    const courses = req.query.running ? await CourseService.getRunningCourse(dept_name) : await CourseService.getCourses(dept_name)
    res.status(200).json(courses)
})

router.route('/running').get(authorize, getRunningCourses)
router.route('/register').post(authorize, studentAuthorize, courseRegister)
router.route('/drop').post(authorize, studentAuthorize, courseDrop)
router.route('/departments').get(authorize, getDepartments)
router.route('/:course_id').get(authorize, getCourseDetails)
router.route('/').get(authorize, getCourses)

export default router
