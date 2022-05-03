import http from "../http-common";
import authHeader from './auth-header';

class DependenciesDataService {
    get(id) {
        return http.get(`dependencies?id=${id}`);
    }
    
    postRequest(data) {
        return http.post("/dependencies", data);
    }
}

export default new DependenciesDataService();
