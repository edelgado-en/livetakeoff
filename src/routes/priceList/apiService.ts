import httpService from "../../services/httpService";


export const getAircraftTypes = (request: any) => {
    return httpService.post('/api/aircraft-types', request);
}