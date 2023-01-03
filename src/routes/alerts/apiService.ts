import httpService from "../../services/httpService";

export const searchTailAlerts = (data: any) => {
    return httpService.post(`/api/tail-alerts`, data);
}

export const addTailAlert = (data: any) => {
    return httpService.post(`/api/create-tail-alert`, data);
}

export const deleteTailAlert = (id: number) => {
    return httpService.delete(`/api/tail-alerts/${id}/`);
}

export const updateTailAlert = (id: number, data: any) => {
    return httpService.patch(`/api/tail-alerts/${id}/`, data);
}