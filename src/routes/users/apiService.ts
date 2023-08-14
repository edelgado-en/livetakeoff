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

export const updateUserAvailableAirport = (request: any) => {
    return httpService.post(`/api/users/available-airports`, request);
}

export const getLocations = (data: any) => {
    return httpService.post('/inventory/locations/list', data);
}

export const getLocationsForUser = (id: number) => {
    return httpService.get(`/inventory/location-users/${id}/`);
}

export const updateUserAvailableLocation = (id: number, request: any) => {
    return httpService.post(`/inventory/location-users/${id}/`, request);
}