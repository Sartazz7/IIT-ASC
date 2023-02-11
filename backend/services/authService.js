import bcrypt from 'bcrypt'

import { SALT_ROUNDS } from '../constants.js'
import { client } from '../models/db.js'

export default class AuthService {
    static async getUserById(id) {
        try {
            const user = await client.query(`SELECT id FROM user_password WHERE id = '${id}'`)
            return user.rowCount > 0 ? user.rows[0] : null
        } catch (error) {
            throw Error(`Error fetching user with id ${id}.`)
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
            if(!user.rowCount)  throw Error('User not found')
            if (!(await bcrypt.compare(password, user.rows[0].hashed_password))) {
                throw Error()
            }
            return true
        } catch (error) {
            throw Error('Invalid username or password.')
        }
    }
}
