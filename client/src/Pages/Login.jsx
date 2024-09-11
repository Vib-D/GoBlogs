import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { UserContext } from '../context/userContext'

const Login = () => {
  const [userData, setUserData] = useState({
    email: '',
    password: '',
  })

  const [error, setError] = useState('')
  const navigate = useNavigate()

  const { setCurrentUser } = useContext(UserContext)

  const changeInputHandler = (e) => {
    setUserData(prevState => {
      return { ...prevState, [e.target.name]: e.target.value }
    })
  }

  const loginUser = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/users/login`, userData);
      const user = await response.data;
      setCurrentUser(user)
      navigate('/home');
    } catch (err) {
      setError(err.response.data.message)
    }
  }

  return (
    <section className="login">
      <div className="container">
        <h2>Sign In</h2>
        <form className="form login_form" onSubmit={loginUser} >
          {error && <p className="form_error_message">
            {error}
          </p>}
          <input type="text" placeholder='Email' name='email' value={userData.email} onChange={changeInputHandler} autoFocus />
          <input type="password" placeholder='Password' name='password' value={userData.password} onChange={changeInputHandler} />
          <button className='btn primary form-btn' type='submit'>Login</button>
        </form>
        <h4>Don't have an account? <Link to='/register' className='register_sign_in'> Register here! </Link></h4>
      </div>
    </section>
  )
}

export default Login
