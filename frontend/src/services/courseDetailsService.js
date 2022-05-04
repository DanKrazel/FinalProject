import http from "../http-common";

class CourseDetailsDataService {
    getAll(page = 0) {
        return http.get(`courseDetails?page=${page}`);
    }
    
    get(id) {
        return http.get(`courseDetails?id=${id}`);
    }
    
    find(query, by) {
        return http.get(`courseDetails?${by}=${query}`);
    } 

    createCourse(data) {
        return http.post("/courseDetails", data);
    }

    uploadDetailsCourses(data){
        return http.post('/uploadDetailsCourses', data);
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

    deleteAllCoursesDetails(){
        return http.delete('/deleteAllCoursesDetails')
    }
 
    
}
    
    export default new CourseDetailsDataService();
