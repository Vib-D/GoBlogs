import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const Register = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const changeInputHandler = (e) => {
    setUserData(prevState => {
      return { ...prevState, [e.target.name]: e.target.value }
    })
  }

  const registerUser = async (e) => {
    e.preventDefault();
    setError('');
    try {
        const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/users/register`, userData);
        const newUser = await response.data;
        console.log(newUser)
        if (!newUser) {
            setError('Could not register user. Please try again!');
        }
        navigate('/login');        
    } catch (err) {
        setError(err.response.data.message || 'An error occurred during registration.');
    }
  };


  return (
    <section className="register">
      <div className="container">
        <h2>Register Now</h2>
        <form className="form register_form" onSubmit={registerUser}>
          {error && <p className="form_error_message">
            {error}
          </p>}
          <input type="text" placeholder='Full Name' name='name' value={userData.name} onChange={changeInputHandler} autoFocus />
          <input type="text" placeholder='Email' name='email' value={userData.email} onChange={changeInputHandler} />
          <input type="password" placeholder='Password' name='password' value={userData.password} onChange={changeInputHandler} />
          <input type="password" placeholder='Confirm Password' name='confirmPassword' value={userData.confirmPassword} onChange={changeInputHandler} />
          <button className='btn primary form-btn' type='submit'>Register</button>
        </form>
        <h4>Already have an account? <Link to='/login' className='register_sign_in'> Sign In </Link></h4>
      </div>
    </section>
  )
}

export default Register
