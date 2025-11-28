"use client"

import Link from 'next/link'
import React, { useEffect } from 'react'
import { Button } from '../ui/button'
import { SignedIn, SignedOut, SignInButton, SignOutButton } from '@clerk/nextjs'
import ThemeTogglerButton from '../ThemeTogglerButton'

const DesktopNavbar = () => {


  return (
    <div>
      <div className='hidden sm:flex gap-x-3 items-center'>

            {/* <ThemeTogglerButton/> */}

            <SignedOut>
                <SignInButton mode='modal'>

                    <Button
                        asChild
                        variant={'default'}
                        // className='bg-indigo-400 text-primary hover:bg-violet-400 cursor-pointer trnasition-all'
                        
                    >
                        <span className='bg-indigo-400 text-primary hover:bg-violet-400 cursor-pointer trnasition-all'>
                            Sign In
                        </span>
                    </Button>
                </SignInButton>
            </SignedOut>

            <SignedIn>
                <Button
                    variant={'default'}
                    className='bg-indigo-400 text-primary hover:bg-violet-400 cursor-pointer trnasition-all'
                >
                    <Link href={'/dashboard'} className='w-full'>
                        Dashboard
                    </Link>
                </Button>

                <SignOutButton>
                    <Button asChild variant={'outline'} className='cursor-pointer'>
                        <span>

                            SignOut
                        </span>
                    </Button>
                </SignOutButton>
            </SignedIn>
        </div>
    </div>
  )
}

export default DesktopNavbar
