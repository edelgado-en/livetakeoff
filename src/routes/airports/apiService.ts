import httpService from "../../services/httpService";

export const searchAirports = (data: any) => {
    return httpService.post(`/api/airports`, data);
}

export const searchFbos = (data: any) => {
    return httpService.post(`/api/fbo-search`, data);
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