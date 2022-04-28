import http from "../http-common";
import authHeader from './auth-header';

class RequestDataService {
    getAll(page = 0) {
        return http.get(`requests?page=${page}`);
    }
    
    get(id) {
        return http.get(`requests?id=${id}`);
    }
    
    find(query, by, page = 0) {
        return http.get(`requests?${by}=${query}&page=${page}`);
    } 

    postRequest(data) {
        return http.post("/requests", data);
    }
    
    updateRequest(data) {
        return http.put("/user-edit", data);
    }

    deleteRequest(requestID) {
        return http.delete(`/requests?id=${requestID}`);
    }

    getRequestSent(data) {
        return http.get('/requestSent',data)
    }

    retrieveStudentByRequest() {
        return http.get('/retrievInfoByRequest')
    }

    deleteAllRequests(){
        return http.delete('/deleteAllRequests')
    }
}
     
    export default new RequestDataService();
