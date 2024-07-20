import httpService from "../../services/httpService";

export const searchHelpFiles = (data: any, currentPage: Number) => {
    return httpService.post(`/api/help-files?page=${currentPage}&size=${50}`, data);
}

export const deleteHelpFile = (id: number) => {
    return httpService.delete(`/api/help-file/${id}/`);
}

export const editHelpFile = (id: number, formData: any) => {
    return httpService.patch(`/api/help-file/${id}/`, formData,  {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })
}

export const createHelpFile = (formData: any) => {
    return httpService.post(`/api/help-file/create`, formData,  {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })
}