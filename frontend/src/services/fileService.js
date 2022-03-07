import http from "../http-common";

class FileDataService {

    uploadFile(data, id){
        return http.post(`/uploadFile/${id}`, data);
    }


    getFile(id){
        return http.get(`/uploadFile?id=${id}`);
    }
}
    
export default new FileDataService();
