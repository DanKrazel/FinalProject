import http from "../http-common";

class UnitsBySemesterDataService {

    deleteUnitsBySemesterByStudentID(id) {
        return http.delete(`/unitsBySemester/${id}`)
    }
    
    findUnitsBySemester(query, by = "studentID") {
        return http.get(`unitsBySemester?${by}=${query}`);
    } 

    
    updateUnitsBySemester(data) {
        return http.put("/unitsBySemester", data);
    }
}
    
    export default new UnitsBySemesterDataService();
