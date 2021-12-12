import http from "../http-common";


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


    checkAuthentification(data){
        return http.post("/login", data);
    }

    createUser(data) {
        return http.post("/user-new", data);
    }
    
    updateUser(data) {
        return http.put("/user-edit", data);
    }

    deleteUser(id, userId) {
        return http.delete(`/user-delete?id=${id}`, {data:{user_id: userId}});
    }

}
     
    export default new UserDataService();
