import settings from '../settings.json'
import axios from 'axios';

const server = {
    get: async (path, params = null, base = null) => {
        const URI =  base ? base + path : settings.QA_FORUM_API_URI + path;
        const jwt = localStorage.getItem(settings.JWT_KEY)
        const Authorization = jwt ? `Bearer ${jwt}` : null
        const config = {
            params: params,
            headers: {
                Authorization: Authorization
            }
        }
        return axios.get(URI, config)
    },
    post: async (path, data, base = null) => {
        const URI = base ? base + path : settings.QA_FORUM_API_URI + path;
        const jwt = localStorage.getItem(settings.JWT_KEY)
        const Authorization = jwt ? `Bearer ${jwt}` : null 
        
        return axios.post(URI, data, {
            headers: {
                Authorization: Authorization,
            }
        });
    },
    put: async (path, data) => {
        const URI =  settings.QA_FORUM_API_URI + path;
        const jwt = localStorage.getItem(settings.JWT_KEY)
        const Authorization = jwt ? `Bearer ${jwt}` : null

        return axios.put(URI, data, {
            headers: {
                Authorization: Authorization,
                "Content-Type": "application/json"
            }
        })
    },
    delete: async path => {
        const URI =  settings.QA_FORUM_API_URI + path;
        const jwt = localStorage.getItem(settings.JWT_KEY)
        const Authorization = jwt ? `Bearer ${jwt}` : null

        return axios.delete(URI, {
            headers: {
                Authorization: Authorization,
                "Content-Type": "application/json"
            }
        })
    }

}

export { server }