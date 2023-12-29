// css file
import './App.css';

// components
import Footer from './componenets/footer/footer'
import Navbar from './componenets/Navbar/Navbar'
import Home from './componenets/Home/Home'
import Crypto from './componenets/crypto/crypto';
import {Log , Sign} from './componenets/loginpage/log';
import Protected from './componenets/protected/protected'
import AddBlog from './componenets/Blog/addblog';
import Blogs from './componenets/Blog/blogs';
import UpdateBlog from './componenets/Blog/updateblog';

// dependencies and hooks imports
import { BrowserRouter , Routes , Route  } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Blogdetail from './componenets/BlogDetails/blogdetail';
import useAutoLogin from './hooks/autologin';



const App = () => {

  
  const isAuth = useSelector(state => state.user.auth);

  const loading = useAutoLogin();

  return(
    <div>
      <BrowserRouter>
      <Navbar />
        <Routes>
          <Route path="/" element={<Home />}/>
          
          <Route path="*" element={
          <div style={{textAlign:'center'}}>
            <h1>Error 404</h1>
            <a href='/'>go back</a>
          </div>
          }/>

          <Route path='/crypto' element={<Crypto/>}/>
          
          <Route path='/blogs'  element={
            <Protected isAuth={isAuth}><Blogs/></Protected>
          }/>
          
          <Route path='/blog/:id'  element={
            <Protected isAuth={isAuth}><Blogdetail/></Protected>
          }/>

          <Route path='/sign-in'  element={<Sign/>}/>

          <Route path='/update-blog/:id' element={ 
            <Protected isAuth={isAuth}><UpdateBlog/></Protected> 
          } />
          
          <Route path='/login'  element={<Log/>}/>

          <Route path='/new-blog'  element={
            <Protected isAuth={isAuth}><AddBlog/></Protected>         
            }
            /></Routes>
      </BrowserRouter>
      
    </div>
  )
}

export default App ;