import './blogdetail.css';

import { useEffect , useState } from 'react';
import { useParams , useNavigate } from 'react-router-dom';
import {getblogid , getcomments , postComment , DeleteComment } from '../../api/internal';
import { useSelector } from 'react-redux';
import UpdateBlog from '../Blog/updateblog';




const Blogdetail = () => {

    const userid = useSelector( state => state.user._id);
    const navigate = useNavigate();
    const params = useParams();
    const blogid = params.id;

    const [ownerShip , setOwnerShip] = useState(false);
    const [blog , setBlog ]  = useState([]);
    const [comments , setComments] = useState([]);
    const [newComment  , setnewComment] = useState({content : ''});
    const [reload , setreload] = useState(false);

    useEffect(() => {

        async function getblog () {
            const blogresponce = await getblogid(blogid);
            if(blogresponce.status === 200){
                setBlog(blogresponce.data.Blog);
                setOwnerShip(userid === blogresponce.data.Blog.author);
            }
            
            const commentresponce = await getcomments(blogid);
            if(commentresponce.status === 200){
                setComments(commentresponce.data.comments)
            }
        }

        getblog();
    },[reload])


    function commentChange (e) {
        const {name , value } = e.target;
        setnewComment(()=>{
            return {[name]:value}
        })
    }
    async function handlecomment(e){
        const data = {
            content : newComment.content,
            author : userid,
            blog : blogid
        }

        const responce = await postComment(data);
        if(responce.status === 200){
            setreload(!reload);
            setnewComment("");
        }else{
            alert("Error");
        }
    }

    async function handleDelete (id) { 

        const responce =  await DeleteComment(id);
        if(responce.status === 200) {
            navigate("/blogs");
        }else{
            console.log(responce.data.error);
            alert("error deleteing")
        }
    }

    //get all the data related to single blog
    //update or delete the blog (only if it were done the by the same user)
    //show comments on the blog down or to the right side
    return (
        <div className='contain-blog-comment' key={blogid}>
            
            <h1>{blog.title}</h1>
            <div className='blog-details'>
            <img src={blog.photo}
                className='i-1'
            ></img>
            <p>
                {blog.content}
            </p>
            </div>

            <br/>
            {ownerShip && <div className='contain-up-del'>
                <button className='up-del' onClick={ () => navigate(`/update-blog/${blogid}`)} >Update</button>
                <button className='up-del' onClick={()=> handleDelete(blogid)}>Delete</button>
            </div>}
            <br/>

            <div className='all-comments'>
                <h3>COMMENTS</h3>
                { comments.map((comm) => { return (<div>{comm.content}</div>)})}
            </div>

            <br/>
            <div className='comment'>
                <h3>LEAVE A COMMENT</h3>
                <h4>Comment</h4>
                <textarea
                className='comm-area'
                value={newComment.content}
                name='content'
                onChange={commentChange} 
                />
            </div>
                <button className='comm'
                role='submit'
                onClick={handlecomment}
                >comment</button>
        </div>
    );
}


export default Blogdetail;