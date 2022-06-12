import http from "../http-common";
import authHeader from './auth-header';

class ImageVisualizationDataService {
   
    
    get(id) {
        return http.get(`imageVisualization?id=${id}`);
    }
    
    getAll(page = 0) {
        return http.get(`imageVisualization?page=${page}`);
    }

    find(query, by, page = 0) {
        return http.get(`imageVisualization?${by}=${query}&page=${page}`);
    } 

    postImageVisualization(data) {
        return http.post("/imageVisualization", data);
    }
    
    updateRequest(data) {
        return http.put("/user-edit", data);
    }

    deleteImageVisualisation(id) {
        return http.delete(`/imageVisualization?id=${id}`);
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
     
    export default new ImageVisualizationDataService();
