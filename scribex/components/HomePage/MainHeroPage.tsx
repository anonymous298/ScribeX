import React from 'react'
// import { TextHoverEffect } from '../ui/text-hover-effect'
import Image from 'next/image'
import { FlipWords } from '../ui/flip-words'
import { TypewriterEffect } from '../ui/typewriter-effect'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import { motion } from 'motion/react'


const MainHeroPage = () => {

  return (
    <div className='w-full p-10'>
      <div className='grid grid-cols-1 md:grid-cols-10 min-h-screen grid-rows-5'>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}          // Starting state
          animate={{ opacity: 1, y: 0 }}           // Animate to this
          transition={{
            duration: 0.6,
            ease: "easeOut",
          }}
          id="leftSideHeroContent" 
          className=' md:col-span-5 self-center items-center row-span-4'
        >

          <div className='flex flex-col gap-3'>

            <div className='flex text-start'>
              <h2 className='text-4xl sm:text-5xl'>Store</h2>

              <FlipWords words={['Ideas', 'Creativity', 'Concepts']} duration={2000} className='text-4xl sm:text-5xl' />
            </div>

            <div className='flex'>
              {/* <h2 className='text-4xl'>Be</h2> */}

              {/* <FlipWords words={['Productive', 'Creative', 'Aware']} duration={5000} className='text-4xl' /> */}
              <TypewriterEffect words={[{text: 'Be'}, {text : 'Productive'}]} className='max-sm:text-4xl'/>
            </div>

            <p className="mt-4 text-lg text-muted-foreground max-w-md">
              Capture your thoughts and organize your notes effortlessly.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              <span className="flex items-center gap-2 text-sm font-medium">
                ✓ Fast & Easy
              </span>
              <span className="flex items-center gap-2 text-sm font-medium">
                ✓ Secure & Private
              </span>
              <span className="flex items-center gap-2 text-sm font-medium">
                ✓ Access Anywhere
              </span>
            </div>


            <Link href={'/dashboard'} className="inline-block mt-5 max-w-sm relative  h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
              {/* Spinning gradient background */}
              <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />

              {/* Button content */}
              <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl transition-all duration-300
                hover:bg-purple-500/30 hover:backdrop-blur-5xl hover:shadow-[0_0_25px_rgba(179,136,255,0.8)]">
                Get Started
              </span>
            </Link>

            {/* <button className="p-[3px] relative sm:hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
              <div className="px-8 py-2  bg-black rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent">
                <Link href={'/dashboard'}>
                  Get Started
                </Link>
              </div>
            </button> */}

          </div>

        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}          // Starting state
          animate={{ opacity: 1, y: 0 }}           // Animate to this
          transition={{
            duration: 0.6,
            ease: "easeOut",
          }}
          id="rightSideHeroContent"
          className='relative hidden md:block md:col-span-5 md:row-span-4'
        >
          <Image
            src={'/undraw_landing-page_zc5e.svg'}
            alt='landing page'
            fill={true}
          />
        </motion.div >

      </div>
    </div>
  )
}

export default MainHeroPage
