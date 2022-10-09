
 const ACCESS_TOKEN = 'api.livetakeoff.access.token';
 const USER_INFO = 'user.info';

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

export const setUserInfo = (userInfo) => {
    try {
        localStorage.setItem(USER_INFO, JSON.stringify(userInfo));
    } catch (e) {
        throw e;
    }
}

export const getUserInfo = () => {
    try {
        const userInfo = localStorage.getItem(USER_INFO);

        if (userInfo === null) {
            return {};
        }

        return JSON.parse(userInfo);
    } catch (e) {
        return {};
    }
}