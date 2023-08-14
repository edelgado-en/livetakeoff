import httpService from "../../services/httpService";

export const getItemFormInfo = () => {
    return httpService.get('/inventory/items/form-info')
}

export const createItem = (formData: any) => {
    return httpService.post('/inventory/items/create', formData,  {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })
}

export const getItems = (data: any, currentPage: Number) => {
    return httpService.post(`/inventory/items/list?page=${currentPage}&size=${100}`, data);
}

export const getItemLookup = (name: string) => {
    return httpService.get(`/inventory/items/${name}/`);
}

export const getLocations = (data: any) => {
    return httpService.post('/inventory/locations/list', data);
}

export const updateLocationItem = (id: number, data: any) => {
    return httpService.patch(`/inventory/location-items/${id}/`, data);
}

export const getUserDetails = () => {
    return httpService.get('/api/users/me');
}

export const createProvider = (data: any) => {
    return httpService.post('/inventory/provider', data);
}

export const createLocation = (data: any) => {
    return httpService.post('/inventory/location', data);
}

