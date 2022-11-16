import httpService from "../../services/httpService";

export const signup = (data: any) => {
    return httpService.post("/api/users/signup", data);
}
