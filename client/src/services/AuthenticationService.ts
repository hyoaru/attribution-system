import { AxiosInstance } from "./AxiosInstance";

type SignInParams = {
    email: string;
    password: string;
};

type RegisterParams = {
    email: string;
    password: string;
    name: string;
};

class AuthenticationService {
    static signIn = async (params: SignInParams) => {
        return await AxiosInstance.post("/authentication/sign-in", {
            email: params.email,
            password: params.password,
        }).then((response) => {
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("userId", response.data.record.id);
            return response.data;
        });
    };

    static signOut = () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    static register = async (params: RegisterParams) => {
        return await AxiosInstance.post("/authentication/register", {
            email: params.email,
            password: params.password,
            name: params.name,
        }).then((response) => response.data);
    };

    static fetchUser = async (params: SignInParams) => {
        return await AxiosInstance.post("/authentication/users", {
            email: params.email,
            password: params.password,
        }).then((response) => response.data);
    };

    static isAdmin = async (id: string) => {
        return await AxiosInstance.post("/authentication/isAdmin", {
            id : id,
        }).then((response) => response.data);
    };
}

export default AuthenticationService;