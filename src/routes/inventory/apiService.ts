import httpService from "../../services/httpService";

export const getItemFormInfo = () => {
    return httpService.get('/inventory/items/form-info')
}