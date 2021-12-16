import http from "../http-common";

class CourseDataService {
    getAll(page = 0) {
        return http.get(`?page=${page}`);
    }
    
    get(id) {
        return http.get(`?id=${id}`);
    }
    
    find(query, by = "student_id", page = 0) {
        return http.get(`?${by}=${query}&page=${page}`);
    } 

    createCourse(data) {
        return http.post("/course-new", data);
    }

    findCourse(id){
        return http.get(`/${id}`);
    }
    
    updateCourse(data) {
        return http.put("/course-edit", data);
    }
    
    deleteCourse(id, userId) {
        return http.delete(`/course-delete?id=${id}`, {data:{user_id: userId}});
    }
    
    getNames(id) {
        return http.get(`/names`);
    }
    
}
    
    export default new CourseDataService();
