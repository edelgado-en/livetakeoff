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

export const getCustomers = (request: any) => {
    return httpService.post('/api/customers', request);
}

export const getUserCustomers = (id: number) => {
    return httpService.get(`/api/users/customers/${id}/`);
}

export const getUserAvailableAirports = (id: number) => {
    return httpService.get(`/api/users/available-airports/${id}/`);
}

export const updateUserAvailableAirport = (request: any) => {
    return httpService.post(`/api/users/available-airports`, request);
}

export const updateUserCustomer = (request: any) => {
    return httpService.post(`/api/users/customers`, request);
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

export const updateUser = (id: number, request: any) => {
    return httpService.patch(`/api/users/${id}/`, request);
}

export const addNewAdditionalEmail = (request: any) => {
    return httpService.post('/api/user-email', request)
}

export const updateAdditionalEmail = (id: number, request: any) => {
    return httpService.patch(`/api/user-email/${id}/`, request)
}

export const deleteAdditionalEmail = (id: number) => {
    return httpService.delete(`/api/user-email/${id}/`)
}

