import httpService from "../../services/httpService";

export const getJobDetails = (id: number) => {
    return httpService.get(`/api/shared/jobs/${id}`);
}

export const sendMessage = (data: any) => {
    return httpService.post(`/api/shared/contact`, data);
}