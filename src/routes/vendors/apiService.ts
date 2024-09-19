import httpService from "../../services/httpService";

export const getVendors = (data: any) => {
    return httpService.post('/api/vendors', data);
}

export const getVendorDetails = (id: number) => {
    return httpService.get(`/api/vendors/${id}`);
}

export const createVendor = (formData: any) => {
    return httpService.post('/api/vendors/create', formData,  {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })
}

export const editVendor = (id: number, request: any) => {
    return httpService.patch(`/api/vendors/${id}/`, request)
}