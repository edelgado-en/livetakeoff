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

export const searchRetainerCustomers = (data: any, currentPage: Number) => {
    return httpService.post(`/api/customers/retainers?page=${currentPage}&size=${100}`, data);
} 

export const getTeamProductivityStats = (data: any) => {
    return httpService.post('/api/team-productivity', data)
}