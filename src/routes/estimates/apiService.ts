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

export const getCustomerRetainerServices = (id: number) => {
    return httpService.get(`/api/customers/retainers-services/${id}/`);
}

export const getEstimateDetail = (id: any) => {
    return httpService.get(`/api/estimates/details/${id}`)
}

export const deleteEstimate = (id: number) => {
    return httpService.delete(`/api/estimates/${id}/`);
}

export const searchFbos = (data: any) => {
    return httpService.post(`/api/fbo-search`, data);
}

export const getCustomers = (request: any) => {
    return httpService.post('/api/customers', request);
}

export const searchAirports = (data: any) => {
    return httpService.post(`/api/airports`, data);
}

export const searchAircraftTypes = (request: any) => {
    return httpService.post('/api/aircraft-types', request);
}