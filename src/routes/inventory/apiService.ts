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
    return httpService.post(`/inventory/items/list?page=${currentPage}&size=${200}`, data);
}