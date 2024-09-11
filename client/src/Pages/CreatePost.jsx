import React, { useState, useContext, useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import { UserContext } from '../context/userContext';
import { useNavigate } from 'react-router-dom';



const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Uncategorized');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState(''); // Ensure this holds the Base64 string
  const [bookAuthor, setBookAuthor] = useState('');
  const [error, setError] = useState('');
  const quillRef = useRef(null);
  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext);
  const token = currentUser?.token;

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [navigate, token]);

  // Handle image file upload and convert it to Base64
  const handleThumbnailUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnail(reader.result); // Set Base64 string
        // console.log('Thumbnail (Base64):', reader.result); // Debugging purpose
      };
      reader.readAsDataURL(file); // Convert file to Base64
    }
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      ['link', 'image'],
      ['clean']
    ]
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
  ];

  const POST_CATEGORIES = [
    'Uncategorized',
    'Journals',
    'Fantasy',
    'Mistery',
    'Fiction',
    'Thriller',
    'Non-Fiction',
    'Horror',
    'Romance'
  ];

  
  // Create the post
  const createPost = async (e) => {
    
    e.preventDefault();
    setError('');

    if (!title || !description || !bookAuthor || !category || !thumbnail) {
      setError('Please fill in all required fields.');
      return;
    }

    const postData = new FormData()
    postData.set('title', title)
    postData.set('description', description)
    postData.set('bookAuthor', bookAuthor)
    postData.set('category', category)
    postData.set('thumbnail', thumbnail)

    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/posts`, postData, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.status === 201) {
        navigate('/home');
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.response?.data?.message || 'Something went wrong | Try another image');
    }
  };

  return (
    <section className="create_post">
      <div className="container">
        <h2>Create Post</h2>
        {error && <p className='form_error_message'>{error}</p>}
        <form className="form create_post_form" onSubmit={createPost} id='create-post'>
          <input
            type="text"
            placeholder='Title'
            name='title'
            value={title}
            onChange={e => setTitle(e.target.value)}
            autoFocus
          />
          <input
            type="text"
            name='bookAuthor'
            placeholder='By: Author/Self'
            value={bookAuthor}
            onChange={e => setBookAuthor(e.target.value)}
          />
          <select name="category" value={category} onChange={e => setCategory(e.target.value)}>
            {POST_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <ReactQuill
            ref={quillRef}
            modules={modules}
            formats={formats}
            value={description}
            onChange={setDescription}
          />
          <input
            name='thumbnail'
            type="file"
            onChange={handleThumbnailUpload} // Updated function name
            accept="image/png, image/jpg, image/jpeg, image/heif, image/heic, image/webp, image/gif, image/avif, image/bmp, image/tiff, image/svg+xml"
          />
          <button type='submit' className='btn primary'>Create</button>
        </form>
      </div>
    </section>
  );
};

export default CreatePost;
