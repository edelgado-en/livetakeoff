import httpService from "../../services/httpService";

export const searchAirports = (data: any, currentPage: Number) => {
    return httpService.post(`/api/airports?page=${currentPage}&size=${200}`, data);
}

export const searchFbos = (data: any) => {
    return httpService.post(`/api/fbo-search`, data);
}

export const createFBO = (data: any) => {
    return httpService.post(`/api/fbos/create`, data);
}

export const getAirportDetails = (id: number) => {
    return httpService.get(`/api/airports/${id}/`);
}

export const updateAirportAvailableFbo = (data: any) => {
    return httpService.post(`/api/airports/available-fbos`, data);
}

export const getAirportAvailableFbos = (id: number) => {
    return httpService.get(`/api/airports/available-fbos/${id}/`);
}

export const createAirport = (data: any) => {
    return httpService.post(`/api/airports/create`, data);
}

export  const getAirportAvailableUsers = (id: number) => {
    return httpService.get(`/api/airports/available-users/${id}/`);
}

export const getVendors = (data: any) => {
    return httpService.post('/api/vendors', data);
}

export const searchUsers = (data: any) => {
    return httpService.post('/api/users', data);
}

export const addAirportAvailableUser = (data: any) => {
    return httpService.post(`/api/airports/available-users`, data);
}

export const togglePreferredProjectManager = (data: any) => {
    return httpService.patch(`/api/airports/available-users`, data)
}

export const removeAirportAvailableUser = (data: any) => {
    return httpService.post(`/api/airports/remove-available-users`, data);
}