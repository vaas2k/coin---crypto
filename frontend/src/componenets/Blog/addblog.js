import './addblog.css';
import Text from '../Text/textinputs';
import { useState } from 'react';
import { addBlog } from '../../api/internal';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
const AddBlog = () => {


    // for adding blogs we need to have cookie logged in so that backend would allow us to save blogs 
    // ill be back niggers
    
    const navigate = useNavigate();
    const author = useSelector((state) => { return state.user._id })

    const [blogData, setBlogData] = useState({
        author: author,
        title: '',
        content: '',
        photo: '' // Initially empty; will be updated when a file is selected
    });


    function handleChange(e) {
        const { name, value } = e.target;
        setBlogData(prevData => ({
            ...prevData,
            [name]: value
        }));
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
    
        reader.onloadend = () => {
            setBlogData((oldData) => ({
                ...oldData,
                photo: reader.result // Store the base64 string in state
            }));
        };
    
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('author', blogData.author);
        formData.append('title', blogData.title);
        formData.append('content', blogData.content);
        formData.append('photo', blogData.photo);

        try {
            const response = await addBlog(formData);
            if (response.status === 200) {
                alert('Blog added successfully');
                navigate('/blogs');
            } else {
                alert('Failed to add blog');
            }
        } catch (error) {
            alert('An error occurred while adding the blog');
        }
    };

    return (
        <div className='contain-add-blog'>
            <form className='add-blog' >
                <label htmlFor='title'>Title :</label>
                <input
                    id='title'
                    name='title'
                    value={blogData.title}
                    onChange={handleChange}
                ></input>
                <div>
                    <label htmlFor='blog'>Blog :</label>
                    <textarea
                        id='blog'
                        name='content'
                        value={blogData.content}
                        onChange={handleChange}
                    ></textarea>
                </div>
                <input
                    type="file"
                    name="photo"
                    id="photo"
                    accept="image/jpg, image/jpeg, image/png"
                    onChange={handleFileChange}
                />
                {blogData.photo !== "" ? <img src={blogData.photo} width={150} height={150} /> : ""}
                <button type='submit'
                    onClick={handleSubmit}>Add</button>
            </form>
        </div>
    );
}

export default AddBlog;
