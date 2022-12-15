import httpService from "../../services/httpService";

export const searchUsers = (data: any) => {
    return httpService.post('/api/users', data);
}

export const getUserDetails = (id: number) => {
    return httpService.get(`/api/users/${id}`);
}

export const getAirports = (request: any) => {
    return httpService.post(`/api/airports`, request);
}