import httpService from "../../services/httpService";

export const searchUsers = (data: any) => {
    return httpService.post('/api/users', data);
}

export const getUserDetails = (id: number) => {
    return httpService.get(`/api/users/${id}/`);
}

export const getAirports = (request: any) => {
    return httpService.post(`/api/airports`, request);
}

export const getUserAvailableAirports = (id: number) => {
    return httpService.get(`/api/users/available-airports/${id}/`);
}

export const addUserAvailableAirport = (request: any) => {
    return httpService.post(`/api/users/available-airports`, request);
}

export const deleteUserAvailableAirport = (request: any) => {
    return httpService.delete(`/api/users/available-airports`, request);
}