/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useContext, useEffect } from 'react'
import PostItem from '../components/PostItem';
import { UserContext } from '../context/userContext'
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Loader from '../components/Loader';

const AuthorPost = () => {
  const navigate = useNavigate()
  const {currentUser} = useContext(UserContext)
  const token = currentUser?.token

  // redirect to any user who isnt logged in
  useEffect(()=>{
    if(!token){
      navigate('/login')
    }
  }, [])

  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(false);

  const {id} = useParams()

  useEffect(()=> {
      const fetchPost = async () => {
          setIsLoading(true);
          try {
              const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/posts/users/${id}`)
              setPosts(response?.data)
          } catch (err) {
              console.log(err)
          }

          setIsLoading(false)
      }
      fetchPost()
  }, [id])

  if(isLoading){
      return <Loader/>
  }

  return (
      <section className="posts">
          {posts.length > 0 ? <div className="container posts_container">
              {
                  posts.map(({ _id: id, thumbnail, category, title, description, creator, bookAuthor, createdAt }) =>
                      <PostItem key={id} postID={id} thumbnail={thumbnail} 
                      category={category} title={title} description={description} 
                      authorID={creator} bookAuthor={bookAuthor} createdAt={createdAt} />)
              }
          </div> : <h2 className='center'>No posts found</h2> }
      </section>
  )
}

export default AuthorPost
