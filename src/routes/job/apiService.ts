import httpService from "../../services/httpService";

export const getJobDetails = (id: number) => {
    return httpService.get(`/api/jobs/${id}`);
}

export const getJobBasicDetails = (id: number) => {
    return httpService.get(`/api/jobs/basic/${id}`);
}

export const updateJobStatus = (id: number, status: string) => {
    return httpService.patch(`/api/jobs/${id}/`, { status });
}

export const updateJob = (id: number, formData: any) => {
    return httpService.patch(`/api/jobs/edit/${id}/`, formData);
}

export const completeServiceAssignment = (id: number) => {
    return httpService.patch(`/api/jobs/services/${id}/`, { status: 'C' })
}

export const getAssignmentsFormInfo = (id: number) => {
    return httpService.get(`/api/jobs/services/${id}/`)
}

export const assignServices = (id: number, request: any) => {
    return httpService.put(`/api/jobs/services/${id}/`, request)
}

export const deleteService = (id: number) => {
    return httpService.delete(`/api/jobs/services/${id}/`)
}

export const deleteRetainerService = (id: number) => {
    return httpService.delete(`/api/jobs/retainer-services/${id}/`)
}

export const addService = (id:number, request: any) => {
    return httpService.post(`/api/jobs/services/${id}/`, request)
}

export const addRetainerService = (id:number, request: any) => {
    return httpService.post(`/api/jobs/retainer-services/${id}/`, request)
}

export const completeRetainerServiceAssignment = (id: number) => {
    return httpService.patch(`/api/jobs/retainer-services/${id}/`, { status: 'C' })
}

export const getJobPhotos = (jobId: number) => {
    return httpService.get(`/api/job-photos/${jobId}/`)
}

export const uploadPhotos = (jobId: number, formData: any) => {
    return httpService.post(`/api/job-photos/upload/${jobId}/`, formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })
}

export const getJobComments = (jobId: number) => {
    return httpService.get(`/api/job-comments/${jobId}/`)
}

export const createJobComment = (jobId: number, request: any) => {
    return httpService.post(`/api/job-comments/${jobId}/`, request);
}

export const deletePhotos = (jobId: number, request: any) => {
    return httpService.post(`/api/job-photos/delete/${jobId}/`, request);
}

export const getJobStats = (jobId: number) => {
    return httpService.get(`/api/jobs/stats/${jobId}/`)
}

export const getJobFormInfo = () => {
    return httpService.get('/api/jobs/form-info')
}

export const createJob = (formData: any) => {
    return httpService.post('/api/jobs/create', formData,  {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })
}

export const getServices = () => {
    return httpService.get('/api/services');
}

export const getRetainerServices = () => {
    return httpService.get('/api/retainer-services');
}


export const getCompletedJobs = (data: any, currentPage: Number) => {
    return httpService.post(`/api/jobs/completed?page=${currentPage}&size=${200}`, data)
}

export const invoiceJob = (id: number, data: any) => {
    return httpService.patch(`/api/jobs/completed/${id}/`, data)
}

export const exportJobs = (data: any) => {
    return httpService.post(`/api/jobs/export`, data)
}

export const getJobPriceBreakdown = (id: number) => {
    return httpService.get(`/api/jobs/price-breakdown/${id}/`)
}

export const getJobActivities = (id: number) => {
    return httpService.get(`/api/jobs/activity/${id}/`)
}

export const canCompleteJob = (id: number) => {
    return httpService.get(`/api/jobs/can-complete/${id}/`)
}

