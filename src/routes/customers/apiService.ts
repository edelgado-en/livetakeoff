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

export const getAirports = () => {
    return httpService.get(`/api/airports`);
}

export const getServices = () => {
    return httpService.get(`/api/services`);
}

export const getFbos = () => {
    return httpService.get(`/api/fbos`);
}

export const getPriceList = () => {
    return httpService.get(`/api/pricing-plans`);
}

export const getCustomerUsers = () => {
    return httpService.get(`/api/customers/users`);
}

export const addDiscount = (id: number, request: any) => {
    return httpService.post(`/api/customers/discounts/${id}/`, request);
}

export const deleteDiscount = (id: number) => {
    return httpService.delete(`/api/customers/discounts/${id}/`);
}

export const getDiscount = (id: number) => {
    return httpService.get(`/api/customers/discounts/update/${id}/`);
}

export const updateDiscount = (id: number, request: any) => {
    return httpService.patch(`/api/customers/discounts/update/${id}/`, request);
}

export const getCustomerFees = (id: number) => {
    return httpService.get(`/api/customers/fees/${id}`);
}

export const deleteFee = (id: number) => {
    return httpService.delete(`/api/customers/fees/${id}/`);
}

export const addFee = (id: number, request: any) => {
    return httpService.post(`/api/customers/fees/${id}/`, request);
}

export const getFee = (id: number) => {
    return httpService.get(`/api/customers/fees/update/${id}/`);
}

export const updateFee = (id: number, request: any) => {
    return httpService.patch(`/api/customers/fees/update/${id}/`, request);
}

export const createCustomer = (formData: any) => {
    return httpService.post('/api/customers/create', formData,  {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })
}

export const editCustomer = (id: number, request: any) => {
    return httpService.patch(`/api/customers/${id}/`, request)
}