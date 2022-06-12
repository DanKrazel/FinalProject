import instance from "../http-common";
import authHeader from './auth-header';

class DependenciesDataService {
    get(id) {
        return instance.get(`dependencies?id=${id}`);
    }

    postDependency(data) {
        return instance.post("/dependencies", data);
    }
    
    getAll(page = 0) {
        return instance.get(`dependencies?page=${page}`);
    }
    
    deleteDependency(userId) {
        return instance.delete(`/dependencies?id=${userId}`);
    }
    
}

export default new DependenciesDataService();
