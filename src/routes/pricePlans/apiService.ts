import httpService from "../../services/httpService";


export const getAircraftTypes = (request: any) => {
    return httpService.post('/api/aircraft-types', request);
}

export const getPricingPlans = () => {
    return httpService.get('/api/pricing-plans');
}

export const createPricingPlan = (request: any) => {
    return httpService.post('/api/pricing-plans', request)
}

export const deletePricePlan = (id: number) => {
    return httpService.delete(`/api/pricing-plans/${id}/`)
}

export const editPricePlan = (id: number, request: any) => {
    return httpService.patch(`/api/pricing-plans/${id}/`, request)
}

export const getPriceListing = (id: number) => {
    return httpService.get(`/api/price-listing/${id}/`);
}

export const getPriceListingByService = (id: number) => {
    return httpService.get(`/api/price-listing-by-service/${id}/`);
}

export const updatePricePlan = (id: number, request: any) => {
    return httpService.post(`/api/price-listing/${id}/`, request);
}

export const updatePricePlanByService = (id: number, request: any) => {
    return httpService.post(`/api/price-listing-by-service/${id}/`, request);
}

export const exportPriceList = (request: any) => {
    return httpService.post('/api/price-listing/export', request);
}

export const getServices = (data: any) => {
    return httpService.post('/api/services', data);
}