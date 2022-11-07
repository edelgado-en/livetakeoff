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