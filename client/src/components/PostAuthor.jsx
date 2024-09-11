/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios';
import ReactTimeAgo from 'react-time-ago';
import TimeAgo from 'javascript-time-ago';


import en from 'javascript-time-ago/locale/en.json'
import ru from 'javascript-time-ago/locale/ru.json'

TimeAgo.addDefaultLocale(en)
TimeAgo.addLocale(ru)


const PostAuthor = ({authorID, createdAt, updatedAt}) => {
  const [author, setAuthor] = useState({})

  useEffect(()=> {
    const getAuthor = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/users/${authorID}`)
        setAuthor(response?.data)
      } catch (error) {
        console.log(error)
      }
    }
    getAuthor();
  }, [authorID])

  return (
    <Link to={`/posts/users/${authorID}`} className='post_author'>
        <div className="post_author_avatar">
        <img src={author?.avatar} alt="User" />
        </div>
        <div className="post_author_detail">
            <h5> {author?.name} </h5>
            <small>
          {updatedAt ? (
            <ReactTimeAgo date={new Date(updatedAt)} locale="en-US" />
          ) : (
            <ReactTimeAgo date={new Date(createdAt)} locale="en-US" />
          )}
        </small>
        </div>
    </Link>
  )
}

export default PostAuthor
