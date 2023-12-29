import { useState } from 'react';
import './log.css';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch} from 'react-redux';
import { login, sign } from '../../api/internal';
import { setUser } from '../../store/userSlice';
import Text from '../Text/textinputs';
import { useFormik } from 'formik';
import { signSchema } from '../schemas/schemas';

const Log = () => {



    const [logData, setData] = useState({
        username: "",
        password: "",
    });

    const navigate = useNavigate();
    const dispatch = useDispatch();

    async function handleSubmit(event) {
        event.preventDefault();

        try {

            const responce = await login(logData);

            if (responce.status === 200) {
                const user = {
                    auth: responce.data.newuser.auth,
                    _id: responce.data.newuser._id,
                    username: responce.data.newuser.username,
                    email: responce.data.newuser.email
                }
                
                dispatch(setUser(user));
                navigate('/');
            } else if (responce.code == "ERR_BAD_REQUEST") {
                alert("BAD REQUEST - Wrong Credentials");
            }
        } catch (error) {
            alert(error);
        }

    }

    function handlechange(event) {
        setData(oldData => {
            const { name, value } = event.target;
            return {
                ...oldData,
                [name]: value
            }
        });
    }


    return (
        <div className='contain-login'>
            <h2>Log in to your account</h2>
            <form className='login' >

                <input
                    id='in1'
                    type='text'
                    name='username'
                    placeholder='Username'
                    onChange={handlechange}
                    value={logData.username}
                />
                <input
                    id='in2'
                    type='password'
                    name='password'
                    placeholder='Password'
                    value={logData.password}
                    onChange={handlechange}
                    required
                />
                <button className='submit'
                    type='submit'
                    onClick={handleSubmit}>
                    Log In
                </button>
                <div className='to-reg'>
                    Don't have an account ?
                    <NavLink to='/sign-in'>
                        <button className='reg' role=''>Register</button>
                    </NavLink>
                </div>
            </form>
        </div>
    )
}


const Sign = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { values, touched, handleBlur, handleChange, errors } = useFormik({
        initialValues: {
            name: "",
            username: "",
            email: "",
            password: "",
            confirm_password: ""
        },
        validationSchema: signSchema
    })

    async function handlesubmit(event) {
        event.preventDefault();
        const data = {
            name : values.name,
            username : values.username,
            email : values.email,
            password : values.password,
            confirm_password : values.confirm_password
        }

        const responce = await sign(data);

        if(responce.status === 200){
            const user = {
                _id : responce.data.user._id,
                name : responce.data.user.name,
                username: responce.data.user.username,
                email : responce.data.user.email,
                auth : responce.data.user.auth
            }

            dispatch(setUser(user));
            navigate('/');
        }else if(responce.status !== 200){
            console.log(responce.data.error);
            alert('server error');
        }
        
    }

    return (
        <div className='contain-sign'>
            <form className='sign' onSubmit={handlesubmit}>
                <h2>Create Account</h2>

                <Text
                    type="text"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="name"
                    error={errors.name && touched.name ? 1 : undefined}
                    errormessage={errors.name}
                />

                <Text
                    type="text"
                    name="username"
                    value={values.username}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="username"
                    error={errors.username && touched.username ? 1 : undefined}
                    errormessage={errors.username}
                />

                <Text
                    type="email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="abc@gmail.com"
                    error={errors.email && touched.email ? 1 : undefined}
                    errormessage={errors.email}
                />

                <Text
                    type="password"
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="password"
                    error={errors.password && touched.password ? 1 : undefined}
                    errormessage={errors.password}
                />

                <Text
                    type="password"
                    name="confirm_password"
                    value={values.confirm_password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="confirm_password"
                    error={errors.confirm_password && touched.confirm_password ? 1 : undefined}
                    errormessage={errors.confirm_password}
                />


                <button id='s'>Sign Up</button>
                <div className='butts'>
                    <p>Login instead ?</p>
                    <NavLink to='/login'>
                        <button>Log in</button>
                    </NavLink>
                </div>
            </form>
        </div>
    )
}


export {
    Log,
    Sign
}

/*
 <input
                    name='name'
                    onChange={handlechange}
                    value={signData.name}
                    type='text'
                    placeholder='name'
                />
                <input
                    name='username'
                    onChange={handlechange}
                    value={signData.username}
                    type='text'
                    placeholder='username'
                />
                <input
                    name='email'
                    onChange={handlechange}
                    value={signData.email}
                    type='email'
                    placeholder='email'
                />
                <input
                    name='password'
                    onChange={handlechange}
                    value={signData.password}
                    type='password'
                    placeholder='password'
                />
                <input
                    name='confirm_password'
                    onChange={handlechange}
                    value={signData.confirm_password}
                    type='password'
                    placeholder='confirm-password'
                />
*/