
import './blogs.css';
import {getblogs} from '../../api/internal';
import { useEffect, useState } from 'react';
import { useNavigate  , Link, Navigate} from 'react-router-dom';
import Blogdetail from '../BlogDetails/blogdetail';

const Blogs = () => {

    const navigate = useNavigate();
    // fetch all the blogs from backend via Api call
    const [blogs , setBlogs] = useState([]);
    useEffect(() => {
        const getAllBlogsApiCall = async () => {
          try {
            const response = await getblogs();
            if (response.status === 200) {
              setBlogs(response.data.BLOGS);
            }
          } catch (error) {
            // Handle errors here
            console.error('Error fetching blogs:', error);
          }
        };
      
        getAllBlogsApiCall();
      }, []);


      

    return (
        <div className='contain-blog'>
            {
                blogs.map((item => {
                    return (
                        <div className='have-blog' key={item.id}
                        onClick={()=> navigate(`/blog/${item.id}`)}>
                            <img src={item.photo} className='img1' />
                            <div className='have-info'>
                                <h5><small>{item.date}</small></h5> 
                                <h1>{item.title}</h1>
                                <p>{item.content.slice(0,30)}</p>
                            </div>
                        </div>
                    )
                }))
            }
        </div>
    );
}


export default Blogs;

/*

<img src="./images/312355094_530951975523724_201140444674821789_n.jpg"
                className='img1'
            ></img>
            <div className='have-info'>
            <h5><small>date</small></h5>
            <h1>title</h1>
            <p>some samll headaasdasdasdasd
                asdasdasdasdasdadsadasdasdasdasdasdas
                asdasdingasdasd or intro</p>
            <h5><small>author name</small></h5>
            </div>



*/