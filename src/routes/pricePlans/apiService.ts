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

export const getPriceListing = (id: number) => {
    return httpService.get(`/api/price-listing/${id}/`);
}

export const updatePricePlan = (id: number, request: any) => {
    return httpService.post(`/api/price-listing/${id}/`, request);
}