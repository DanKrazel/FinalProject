import http from "../http-common";

class StudentDataService {
    getAll(page = 0) {
        return http.get(`?page=${page}`);
    }
    
    get(id) {
        return http.get(`?id=${id}`);
    }
    
    find(query, by = "student_id", page = 0) {
        return http.get(`?${by}=${query}&page=${page}`);
    } 

    createStudent(data) {
        return http.post("/student-new", data);
    }

    findStudent(id){
        return http.get(`/${id}`);
    }
    
    updateStudent(data) {
        return http.put("/student-edit", data);
    }
    
    deleteStudent(id, userId) {
        return http.delete(`/student-delete?id=${id}`, {data:{user_id: userId}});
    }
    
    getNames(id) {
        return http.get(`/names`);
    }
    
}
    
    export default new StudentDataService();
