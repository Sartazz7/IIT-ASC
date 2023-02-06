import { client } from '../models/db.js'

export default class InstructorService {
    static async getInstructorById(id) {
        try {
            const instructor = await client.query(`SELECT id, name, dept_name FROM instructor WHERE id = '${id}'`)
            return instructor.rowCount > 0 ? instructor.rows[0] : null
        } catch (error) {
            throw Error(`Error fetching instructor with id ${id}.`)
        }
    }

    static async getInstructorCourses(id) {
        try {
            const courses = await client.query(
                `SELECT course_id, sec_id, title, dept_name, credits, semester, year, start_time, end_time 
                    FROM course NATURAL JOIN section NATURAL JOIN teaches NATURAL LEFT OUTER JOIN reg_dates WHERE id = '${id}'`
            )
            return courses.rows
        } catch (error) {
            throw Error(`Error fetching course details for instructor with id ${id}.`)
        }
    }

    static async getAllInstructors() {
        try {
            const instructors = await client.query(`SELECT id, name, dept_name FROM instructor`)
            return instructors.rows
        } catch (error) {
            throw Error(`Error fetching instructors.`)
        }
    }
}
