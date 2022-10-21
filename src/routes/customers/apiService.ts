import httpService from "../../services/httpService";

export const getCustomers = (request: any) => {
    return httpService.post('/api/customers', request);
}

export const getCustomerDetails = (id: number) => {
    return httpService.get(`/api/customers/${id}`);
}