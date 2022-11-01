import httpService from "../../../services/httpService";


export const getJobs = (data: any) => {
    return httpService.post('/api/jobs', data);
}

export const getCurrentUser = () => {
    return httpService.get('users/me')
}

export const testSendEmail = () => {
    return httpService.get('/api/email/send')
}