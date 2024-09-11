/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable react/jsx-no-comment-textnodes */
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import Loader from '../components/Loader';


const Authors = () => {
  const [authors, setAuthors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getAuthors = async () => {
      setIsLoading(true)
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/users`)
        setAuthors(response.data)
      } catch (error) {
        console.log(error)
      }
      setIsLoading(false)
    }

    getAuthors()
  }, [])


  if(isLoading){
    return <Loader/>
  }

  return (
    <section className="authors">
      {authors.length > 0 ? <div className="container authors_container">
        {
          authors.map(({_id: id, avatar, name, posts }) => {
            return <Link to={`/posts/users/${id}`} key={id} className='author'>
              <div className="author_avatar">
              <img src={avatar} alt={`Image of ${name}`} />
              </div>
              <div className="author_info">
                <h4>{name}</h4>
                <p> Posts: {posts} </p>
              </div>
            </Link>
          })
        }
      </div> : <h2 className='center'>No authors found</h2>}
    </section>
  )
}

export default Authors
