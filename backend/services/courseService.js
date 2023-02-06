import { client } from '../models/db.js'

export default class CourseService {
    static async getRunningSemester() {
        try {
            const semester = await client.query(
                `SELECT year, semester FROM reg_dates WHERE start_time <= CURRENT_TIMESTAMP ORDER BY start_time DESC LIMIT 1`
            )
            return semester.rowCount > 0 ? semester.rows[0] : null
        } catch (error) {
            throw Error(`Error fetching running semester.`)
        }
    }

    static async getRunningSections() {
        const runningSemester = await CourseService.getRunningSemester()
        if (!runningSemester) {
            throw Error(`Currently no running semester.`)
        }
        try {
            const sections = await client.query(
                `SELECT course_id, title, dept_name, credits, sec_id, year, semester, time_slot_id 
                    FROM course NATURAL JOIN section WHERE year = '${runningSemester.year}' AND semester = '${runningSemester.semester}'`
            )
            return sections.rows
        } catch (error) {
            throw Error(`Error fetching running sections.`)
        }
    }

    static async getCourseSections(id) {
        try {
            const sections = await client.query(`SELECT * FROM course NATURAL LEFT OUTER JOIN section WHERE course_id = '${id}'`)
            return sections.rows
        } catch (error) {
            throw Error(`Error fetching sections for course ${id}.`)
        }
    }

    static async getPrereqs(id) {
        try {
            const prereqs = await client.query(
                `SELECT prereq_id, title, dept_name, credits FROM prereq, course WHERE prereq.course_id = '${id}' AND prereq.prereq_id = course.course_id`
            )
            return prereqs.rows
        } catch (error) {
            throw Error(`Error fetching prereqs for course ${id}.`)
        }
    }

    static async getTeaches(id) {
        try {
            const teaches = await client.query(
                `SELECT id, sec_id, semester, year, name, dept_name FROM teaches NATURAL JOIN instructor WHERE course_id = '${id}'`
            )
            return teaches.rows
        } catch (error) {
            throw Error(`Error fetching teaches for course ${id}.`)
        }
    }

    static async getAllCourses() {
        try {
            const courses = await client.query(`SELECT course_id, title, dept_name, credits, building FROM course NATURAL JOIN department`)
            return courses.rows
        } catch (error) {
            throw Error(`Error fetching all courses.`)
        }
    }

    static async getRunningDepartments() {
        const runningSemester = await CourseService.getRunningSemester()
        if (!runningSemester) {
            throw Error(`Currently no running semester.`)
        }
        try {
            const departments = await client.query(
                `SELECT dept_name, building FROM department WHERE dept_name IN 
                (SELECT dept_name FROM course NATURAL JOIN section WHERE year = '${runningSemester.year}' AND semester = '${runningSemester.semester}')`
            )
            return departments.rows
        } catch (error) {
            throw Error(`Error fetching running departments.`)
        }
    }

    static async getAllDepartments() {
        try {
            const departments = await client.query(`SELECT dept_name, building FROM department`)
            return departments.rows
        } catch (error) {
            console.log(error)
            throw Error(`Error fetching all departments.`)
        }
    }

    static async getRunningCourse(dept_name = null) {
        const runningSemester = await CourseService.getRunningSemester()
        if (!runningSemester) {
            throw Error(`Currently no running semester.`)
        }
        try {
            const courses = await client.query(
                `SELECT DISTINCT course_id, title, dept_name, credits FROM course NATURAL JOIN section 
                    WHERE year = '${runningSemester.year}' AND semester = '${runningSemester.semester}' ${
                    dept_name ? `AND dept_name = '${dept_name}'` : ''
                }`
            )
            return courses.rows
        } catch (error) {
            throw Error(`Error fetching running courses.`)
        }
    }

    static async getCourses(dept_name = null) {
        try {
            const courses = await client.query(`SELECT * FROM course ${dept_name ? `WHERE dept_name = '${dept_name}'` : ''}`)
            return courses.rows
        } catch (error) {
            throw Error(`Error fetching courses.`)
        }
    }
}
