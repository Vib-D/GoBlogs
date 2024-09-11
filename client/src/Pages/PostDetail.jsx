/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react'
import PostAuthor from '../components/PostAuthor';
import { Link, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/userContext';
import Loader from '../components/Loader';
import DeletePost from './DeletePost'
import axios from 'axios';


const PostDetail = () => {
  const navigate = useNavigate()
  const { currentUser } = useContext(UserContext)
  const token = currentUser?.token

  // redirect to any user who isnt logged in
  useEffect(() => {
    if (!token) {
      navigate('/login')
    }
  }, [])

  const { id } = useParams()
  const [post, setPost] = useState(null)
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [updatedAt, setUpdatedAt] = useState('')


  useEffect(() => {
    const getPost = async () => {
      setIsLoading(true)
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/posts/${id}`)
        setPost(response.data)
        setUpdatedAt(response.data.updatedAt)
      } catch (error) {
        console.log(error)
      }
      setIsLoading(false)
    }

    getPost()
  }, [id])



  if (isLoading) {
    return <Loader />
  }
  

  return (
    <section className="post_detail">
      {error && <p className='error'> {error} </p>}
      {post && <div className="container post_detail_container">
        <div className="post_detail_header" >
          <PostAuthor authorID={post.creator} createdAt={post.createdAt} updatedAt={post.updatedAt}/>
          {currentUser?.id === post?.creator && <div className="post_detail_buttons">
            <Link to={`/posts/${post?._id}/edit`} className='sm btn primary' >Edit</Link>
            <DeletePost postId={id} />
          </div>}
        </div>
        <h2>{post.title}</h2>
        <h5 className='book_author'> ~ {post.bookAuthor}</h5>
        <div className="post_detail_thumbail">
        <img src={post.thumbnail} alt="Post Thumbnail" />

        </div>
        <div
          className="post-description"
          dangerouslySetInnerHTML={{ __html: post.description.replace(/(?:\r\n|\t|\r|\n)/g, '<br>') }}
        />
      </div>}
    </section>
  )
}

export default PostDetail
