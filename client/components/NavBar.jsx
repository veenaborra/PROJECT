import React from 'react'
import { Link } from 'react-router-dom'

const NavBar = () => {
  return (
  <nav className=' shadow-md '>
    <div className='max-w-7xl mx-auto px-4'>
        <div className='flex items-center justify-between align-center h-16'>
<div className='text-2xl font-bold text-black' >
AlgoNest
<div className='text-base font-light text-black '>
Practice.Compete.Evolve.
</div>
</div>
{/* auth */}
<div className='space-x-4'>
    <Link to='/signup' className='text-black font-medium hover:underline'>Sign up</Link>
    <Link to='/login' className='text-black font-medium hover:underline'>Log in</Link>

</div>
        </div>
    </div>
  </nav>
  )
}

export default NavBar