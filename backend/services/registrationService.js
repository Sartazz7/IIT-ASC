import { client } from '../models/db.js'
import CourseService from './courseService.js'

export default class RegistrationService {
    static async checkPrereq(id, courseId) {
        try {
            const coursesLeft = await client.query(
                `(SELECT prereq_id FROM prereq WHERE course_id='${courseId}') EXCEPT 
                (SELECT course_id FROM takes WHERE id = '${id}' AND grade != 'F')`
            )
            return coursesLeft.rowCount == 0 ? true : false
        } catch (error) {
            throw Error(`Error checking prereq for student id ${id}.`)
        }
    }

    static async checkSlotClash(id, section) {
        try {
            const matchedSlots = await client.query(
                `(SELECT DISTINCT time_slot_id FROM takes NATURAL JOIN section 
                    WHERE year = '${section.year}' AND semester = '${section.semester}' AND id = '${id}') INTERSECT 
                (SELECT time_slot_id FROM section WHERE course_id = '${section.course_id}' AND sec_id = '${section.sec_id}' 
                    AND year = '${section.year}' AND semester = '${section.semester}')`
            )
            return matchedSlots.rowCount == 0 ? true : false
        } catch (error) {
            throw Error(`Error checking slot clashes for student id ${id}.`)
        }
    }

    static async sectionRegister(id, section) {
        try {
            await client.query(
                `INSERT INTO takes VALUES ('${id}', '${section.course_id}', '${section.sec_id}', '${section.semester}', '${section.year}', null)`
            )
            return true
        } catch (error) {
            throw Error(`Error registering on section ${section} by id ${id}.`)
        }
    }

    static async sectionDrop(id, section) {
        try {
            await client.query(
                `DELETE FROM takes WHERE id = '${id}' AND course_id = '${section.course_id}' AND sec_id = '${section.sec_id}' 
                    AND semester = '${section.semester}' AND year = '${section.year}'`
            )
            return true
        } catch (error) {
            throw Error(`Error dropping section ${section} by id ${id}.`)
        }
    }
}
