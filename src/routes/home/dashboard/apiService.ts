import httpService from "../../../services/httpService";


export const searchTailStats = (data: any, currentPage: Number) => {
    return httpService.post(`/api/tail-stats?page=${currentPage}&size=${20}`, data);
}

export const getTailStatsDetails = (tailNumber: string) => {
    return httpService.get(`/api/tail-stats/${tailNumber}/`);
}