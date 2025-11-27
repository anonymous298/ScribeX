'use client'

import { MenuIcon } from 'lucide-react'
import React from 'react'
import { Button } from '../ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import Link from 'next/link'
import { SignOutButton, SignInButton, SignedIn, SignedOut } from '@clerk/nextjs'

const MobileNavbar = () => {
    
  return (
    <div className='sm:hidden'>
        <Sheet>
            <SheetTrigger asChild>
                <Button variant={'outline'}>
                    <MenuIcon/>
                </Button>
            </SheetTrigger>

            <SheetContent>
                <SheetHeader>
                    <SheetTitle className='text-center text-muted-foreground'>Menu</SheetTitle>
                </SheetHeader>

                <div className='flex flex-col p-5 mt-10 gap-4'>   

                    <Link href={'/'} className='text-center underline'>
                        Home
                    </Link>

                    <SignedOut>

                        <SignInButton mode='modal'>

                            <Button
                                asChild
                                variant={'default'}
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
                            >Dashboard</Button>

                        <SignOutButton>
                            <Button
                                asChild
                                variant={'outline'}
                            >
                                <span>
                                    Sign Out
                                </span>
                            </Button>
                        </SignOutButton>
                    </SignedIn>
                </div>
            </SheetContent>
        </Sheet>

    </div>
  )
}

export default MobileNavbar
