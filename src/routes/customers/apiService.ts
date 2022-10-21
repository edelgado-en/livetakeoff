import httpService from "../../services/httpService";

export const getCustomers = (request: any) => {
    return httpService.post('/api/customers', request);
}