import httpService from "../../../services/httpService";


export const testApi = () => {
    //IMPORTANT: you need to finish your a slash when you finish with a number like /test-reports/1/
    return httpService.get('/api/jobs');
}

export const getCurrentUser = () => {
    return httpService.get('users/me')
}

export const testSendEmail = () => {
    return httpService.get('/api/email/send')
}