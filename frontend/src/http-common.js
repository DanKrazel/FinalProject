import axios from "axios";
import TokenService from "../src/services/tokenService"

const instance = axios.create({
  baseURL: "https://final-project-visualization.herokuapp.com/",
  headers: {
    "Content-type": "application/json"
  }
});

instance.interceptors.request.use(
  (config) => {
    const token = TokenService.getLocalAccessToken();
    if (token) {
      config.headers["x-access-token"] = token; // for Node.js Express back-end
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
instance.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    const originalConfig = err.config;
    if (originalConfig.url !== "/login" && err.response) {
      // Access Token was expired
      if (err.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;
        try {
          const rs = await instance.post("/refreshtoken", {
            refreshToken: TokenService.getLocalRefreshToken(),
          });
          console.log('rs', rs)
          const accessToken  = rs.data.accessToken;
          console.log('new access token', accessToken)
          TokenService.updateLocalAccessToken(accessToken);
          return instance(originalConfig);
        } catch (_error) {
          return Promise.reject(_error);
        }
      }
    }
    return Promise.reject(err);
  }
);
export default instance;