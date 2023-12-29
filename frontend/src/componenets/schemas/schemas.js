import * as yup from 'yup';

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/;

const loginSchema = yup.object().shape({
    username: yup.string().min(5).max(15).required('username is required'),
    password: yup.string().min(4).max(15).required('username is required')
})

const signSchema = yup.object().shape({
    name: yup.string().max(20),
    username : yup.string().min(4).max(15).required('username required'),
    email : yup.string().email("enter a valid email").required("email required"),
    password : yup.string().matches(passwordPattern , {message : 'error.message'}).required("password required"),
    confirm_password : yup.string().oneOf([yup.ref("password")], "passwords must match").required("confirm password required")
})


export  {loginSchema , signSchema};