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

export const uploadFile = (vendorId: number, formData: any) => {
    if (vendorId) {
        return httpService.post(`/api/vendor-files/upload/${vendorId}/`, formData,  {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })

    } else {
        return httpService.post('/api/vendor-files/upload', formData,  {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })
    }

}

export const deleteVendorFile = (fileId: number) => {
    return httpService.delete(`/api/vendor-files/${fileId}/`);
}

export const getVendorFiles = (vendorId: number) => {
    if (vendorId) {
        return httpService.get(`/api/vendor-files/${vendorId}/`);

    } else {
        return httpService.get('/api/vendor-files')
    }

}