import httpService from "../../../services/httpService";

export const getJobs = (data: any, currentPage: Number) => {
    return httpService.post(`/api/jobs?page=${currentPage}&size=${50}`, data);
}

export const getCurrentUser = () => {
    return httpService.get('users/me')
}

export const testSendEmail = () => {
    return httpService.get('/api/email/send')
}

export const searchUsers = (data: any) => {
    return httpService.post('/api/users', data);
}

export const getTags = () => {
    return httpService.get('/api/tags');
}

export const getVendors = (data: any) => {
    return httpService.post('/api/vendors', data);
}

export const getVendorInsuranceCheck = (request: any) => {
    return httpService.post(`/api/vendors/insurance-check`, request)
}