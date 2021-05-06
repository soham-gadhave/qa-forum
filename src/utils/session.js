import settings from '../settings'
import axios from 'axios'

var Session = {
    userSession: {
        user: null,
        isLoggedIn: false,
        jwt: ""
    },
    setUserSession: userSession => Session.userSession = userSession,
    
    isAuthenticated: () => {
        if (typeof window == 'undefined')
            return false;
        if(localStorage.getItem(settings.JWT_KEY)) 
            return true
        return false
    },

    handleLogout: () => {
        localStorage.removeItem(settings.JWT_KEY)
        localStorage.removeItem(settings.USER)
        delete axios.defaults.headers.common['Authorization']
    },

    getUser: () => {
        if(localStorage.getItem(settings.USER)) {
            const user = JSON.parse(localStorage.getItem(settings.USER))
            return user;
        }
        else 
            return null
    }

}

export default Session;
