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

export const completeJob = (id: number, data: any) => {
    return httpService.patch(`/api/jobs/${id}/`, data);
}

export const returnJob = (id: number, data: any) => {
    return httpService.post(`/api/jobs/return/${id}/`, data);
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

export const uploadFile = (jobId: number, formData: any) => {
    return httpService.post(`/api/job-files/upload/${jobId}/`, formData,  {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })
}

export const updateJobFile = (fileId: number, request: any) => {
    return httpService.patch(`/api/job-files/${fileId}/`, request);
}

export const deleteJobFile = (fileId: number) => {
    return httpService.delete(`/api/job-files/${fileId}/`);
}

export const getJobComments = (jobId: number) => {
    return httpService.get(`/api/job-comments/${jobId}/`)
}

export const updateComment = (commentId: number) => {
    return httpService.patch(`/api/job-comments/${commentId}/`)
}

export const deleteComment = (commentId: number) => {
    return httpService.delete(`/api/job-comments/${commentId}/`)
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

export const createJobSchedule = (data: any) => {
    return httpService.post('/api/jobs/schedules/create', data)
}

export const getJobSchedules = (data: any) => {
    return httpService.post('/api/jobs/schedules', data)
}

export const updateJobSchedule = (id: number, data: any) => {
    return httpService.patch(`/api/jobs/schedules/${id}/`, data)
}

export const getAirports = (request: any) => {
    return httpService.post(`/api/airports`, request);
}

export const getServices = () => {
    return httpService.post('/api/services', {});
}

export const getTailAircraftLookup = (tail: string) => {
    return httpService.get(`/api/tail-aircraft-lookup/${tail}/`);
}

export const getTailAlertLookup = (tail: string) => {
    return httpService.get(`/api/tail-alert-lookup/${tail}/`);
}

export const getTailOpenJobLookup = (tail: string) => {
    return httpService.get(`/api/tail-open-job-lookup/${tail}/`);
}

export const getRetainerServices = () => {
    return httpService.post('/api/retainer-services', {});
}

export const getCustomers = (request: any) => {
    return httpService.post('/api/customers', request);
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

export const getEstimateDetail = (id: any) => {
    return httpService.get(`/api/estimates/details/${id}`)
}

export const deleteTailAlert = (id: number) => {
    return httpService.delete(`/api/tail-alerts/${id}/`);
}

export const getTailDetails = (id: number) => {
    return httpService.get(`/api/tail-alerts/${id}/`);
}

export const getTailNoteLookup = (data: any) => {
    return httpService.post(`/api/tail-note-lookup`, data);
}

export const searchFbos = (data: any) => {
    return httpService.post(`/api/fbo-search`, data);
}

export const getCustomerRetainerServices = (id: number) => {
    return httpService.get(`/api/customers/retainers-services/${id}/`);
}

export const getTailServiceHistory = (data: any) => {
    return httpService.post('/api/tail-service-history', data)
}

export const getUserDetails = () => {
    return httpService.get('/api/users/me');
}