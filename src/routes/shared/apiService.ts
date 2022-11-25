import httpService from "../../services/httpService";

export const getJobDetails = (id: number) => {
    return httpService.get(`/api/shared/jobs/${id}`);
}

export const sendMessage = (data: any) => {
    return httpService.post(`/api/shared/contact`, data);
}

export const getEstimateDetail = (encodedId: any) => {
    return httpService.get(`/api/shared/estimates/${encodedId}`)
}

export const updateEstimate = (encodedId: any, data: any) => {
    return httpService.post(`/api/shared/estimates/${encodedId}/`, data)
}