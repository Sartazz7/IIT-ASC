import { client } from '../models/db.js'

export default class StudentService {
    static async getStudentById(id) {
        try {
            const student = await client.query(`SELECT * FROM student WHERE id = '${id}'`)
            return student.rowCount > 0 ? student.rows[0] : null
        } catch (error) {
            throw Error(`Error fetching student with id ${id}.`)
        }
    }

    static async getStudentCourses(id) {
        try {
            const courses = await client.query(
                `SELECT course_id, sec_id, semester, year, title, dept_name, credits, grade, time_slot_id 
                    FROM course NATURAL JOIN section NATURAL JOIN takes WHERE id = '${id}'`
            )
            return courses.rows
        } catch (error) {
            throw Error(`Error fetching course details for student with id ${id}.`)
        }
    }
}
