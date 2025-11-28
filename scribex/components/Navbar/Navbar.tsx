import React from 'react'
import ThemeTogglerButton from '../ThemeTogglerButton'
import { Button } from '../ui/button'
import Link from 'next/link'
import DesktopNavbar from './DesktopNavbar'
import MobileNavbar from './MobileNavbar'
import { createUserBasedOnClerkId } from '@/server/actions/user.action'
import { auth } from '@clerk/nextjs/server'

const Navbar = async () => {

  const {userId} = await auth()

  if (userId) await createUserBasedOnClerkId();

  return (
    <div className='w-full'>
      <div className='max-w-7xl mx-auto p-3 px-5 flex justify-between items-center'>
        <Link href={'/'} className="Logo text-2xl md:text-3xl font-bold text-white">Scribe<span className='text-indigo-600'>X</span></Link>

        <div className='flex items-center gap-x-3 sm:gap-x-4'>
            <Link href={'/'} className=' underline mr-3 hidden sm:inline'>
                Home
            </Link>

            <ThemeTogglerButton/>

            <DesktopNavbar/>
            <MobileNavbar/>
        </div>

      </div>
    </div>
  )
}

export default Navbar
