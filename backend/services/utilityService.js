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

    static groupCoursesByDepartment(courses) {
        return courses.reduce((departments, course) => {
            if (!departments.map((department) => department.dept_name).includes(course.dept_name)) {
                departments.push({
                    dept_name: course.dept_name,
                    building: course.building,
                    courses: []
                })
            }
            departments
                .find((department) => department.dept_name == course.dept_name)
                .courses.push({
                    course_id: course.course_id,
                    title: course.title,
                    credits: course.credits
                })
            return departments
        }, [])
    }

    static filterByRunningSemester(data, runningSemester) {
        return {
            running: data.filter((element) => element.year == runningSemester.year && element.semester == runningSemester.semester),
            notRunning: data.filter((element) => !(element.year == runningSemester.year && element.semester == runningSemester.semester))
        }
    }

    static groupCoursesByYearSemester(courses) {
        const groupedCourses = courses.reduce((group, course) => {
            if (!group[course.year]) group[course.year] = {}
            if (!group[course.year][course.semester]) group[course.year][course.semester] = []
            group[course.year][course.semester].push(course)
            return group
        }, {})

        const sortedSemester = {
            Fall: 0,
            Spring: 1
        }

        return Object.entries(groupedCourses)
            .map(([year, semesterCourses]) => [
                year,
                Object.entries(semesterCourses)
                    .sort((a, b) => sortedSemester[a[0]] - sortedSemester[b[0]])
                    .reverse()
            ])
            .sort((a, b) => sortedSemester[a[0]] - sortedSemester[b[0]])
            .reverse()
    }
}
