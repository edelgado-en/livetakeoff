import httpService from "../../../services/httpService";


export const searchTailStats = (data: any, currentPage: Number) => {
    return httpService.post(`/api/tail-stats?page=${currentPage}&size=${100}`, data);
}

export const getTailStatsDetails = (tailNumber: string) => {
    return httpService.get(`/api/tail-stats/${tailNumber}/`);
}

export const getServicesByAirport = () => {
    return httpService.get('/api/services-by-airport')
}

export const getServices = () => {
    return httpService.post('/api/services', {});
}

export const getRetainerServices = () => {
    return httpService.post('/api/retainer-services', {});
}

export const searchRetainerCustomers = (data: any, currentPage: Number) => {
    return httpService.post(`/api/customers/retainers?page=${currentPage}&size=${100}`, data);
} 

export const getTeamProductivityStats = (data: any) => {
    return httpService.post('/api/team-productivity', data)
}

export const getUsersProductivityStats = (data: any) => {
    return httpService.post('/api/users-productivity', data)
}

export const getUserProductivityStats = (id: number, data: any) => {
    return httpService.post(`/api/user-productivity/${id}/`, data)
}

export const generateServiceReport = (data: any) => {
    return httpService.post('/api/service-report', data)
}

export const generateRetainerServiceReport = (data: any) => {
    return httpService.post('/api/retainer-service-report', data)
}

export const searchServiceActivities = (data: any, currentPage: Number) => {
    return httpService.post(`/api/service-activities?page=${currentPage}&size=${200}`, data);
}

export const searchRetainerServiceActivities = (data: any, currentPage: Number) => {
    return httpService.post(`/api/retainer-service-activities?page=${currentPage}&size=${200}`, data);
}

export const getCustomers = (request: any) => {
    return httpService.post('/api/customers', request);
}

export const getAirports = () => {
    return httpService.post('/api/airports', { name: '' });
}

export const getFbos = () => {
    return httpService.get(`/api/fbos`);
}

export const searchFbos = (data: any) => {
    return httpService.post(`/api/fbo-search`, data);
}