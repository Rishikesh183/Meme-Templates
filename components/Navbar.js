import React from 'react'
import Link from 'next/link'
const Navbar = () => {
  return (
    <div className='flex p-3 text-xl w-full text-black font-bold gap-5 bg-blue-300'>
      <Link href={"/"}>cricmawa</Link>
      <Link  href={"/templates"}>Templates</Link>
    </div>
  )
}

export default Navbar
