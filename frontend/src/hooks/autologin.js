
import axios from "axios"
import { setUser } from "../store/userSlice"
import { useDispatch } from "react-redux"
import { useState , useEffect } from "react"

const useAutoLogin = () => {

    const [loading , setLoading ] = useState(true);
    const dispatch = useDispatch();

    useEffect(()=>{
        (async function autoLoginApi(){

            try{

                const responce = await axios.get(`http://localhost:9090/refresh`,{
                    withCredentials : true,
                });
                if (responce.status === 200) {
                    const user = {
                        auth: responce.data.newuser.auth,
                        _id: responce.data.newuser._id,
                        username: responce.data.newuser.username,
                        email: responce.data.newuser.email
                    }
                    
                    console.log(user);
                 dispatch(setUser(user));
                }
            }
            catch(error){

            }
            finally{
                setLoading(false);
            }
        })();
    }, [])


    return loading;
}


export default useAutoLogin;

