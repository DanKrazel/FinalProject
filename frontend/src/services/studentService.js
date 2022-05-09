import instance from "../http-common";

class StudentDataService {
    getAll(page = 0) {
        return instance.get(`?page=${page}`);
    }
    
    get(id) {
        return instance.get(`?id=${id}`);
    }
    
    find(query, by = "student_id", page = 0) {
        return instance.get(`?${by}=${query}&page=${page}`);
    } 

    createStudent(data) {
        return instance.post("/student-new", data);
    }

    findStudent(id){
        return instance.get(`getCoursesStudent/${id}`);
    }

    getCoursesByStudentName(name){
        return instance.get(`getCoursesByStudentName?name=${name}`);
    }
    
    
    updateStudent(data) {
        return instance.put("/student-edit", data);
    }
    
    deleteStudent(id, userId) {
        return instance.delete(`/student-delete?id=${id}`, {data:{user_id: userId}});
    }
    
    getNames(id) {
        return instance.get(`/names`);
    }

    updateUnitStudent(data) {
        return instance.put("/updateUnitStudent", data);
    }
    updateAverageStudent(data) {
        return instance.put("/updateAverageStudent", data);
    }
    resetAverageStudent(data) {
        return instance.put("/resetAverageStudent", data);
    }
    
    
    findUnitsBySemester(query, by = "studentID") {
        return instance.get(`unitsBySemester?${by}=${query}`);
    } 

    uploadStudents(data){
        return instance.post('/uploadStudents',data)
    }

    deleteAllStudents(){
        return instance.delete('/deleteAllStudents')
    }
}
    
    export default new StudentDataService();
