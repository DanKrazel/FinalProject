import http from "../http-common";

class FileDataService {



    uploadPDF(data){
        return http.post(`/uploadPDF`, data);
    }


    getFile(id){
        return http.get(`/uploadFile?id=${id}`);
    }
}
    
export default new FileDataService();
