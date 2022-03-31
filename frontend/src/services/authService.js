import http from "../http-common";


class AuthService {

    signUp(data) {
        return http.post('/signup', data)
    }

    login(data) {
        return http.post('/login', data)
    }

    logout() {
        localStorage.removeItem('user');
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem('user'));;
    }
}

export default new AuthService();