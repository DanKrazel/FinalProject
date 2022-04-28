import http from "../http-common";

class CourseDataService {
    getAll(page = 0) {
        return http.get(`course?page=${page}`);
    }
    
    get(id) {
        return http.get(`course?id=${id}`);
    }
    
    find(query, by = "studentID") {
        return http.get(`course?${by}=${query}`);
    } 

    createCourse(data) {
        return http.post("/course", data);
    }

    findCourse(id){
        return http.get(`/${id}`);
    }
    
    uploadCourses(data, id){
        return http.post(`/uploadCourses/${id}`, data);
    }

    uploadCoursesAllStudents(data){
        return http.post('/uploadCoursesAllStudents', data);
    }

    // uploadFile(data, id){
    //     return http.post(`/uploadFile/${id}`, data);
    // }

    updateCourse(data) {
        return http.put("/course-edit", data);
    }
    
    deleteCourse(id, userId) {
        return http.delete(`/course-delete?id=${id}`, {data:{user_id: userId}});
    }

    deleteCourseByStudentID(id) {
        return http.delete(`/course/${id}`)
    }
    
    getNames(id) {
        return http.get(`/names`);
    }

    deleteAllCourses(){
        return http.delete('/deleteAllCourses')
    }
 
    
}
    
    export default new CourseDataService();
