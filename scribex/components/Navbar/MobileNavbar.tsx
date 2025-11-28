'use client'

import { MenuIcon } from 'lucide-react'
import React, { useState } from 'react'
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

    const [showMobileMenu, setShowMobileMenu] = useState(false)
    
  return (
    <div className='sm:hidden'>
        <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
            <SheetTrigger asChild>
                <Button variant={'outline'}>
                    <MenuIcon/>
                </Button>
            </SheetTrigger>

            <SheetContent className='bg-white/30 dark:bg-slate-900/30 backdrop-blur-lg'>
                <SheetHeader>
                    <SheetTitle className='text-center text-muted-foreground'>Menu</SheetTitle>
                </SheetHeader>

                <div className='flex flex-col p-5 mt-10 gap-4'>   

                    <Link href={'/'} className='text-center underline' onClick={() => setShowMobileMenu(false)}>
                        Home
                    </Link>

                    <SignedOut>

                        <SignInButton mode='modal'>

                            <Button
                                asChild
                                variant={'default'}
                                onClick={() => setShowMobileMenu(false)}
                            >
                                <span className='bg-indigo-400 text-primary hover:bg-violet-400 cursor-pointer trnasition-all w-full'>
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
                                <Link 
                                    href={'/dashboard'}
                                    onClick={() => setShowMobileMenu(false)}
                                    className='w-full'
                                >
                                    Dashboard
                                </Link>
                        </Button>

                        <SignOutButton>
                            <Button
                                asChild
                                variant={'outline'}
                                onClick={() => setShowMobileMenu(false)}
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
