import http from "../http-common";
import authHeader from './auth-header';

class DependenciesDataService {
    get(id) {
        return http.get(`dependencies?id=${id}`);
    }

    postDependency(data) {
        return http.post("/dependencies", data);
    }
    
    getAll(page = 0) {
        return http.get(`dependencies?page=${page}`);
    }
    
    
}

export default new DependenciesDataService();
