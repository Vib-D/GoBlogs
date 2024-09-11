import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer>
      <ul className="footer_categories">
        <li><Link to='/posts/categories/Journals'>Journals </Link></li>
        <li><Link to='/posts/categories/Fantasy'>Fantasy </Link></li>
        <li><Link to='/posts/categories/Mystery'>Mistery </Link></li>
        <li><Link to='/posts/categories/Fiction'>Fiction </Link></li>
        <li><Link to='/posts/categories/Thriller'> Thriller</Link></li>
        <li><Link to='/posts/categories/Non-Fiction'>Non-Fiction </Link></li>
        <li><Link to='/posts/categories/Horror'>Horror </Link></li>
        <li><Link to='/posts/categories/Romance'>Romance </Link></li>
      </ul>
      <div className="footer_copyright">
        <small>All rights reserved &copy; 2024 Copyright | GowVib</small>
      </div>
    </footer>
  )
}

export default Footer
