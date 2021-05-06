import settings from '../settings.json'
import axios from 'axios';
import { server } from './server'
// import Session from './session';

const authServer = {
    // setSession: session => Session = session,

    get: async (path, params) => {
        const URI = path + settings.QA_FORUM_API_URI;
        return axios.get(URI, params)
    },
    post: async (path, data) => {
        
        var status = {
            code: null,
            message: "",
            error: ""
        }

        try {
            const response = await server.post(path, data)
            const {user, jwt} = response.data;

            if(!user || !jwt)
                status = { code: response.status, message: response.data.message, error: response.data.error }
            else {
                //Not working kept as future feature
                // Session.userSession.user = user 
                // Session.userSession.jwt = jwt 
                // Session.userSession.isLoggedIn =true 

                //Set localstorage and Authorization headers for every request
                localStorage.setItem(settings.JWT_KEY, jwt.toString())
                //TEMPORARY SETTING
                localStorage.setItem(settings.USER, JSON.stringify(user))
                // axios.defaults.headers.common.Authorization = 'Bearer ' + jwt.toString(); 
                status = {
                    code: response.status,
                    message: "Success",
                }
            }
        }
        catch(error){
            error.response ? status = { 
                code: error.response.status, 
                message: error.response.data.message, 
                error: error.response.data.error 
            } : status = {
                code: 500, 
                message: error.toJSON().message, 
                error: error
            }

        }

        return status
    }

}

export default authServer;