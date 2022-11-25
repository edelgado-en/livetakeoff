import httpService from "../../services/httpService";


export const getJobEstimateFormInfo = () => {
    return httpService.get('/api/estimates/form-info')
}

export const createEstimate = (data: any) => {
    return httpService.post('/api/estimates/create', data)
}

export const searchEstimates = (data: any) => {
    return httpService.post('/api/estimates', data)
}

export const getEstimateDetail = (id: any) => {
    return httpService.get(`/api/estimates/details/${id}`)
}

export const updateEstimate = (id: any, data: any) => {
    return httpService.post(`/api/estimates/details/${id}/`, data)
}