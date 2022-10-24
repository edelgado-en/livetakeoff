import httpService from "../../services/httpService";

export const getCustomers = (request: any) => {
    return httpService.post('/api/customers', request);
}

export const getCustomerDetails = (id: number) => {
    return httpService.get(`/api/customers/${id}`);
}

export const updateCustomerSetting = (id: number, request: any) => {
    return httpService.patch(`/api/customers/settings/${id}/`, request);
}

export const getCustomerDiscounts = (id: number) => {
    return httpService.get(`/api/customers/discounts/${id}`);
}