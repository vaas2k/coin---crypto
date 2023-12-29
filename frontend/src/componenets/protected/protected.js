import { Navigate } from "react-router-dom";

const Protected = ({isAuth, children}) => {

    if(isAuth){
        return children;
    }else if(!isAuth){
        return <Navigate to='/login' />
    }
}

export default Protected;