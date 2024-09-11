/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useContext, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { FaEdit } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";
import { UserContext } from '../context/userContext'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const UserProfile = () => {
  const [avatar, setAvatar] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState('')

  const [isAvatarTouched, setIsAvatarTouched] = useState(false)

  const navigate = useNavigate()
  const { currentUser } = useContext(UserContext)
  const token = currentUser?.token

  // redirect to any user who isnt logged in
  useEffect(() => {
    if (!token) {
      navigate('/login')
    }
  }, [])


  useEffect(() => {
    const getUser = async () => {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/users/${currentUser.id}`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      const { avatar, name, email } = response.data
      setName(name)
      setEmail(email)
      setAvatar(avatar)
    }
    getUser()
  }, [])

  const changeAvatarHandler = async () => {
    setIsAvatarTouched(false);

    try {
      const postData = new FormData()
      postData.set('avatar', avatar)
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/users/change-avatar`, postData,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      setAvatar(response?.data.avatar)
    } catch (error) {
      console.log(error)
    }
  }


  const updateUserDetails = async (e) => {
    e.preventDefault()

    try {
      const userData = new FormData()
      userData.set('name', name)
      userData.set('email', email)
      userData.set('currentPassword', currentPassword)
      userData.set('newPassword', newPassword)
      userData.set('confirmNewPassword', confirmNewPassword)

      const response = await axios.patch(`${process.env.REACT_APP_BASE_URL}/users/edit-user`, userData,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      if (response.status === 200) {
        navigate('/logout')
      }
    } catch (error) {
      setError(error.response.data.message)
    }
  }

  return (
    <section className="profile">
      <div className="container profile_container">
        <Link to={`/myposts/${currentUser.id}`} className='profile_btn'> My Posts </Link>
        <div className="profile_details">
          <div className="avatar_wrapper">
            <div className="profile_avatar">
            <img src={avatar} alt="User" />

            </div>
            <form className='avatar_form' encType='multipart/form-data' >
              <input type="file" name='avatar' id='avatar' onChange={e => setAvatar(e.target.files[0])} accept='image/png, image/jpg, image/jpeg, image/heif, image/heic, image/webp, image/avif, image/bmp, image/tiff, image/svg+xml' />
              <label htmlFor="avatar" onClick={() => setIsAvatarTouched(true)} > <FaEdit /> </label>
            </form>
            {isAvatarTouched && <button className='profile_avatar_btn' onClick={changeAvatarHandler} > <FaCheck /> </button>}
          </div>

          <h2> {currentUser.name} </h2>

          <form action="" className="form profile_form" onSubmit={updateUserDetails} >
            {error && <p className='form_error_message' > {error} </p>}
            <input type="text" name='name' placeholder='Full Name' value={name} onChange={e => setName(e.target.value)} />
            <input type="text" name='email'  placeholder='Email' value={email} onChange={e => setEmail(e.target.value)} />
            <input type="password" name='password' placeholder='Current Password' value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
            <input type="password" name='password' placeholder='New Password' value={newPassword} onChange={e => setNewPassword(e.target.value)} />
            <input type="password" name='password' placeholder='Confirm New Password' value={confirmNewPassword} onChange={e => setConfirmNewPassword(e.target.value)} />
            <button type='submit' className='btn primary'> Update Details</button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default UserProfile;


