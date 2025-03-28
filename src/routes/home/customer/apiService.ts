import httpService from "../../../services/httpService";


export const searchJobs = (data: any) => {
    return httpService.post(`/api/jobs?page=${1}&size=${100}`, data)
}

export const getJobActivities = () => {
    return httpService.get('/api/customers/activities?page=1&size=14')
}

export const getAirports = (request: any) => {
    return httpService.post(`/api/airports`, request);
}

export const sendPremiumRequest = (data: any) => {
    return httpService.post(`/api/premium/contact`, data)
}

export const getTags = () => {
    return httpService.get('/api/tags');
}

export const getCustomers = (request: any) => {
    return httpService.post('/api/customers', request);
}