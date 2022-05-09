import instance from "../http-common";
import TokenService from "./tokenService"

class AuthService {

    signUp(data) {
        return instance.post('/signup', data)
    }

    async login(data) {
        const response = await instance.post('/login', data);
        console.log('responseLogin', response)
        if (response.data.accessToken) {
            TokenService.setUser(response.data);
        }
        return response.data;
    }

    logout() {
        TokenService.removeUser();
    }

    getCurrentUser() {
        return TokenService.getUser()    
    }
}

export default new AuthService();