import React, { useState, useContext, useEffect } from 'react'
import { UserContext } from '../context/userContext'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

const EditPost = () => {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Uncategorized')
  const [description, setDescription] = useState('')
  const [thumbnail, setThumbnail] = useState('')
  const [bookAuthor, setBookAuthor] = useState('')
  const [error, setError] = useState('')
  const { id } = useParams()

  const navigate = useNavigate()
  const { currentUser } = useContext(UserContext)
  const token = currentUser?.token

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!token) {
      navigate('/login')
    }
  }, [token, navigate])

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      ['link', 'image'],
      ['clean']
    ]
  }

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
  ]

  const POST_CATEGORIES = [
    'Uncategorized',
    'Journals',
    'Fantasy',
    'Mystery',
    'Fiction',
    'Thriller',
    'Non-Fiction',
    'Horror',
    'Romance'
  ]

  useEffect(() => {
    const getPost = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/posts/${id}`)
        setTitle(response.data.title)
        setDescription(response.data.description)
        setBookAuthor(response.data.bookAuthor)
        setCategory(response.data.category)
        setThumbnail(response.data.thumbnail)
      } catch (error) {
        console.log('Error fetching post:', error)
      }
    }
    getPost()
  }, [id])

  const handleThumbnailChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setThumbnail(reader.result) // Set the Base64 string
      }
      reader.readAsDataURL(file) // Convert file to Base64
    }
  }

  const editPost = async (e) => {
    e.preventDefault()
    setError('')
    const cleanedDescription = description.replace(/(?:\r\n|\t|\r|\n)/g, '  ')

    const postData = new FormData()
    postData.set('title', title)
    postData.set('description', description)
    postData.set('bookAuthor', bookAuthor)
    postData.set('category', category)
    postData.set('thumbnail', thumbnail)

    try {
      const response = await axios.patch(`${process.env.REACT_APP_BASE_URL}/posts/${id}`, postData, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.status === 200) {
        navigate('/home')
      }
    } catch (err) {
      console.error('Error:', err)
      setError(err.response?.data?.message || 'Something went wrong | Try another image')
    }
  }

  return (
    <section className="create_post">
      <div className="container">
        <h2>Edit Post</h2>
        {error && <p className='form_error_message'>{error}</p>}
        <form onSubmit={editPost} className="form create_post_form">
          <input
            name='title'
            type="text"
            placeholder='Title'
            value={title}
            onChange={e => setTitle(e.target.value)}
            autoFocus
          />
          <input
            name='bookAuthor'
            type="text"
            placeholder='By: Author'
            value={bookAuthor}
            onChange={e => setBookAuthor(e.target.value)}
          />
          <select name="category" value={category} onChange={e => setCategory(e.target.value)}>
            {POST_CATEGORIES.map(cat => <option key={cat} value={cat}> {cat} </option>)}
          </select>
          <ReactQuill modules={modules} formats={formats} value={description} onChange={setDescription} />
          <input
            name='thumbnail'
            type="file"
            onChange={handleThumbnailChange}
            accept="image/png, image/jpg, image/JPG, image/JPEG, image/jpeg, image/heif, image/heic, image/webp, image/gif, image/avif, image/bmp, image/tiff, image/svg+xml"
          />
          <button type='submit' className='btn primary'>Update</button>
        </form>
      </div>
    </section>
  )
}

export default EditPost
