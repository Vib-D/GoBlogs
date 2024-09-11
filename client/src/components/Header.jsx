import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import { AiOutlineClose } from 'react-icons/ai';
//import Logo from '../images/book1.png';
import { IoLibrarySharp } from "react-icons/io5";
import { UserContext } from '../context/userContext';

const Header = () => {
  const [isNav, setIsNav] = useState(window.innerWidth > 800 ? true : false)
  const {currentUser} = useContext(UserContext)

  const closeNavHandler = () => {
    if (window.innerWidth < 800) {
      setIsNav(false)
    } else {
      setIsNav(true)
    }
  }

  return (
    <nav>
      <div className="container nav_container">
        <Link to='/home' className='nav_logo' onClick={closeNavHandler}>
          <IoLibrarySharp />
        </Link>
        {(window.innerWidth < 800) ? <h2 className='nav_title' onClick={closeNavHandler}> GoBlogs </h2> : <h2 className='nav_title'> </h2>} 
        {currentUser?.id && isNav && <ul className="nav_menu">
          <li><Link to='/home' onClick={closeNavHandler} > Home </Link></li>
          <li><Link to={`/profile/${currentUser.id}`} onClick={closeNavHandler} >Profile</Link></li>
          <li><Link to='/create' onClick={closeNavHandler}>Create Post</Link></li>
          <li><Link to='/authors' onClick={closeNavHandler}>Authors</Link></li>
          <li><Link to='/logout' onClick={closeNavHandler}>Logout</Link></li>
        </ul>}
        {!currentUser?.id && isNav && <ul className="nav_menu">
          <li><Link to='/authors' onClick={closeNavHandler}>Authors</Link></li>
          <li><Link to='/login' onClick={closeNavHandler}>Login</Link></li>
        </ul>}
        <button className="nav_toggle-btn" onClick={() => setIsNav(!isNav)} >
          {isNav ? <AiOutlineClose /> : <FaBars />}
        </button>
      </div>
    </nav>
  )
}

export default Header;
