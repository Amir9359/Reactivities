import axios, { AxiosResponse } from 'axios';
import { Activity } from '../Models/activity';

const sleep = (delay : number) => {
    return new Promise((resolve) => {
        setTimeout(resolve , delay)
    })
}

axios.defaults.baseURL = 'http://localhost:5000/api';

axios.interceptors.response.use(async Response => {
    try {
        await sleep(1000);
        return Response;
    } catch (error) {
        console.log(error);
        return await Promise.reject(error);
    }   
})

const resposeBody =<T> (response : AxiosResponse<T>) => response.data;

const requests = {
    get : <T> (url : string) =>  axios.get<T>(url).then(resposeBody),
    post :<T> (url : string ,body :{}) =>  axios.post<T>(url ,body).then(resposeBody),
    put : <T> (url : string ,body :{}) =>  axios.put<T>(url ,body).then(resposeBody),
    del : <T> (url : string) =>  axios.delete<T>(url).then(resposeBody)
}

const Activities = {
    list : () => requests.get<Activity[]>(`/activities`) ,
    detail : (id : string ) => requests.get<Activity>(`/activities/${id}`),
    create : (activity : Activity) => axios.post<void>(`/activities/`, activity),
    update : (activity : Activity) => axios.put<void>(`/activities/${activity.id}`, activity),
    delete : (id : string )  => axios.delete<void>(`/activities/${id}`)
}

const agent = {
    Activities
}

export default agent;