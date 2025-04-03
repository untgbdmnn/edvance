import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import useAuthStore from "./authStore";

const responseBody = (response: AxiosResponse) => {
    response.data.statusCode = response.data;
    return response.data;
}

const instance: AxiosInstance = axios.create({
    baseURL: 'http://localhost:3000/api/',
    headers: {
        'Content-Type': 'application/json'
    }
});

instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const { token, user } = useAuthStore.getState()
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        if (config.data instanceof FormData) {
            delete config.headers['Content-Type'];
        } else {
            config.headers['Content-Type'] = 'application/json;charset=UTF=8'
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

const GET = async (url: string, config?: object) => {
    const response = await instance.get(url, config);
    return responseBody(response);
};

const POST = async (url: string, data: object, config?: object) => {
    const response = await instance.post(url, data, config);
    return responseBody(response);
};

const PUT = async (url: string, data: object, config?: object) => {
    const response = await instance.put(url, data, config);
    return responseBody(response);
};

const PATCH = async (url: string, data: object, config?: object) => {
    const response = await instance.patch(url, data, config);
    return responseBody(response);
};

const DELETE = async (url: string, config?: object) => {
    const response = await instance.delete(url, config);
    return responseBody(response);
};
const fetchData = { GET, POST, PUT, PATCH, DELETE };
export default fetchData;