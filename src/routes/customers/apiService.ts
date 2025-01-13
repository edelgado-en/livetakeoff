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

export const getAirports = (request:any = { name: '', open_jobs:false }) => {
    return httpService.post(`/api/airports`, request);
}

export const getServices = (data: any) => {
    return httpService.post('/api/services', data);
}

export const getRetainers = (data: any) => {
    return httpService.post('/api/retainer-services', data);
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

export const searchCustomerFollowerEmails = (data: any) => {
    return httpService.post(`/api/customers/follower-emails`, data);
}

export const addDeleteCustomerFollowerEmail = (id: number, request: any) => {
    return httpService.post(`/api/customers/follower-emails/${id}/`, request);
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

export const searchFbos = (data: any) => {
    return httpService.post(`/api/fbo-search`, data);
}

export const searchAirports = (data: any) => {
    return httpService.post(`/api/airports`, data);
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

export const getCustomerAvailableServices = (id: number) => {
    return httpService.get(`/api/customers/available-services/${id}/`);
}

export const updateCustomerAvailableService = (request: any) => {
    return httpService.post(`/api/customers/available-services`, request);
}

export const getCustomerAvailableRetainers = (id: number) => {
    return httpService.get(`/api/customers/available-retainers/${id}/`);
}

export const updateCustomerAvailableRetainer = (request: any) => {
    return httpService.post(`/api/customers/available-retainers`, request);
}