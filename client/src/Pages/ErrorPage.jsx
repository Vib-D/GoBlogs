import React from 'react'
import { Link } from 'react-router-dom'

const ErrorPage = () => {
  return (
    <section className='error_page'>
      <div className="center">
        <h2>Page not found</h2>
        <Link to='/home' className='btn primary'>Go Back Home</Link>

      </div>
    </section>
  )
}

export default ErrorPage
