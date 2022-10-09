import httpService from "../../services/httpService";

export const getJobDetails = (id: number) => {
    return httpService.get(`/api/jobs/${id}`);
}

export const updateJobStatus = (id: number, status: string) => {
    return httpService.patch(`/api/jobs/${id}/`, { status });
}

export const completeServiceAssignment = (id: number) => {
    return httpService.patch(`/api/jobs/services/${id}/`, { status: 'C' })
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