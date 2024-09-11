/* eslint-disable react-hooks/exhaustive-deps */
import React, {useContext, useEffect } from 'react'
import Posts from '../components/Posts';
import { UserContext } from '../context/userContext'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate()
  const {currentUser} = useContext(UserContext)
  const token = currentUser?.token

  // redirect to any user who isnt logged in
  useEffect(()=>{
    if(!token){
      navigate('/login')
    }
  }, [])

  return (
    <Posts/>
  )
}

export default Home
