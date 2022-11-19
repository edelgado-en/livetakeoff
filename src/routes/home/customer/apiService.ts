import httpService from "../../../services/httpService";


export const searchJobs = (data: any) => {
    return httpService.post(`/api/jobs?page=${1}&size=${10}`, data)
}

export const getJobActivities = () => {
    return httpService.get('/api/customers/activities?page=1&size=12')
}

export const getAirports = () => {
    return httpService.get(`/api/airports`);
}