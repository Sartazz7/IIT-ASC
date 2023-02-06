import bcrypt from 'bcrypt'

import { SALT_ROUNDS } from '../constants.js'
import { client } from '../models/db.js'

export default class StudentService {
    static async getUserById(id) {
        try {
            const user = await client.query(`SELECT id FROM user_password WHERE id = '${id}'`)
            return user.rowCount > 0 ? user.rows[0] : null
        } catch (error) {
            throw Error(`Error fetching user with id ${id}.`)
        }
    }

    static async getStudentById(id) {
        try {
            const student = await client.query(`SELECT * FROM student WHERE id = '${id}'`)
            return student.rowCount > 0 ? student.rows[0] : null
        } catch (error) {
            throw Error(`Error fetching student with id ${id}.`)
        }
    }

    static async createUser(id, password) {
        const salt = await bcrypt.genSalt(SALT_ROUNDS)
        const hashedPassword = await bcrypt.hash(password, salt)
        try {
            await client.query(`INSERT INTO user_password VALUES ('${id}', '${hashedPassword}')`)
            return true
        } catch (error) {
            throw Error(`Error inserting user with id ${id}.`)
        }
    }

    static async checkPassword(id, password) {
        try {
            const user = await client.query(`SELECT * FROM user_password WHERE id = '${id}'`)
            if (!(await bcrypt.compare(password, user.rows[0].hashed_password))) {
                throw Error()
            }
            return true
        } catch (error) {
            throw Error('Invalid username or password.')
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
