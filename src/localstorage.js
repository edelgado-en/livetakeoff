
 const ACCESS_TOKEN = 'api.livetakeoff.access.token';

 export const loadApiAccessToken = () => {
    try {
        const accessToken = localStorage.getItem(ACCESS_TOKEN);
        
        if (accessToken === null) {
            return undefined;
        }

        return accessToken;

    } catch (e) {
        return undefined;
    }
};

/**
 * 
 * @returns true if user is authenticated
 */
 export const isUserAuthenticated = () => {
    let isAuthenticated = false;

    try {
        const accessToken = localStorage.getItem(ACCESS_TOKEN);

        isAuthenticated = accessToken === null ? false : true;
        
    } catch (e) {
        isAuthenticated = false;
    }

    return isAuthenticated;
}

export const setApiAccessToken = (accessToken) => {
    try {
        localStorage.setItem(ACCESS_TOKEN, accessToken);
    } catch (e) {
        throw e;
    }
}