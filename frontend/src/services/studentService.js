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
        return http.get(`getCoursesStudent/${id}`);
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

    updateUnitStudent(data) {
        return http.put("/updateUnitStudent", data);
    }
    updateAverageStudent(data) {
        return http.put("/updateAverageStudent", data);
    }
    resetAverageStudent(data) {
        return http.put("/resetAverageStudent", data);
    }
    
    
    findUnitsBySemester(query, by = "studentID") {
        return http.get(`unitsBySemester?${by}=${query}`);
    } 

    uploadStudents(data){
        return http.post('/uploadStudents',data)
    }

    deleteAllStudents(){
        return http.delete('/deleteAllStudents')
    }
}
    
    export default new StudentDataService();
