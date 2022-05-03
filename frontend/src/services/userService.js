import http from "../http-common";
import authHeader from './auth-header';

class UserDataService {
    getAll(page = 0) {
        return http.get(`user?page=${page}`);
    }
    
    get(id) {
        return http.get(`user?id=${id}`);
    }
    
    find(query, by, page = 0) {
        return http.get(`user?${by}=${query}&page=${page}`);
    } 

    createUser(data) {
        return http.post("/user-new", data);
    }
    
    updateUser(data) {
        return http.put("/user-edit", data);
    }

    deleteUser(userId) {
        return http.delete(`/user?id=${userId}`);
    }

    getAdminBoard(){
        return http.get('/admin', { headers: authHeader() });
    }
    
    getSecretariatBoard(){
        return http.get('/secretariat', { headers: authHeader() });
    }

    getProfessorBoard(){
        return http.get('/professor', { headers: authHeader() });
    }
    

}
     
    export default new UserDataService();
