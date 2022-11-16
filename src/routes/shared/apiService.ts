import httpService from "../../services/httpService";

export const getJobDetails = (id: number) => {
    return httpService.get(`/api/shared/jobs/${id}`);
}