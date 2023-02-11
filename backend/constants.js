import fs from 'fs'

const buffer = await fs.promises.readFile('config.txt')
const envVariables = buffer
    .toString()
    .split('\n')
    .reduce((keys, vars) => ({ ...keys, [vars.split('=')[0]]: vars.split('=')[1] }), {})

export const DB_HOST = envVariables.DB_HOST
export const DB_PORT = envVariables.DB_PORT
export const DB_NAME = envVariables.DB_NAME
export const DB_USER = envVariables.DB_USER
export const DB_PASSWORD = envVariables.DB_PASSWORD
export const SESSION_SECRET = envVariables.SESSION_SECRET

export const SESSION_TIMEOUT = 1000 * 60 * 60 * 24
export const SALT_ROUNDS = 10

export const sortedSemester = {
    Fall: 0,
    Winter: 1,
    Spring: 2,
    Summer: 3
}
