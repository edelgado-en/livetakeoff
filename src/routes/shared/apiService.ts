import httpService from "../../services/httpService";

export const getJobDetails = (encoded_id: any) => {
    return httpService.get(`/api/shared/jobs/${encoded_id}`);
}

export const confirmJob = (encoded_id: any, data: any) => {
    return httpService.post(`/api/shared/jobs/confirm/${encoded_id}/`, data);
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