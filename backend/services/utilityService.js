import { sortedSemester } from '../constants.js'

export default class UtilityService {
    static groupSectionsByCourse(sections) {
        return sections.reduce((courses, section) => {
            if (!courses.map((course) => course.course_id).includes(section.course_id)) {
                courses.push({
                    course_id: section.course_id,
                    title: section.title,
                    dept_name: section.dept_name,
                    credits: section.credits,
                    sections: []
                })
            }
            section.sec_id &&
                courses
                    .find((course) => course.course_id == section.course_id)
                    .sections.push({
                        sec_id: section.sec_id,
                        time_slot_id: section.time_slot_id,
                        year: section.year,
                        semester: section.semester,
                        building: section.building,
                        room_number: section.room_number
                    })
            return courses
        }, [])
    }

    static filterByRunningSemester(data, runningSemester) {
        return {
            running: data.filter((element) => element.year == runningSemester?.year && element.semester == runningSemester?.semester),
            notRunning: data.filter((element) => !(element.year == runningSemester?.year && element.semester == runningSemester?.semester))
        }
    }

    static groupCoursesByYearSemester(courses) {
        const groupedCourses = courses.reduce((group, course) => {
            if (!group[course.year]) group[course.year] = {}
            if (!group[course.year][course.semester]) group[course.year][course.semester] = []
            group[course.year][course.semester].push(course)
            return group
        }, {})

        return Object.entries(groupedCourses)
            .map(([year, semesterCourses]) => [
                year,
                Object.entries(semesterCourses)
                    .sort((a, b) => sortedSemester[a[0]] - sortedSemester[b[0]])
                    .reverse()
            ])
            .sort((a, b) => Number(a[0]) - Number(b[0]))
            .reverse()
    }
}
