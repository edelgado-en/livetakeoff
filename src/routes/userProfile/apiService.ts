import httpService from "../../services/httpService";

export const getUserDetails = () => {
    return httpService.get('/api/users/me');
}

export const uploadUserAvatar = (formData: any) => {
    return httpService.patch('/api/users/me/avatar', formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })
}

export const updateUser = (data: any) => {
    return httpService.patch('/api/users/me', data);
}

export const resetPassword = (data: any) => {
    return httpService.patch('/api/users/me/reset-password', data);
}