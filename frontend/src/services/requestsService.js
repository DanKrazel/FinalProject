import http from "../http-common";
import authHeader from './auth-header';

class RequestDataService {
   
    
    get(id) {
        return http.get(`requests?id=${id}`);
    }
    
    getAll(page = 0) {
        return http.get(`requests?page=${page}`);
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
        return http.get('/retrieveInfoByRequest')
    }

    deleteAllRequests(){
        return http.delete('/deleteAllRequests')
    }
}
     
    export default new RequestDataService();
