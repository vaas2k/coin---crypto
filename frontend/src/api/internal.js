import axios from 'axios';
import { FastField } from 'formik';


const api = axios.create({
    baseURL: 'http://localhost:9090',
    withCredentials : true,
    headers:{
        'Content-Type' : 'application/json'
    }
})


const login = async (data) => {
    let responce;
    try{
        responce = await api.post('/login',data);
    }catch(error){
        return error;
    }

    return responce;
} 

const sign = async (data) => {
    let responce;
    try{
        responce = await api.post('/register',data);
    }catch(error){
        return error;
    }

    return responce;
} 

const addBlog = async (data) => {

    let responce;
    try{
        responce = await api.post('/create_blog',data);
    }catch(error){
        return error;
    }

    return responce;
}


const getblogs = async () => {

    let responce;

    try{
        responce = await api.get('/getallblogs')
    }catch(error){
        return error;
    }

    return responce;
}

const getblogid = async (id) => {
    let responce;
    try{
        responce = await api.get(`/getblog/${id}/`);
    }catch(error){
        return error;
    }

    return responce;
}


const getcomments = async (id) => {
    let responce;
    try{
        responce = await api.get(`/getcomment/${id}/` , {
            validateStatus : false,
        });
    }catch(error){
        return error;
    }

    return responce;
}

const postComment = async (data) => {
    let responce ;
    try{
        responce = await api.post('/comment',data);
    }catch(error){
        return error;
    }
    return responce;
}

const DeleteComment = async (id) => {
    let responce;
    try{
        responce = await api.delete(`/delete_blog/${id}/`,{
            validateStatus : false,
        })
    }catch(error){
        return error;
    }
    return responce;
}

const Update = async (data) => {
    let responce;
    try{
        responce = await api.put('/update_blog',data);
    }catch(error){
        return error;
    }
    return responce;
}

// auto refreshs the tokens

api.interceptors.response.use(
    config => config,
    async error => {
        const original_req = error.config;

        if((error.responce.message === 401 || error.responce.message === 500) && original_req && !original_req._isRetry ){
            
            original_req._isRetry = true;

            try{
                await axios.get('http://localhost:9090/refresh',{
                    withCredentials : true,
                })

                api.request(original_req);
            }catch(error){
                return error;
            }
            
        }
        throw error;
    }
)


export {
    login,
    sign,
    addBlog,
    getblogs,
    getblogid,
    getcomments,
    postComment,
    DeleteComment,
    Update
};