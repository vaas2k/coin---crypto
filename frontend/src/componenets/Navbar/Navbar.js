
import './Navbar.css';

import { NavLink } from 'react-router-dom';
import { useSelector , useDispatch } from 'react-redux';
import { resetUser } from '../../store/userSlice';

const Navbar = () => {

    const dispatch = useDispatch();
    const isAuth = useSelector(state => state.user.auth);


    /* here we will do logic so when user click on sign out 
    it will reset the state means that user has been logged outs
    */

    function handleLogout () {
        dispatch(resetUser());
    }
    return (
        <div className='contain-navbar'>
            <nav className='navbar'>
                <NavLink to='/'><h2>Coin Bounce</h2></NavLink>
                <ol>
                    <li> <NavLink to='/' >Home</NavLink> </li>
                    <li> <NavLink to='crypto'>Crypto</NavLink>  </li>
                    <li> <NavLink to='blogs'>Blogs</NavLink>  </li>
                    <li> <NavLink to='new-blog'>New Blog</NavLink> </li>
                </ol>

                <div className='contain-buttons'>
                    {isAuth ? (<div>
                        <NavLink to='/login'>
                            <button 
                            className='to-signout'
                            onClick={handleLogout}
                            >Sign Out</button>
                        </NavLink> </div>)
                        :
                        <div>
                            <NavLink to='/sign-in'><button className='to-sign'>
                                Sign Up</button></NavLink>
                            <NavLink to='/login'>
                                <button className='to-log'>Log in</button>
                            </NavLink>
                        </div>
                    }

                </div>
            </nav>
        </div>
    );
}


export default Navbar;