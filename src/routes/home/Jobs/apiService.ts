import httpService from "../../../services/httpService";


export const getJobs = () => {
    return httpService.get('/api/jobs');
}

export const getCurrentUser = () => {
    return httpService.get('users/me')
}

export const testSendEmail = () => {
    return httpService.get('/api/email/send')
}