import httpService from "../../services/httpService";

export const searchAirports = (data: any, currentPage: any) => {
    return httpService.post(`/api/airports?page=${currentPage}&size=${200}`, data);
}

export const applyFeeChanges = (data: any) => {
    return httpService.post('/api/apply-fee-changes', data);
}