import './addblog.css';
import Text from '../Text/textinputs';
import { useState } from 'react';
import { addBlog } from '../../api/internal';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Update } from '../../api/internal';




const UpdateBlog = () => {

    const navigate = useNavigate();
    const params = useParams();
    const blogid = params.id;
    const userid = useSelector((state) => state.user._id);

    const [blog , setBlog ]  = useState({
        blog_id: blogid,
        title : "",
        content : "",
        author : userid,
        photo : "",
    });

    console.log(blog);

    function handlePhoto (e) {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            setBlog((oldData) => {
                return {
                    ...oldData,
                    photo : reader.result
                }
            })
        }

        if(file) {
            reader.readAsDataURL(file);
        }
    }

    function handleChange (e) {
        const { name , value } = e.target;
        setBlog(oldBlog => {
            return {
                ...oldBlog,
                [name] : value
            }
        })
    }

    async function handleUpdate(e){
        e.preventDefault();

        const formData = new FormData();
        formData.append('author', blog.author);
        formData.append('title', blog.title);
        formData.append('content', blog.content);
        formData.append('photo', blog.photo);
        formData.append('blog_id', blog.blog_id);

        const responce = await Update(formData);
        if(responce.status === 200) {
            alert("Updated Successfully" , responce.data.message)
            navigate('/blogs');
        }else{
            alert("Not Updated Some error")
        }

    }

    return (
        <div className='contain-add-blog'>
            <form className='add-blog' >
                <label htmlFor='title'>Title :</label>
                <input
                    id='title'
                    name='title'
                    value = {blog.title}
                    onChange = {handleChange}
                ></input>
                <div>
                    <label htmlFor='blog'>Blog :</label>
                    <textarea
                        id='blog'
                        name='content'
                        value={blog.content}
                        onChange={handleChange}
                    ></textarea>
                </div>
                <input
                    type="file"
                    name="photo"
                    id="photo"
                    accept="image/jpg, image/jpeg, image/png"
                    onChange={handlePhoto}
                />
                {blog.photo !== "" ? <img src={blog.photo} width={150} height={150} /> : ""}
                <button type='submit'
                    onClick={handleUpdate}>Add</button>
            </form>
        </div>
    );
}

export default UpdateBlog;
