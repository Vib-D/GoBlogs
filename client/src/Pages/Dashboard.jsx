/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useContext, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { UserContext } from '../context/userContext'
import { useNavigate, useParams } from 'react-router-dom';
import Loader from '../components/Loader';
import axios from 'axios';
import DeletePost from './DeletePost';

const Dashboard = () => {

  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { id } = useParams()
  const { currentUser } = useContext(UserContext)
  const token = currentUser?.token

  // redirect to any user who isnt logged in
  useEffect(() => {
    if (!token) {
      navigate('/login')
    }
  }, [])


  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true)
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/posts/users/${id}`, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` }
        })
        setPosts(response.data)
      }
      catch (error) {
        console.log(error)
      }
      setIsLoading(false)
    }
    fetchPosts()
  }, [id])


  if (isLoading) {
    return <Loader />
  }





  return (
    <section className="dashboard">
      {
        posts.length ? <div className="container dashboard_container">
          {
            posts.map(post => {
              return (
                <article key={post._id} className='dashboard_post'>
                  <div className="dashboard_post_info">
                    <div className="dashboard_post_thumbnail">
                    <img src={post.thumbnail} alt={post.title} />
                    </div>
                    <h4>{post.title}</h4>
                  </div>
                  <div className="dashboard_post_actions">
                    <Link to={`/posts/${post._id}`} className='sm profile_btn'>View</Link>
                    <Link to={`/posts/${post._id}/edit`} className='btn sm primary'>Edit</Link>
                    <DeletePost postId={post._id} />
                  </div>
                </article>
              )
            })
          }

        </div> : <h2 className='center' >You have no posts yet!</h2>
      }
    </section>
  )
}

export default Dashboard
