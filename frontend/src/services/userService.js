import instance from "../http-common";
import authHeader from './auth-header';

class UserDataService {
    getAll(page = 0) {
        return instance.get(`user?page=${page}`);
    }
    
    get(id) {
        return instance.get(`user?id=${id}`);
    }
    
    find(query, by, page = 0) {
        return instance.get(`user?${by}=${query}&page=${page}`);
    } 

    createUser(data) {
        return instance.post("/user-new", data);
    }
    
    updateUser(data) {
        return instance.put("/user-edit", data);
    }

    deleteUser(userId) {
        return instance.delete(`/user?id=${userId}`);
    }

    getAdminBoard(){
        return instance.get('/admin');
    }
    
    getSecretariatBoard(){
        return instance.get('/secretariat');
    }

    // getProfessorBoard(){
    //     return http.get('/professor', { headers: authHeader() });
    // }
    getProfessorBoard(){
        return instance.get('/professor');
    }

}
     
    export default new UserDataService();
