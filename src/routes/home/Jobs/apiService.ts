import httpService from "../../../services/httpService";


export const testApi = () => {
    //IMPORTANT: you need to finish your a slash when you finish with a number like /test-reports/1/
    return httpService.get('/api/users/me');
}