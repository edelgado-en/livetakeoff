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