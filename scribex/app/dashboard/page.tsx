import { ChartBarForComparision } from '@/components/dashboard/ChartBarForComparisionCreatedAndUpdated';
import { ChartBarForNoteActivity } from '@/components/dashboard/ChartBarForNoteActivity';
import { BasicEditorExample } from '@/components/dashboard/TextEditorComponent';
import { SectionCards } from '@/components/section-cards';
import { createUserBasedOnClerkId } from '@/server/actions/user.action';
import { auth } from '@clerk/nextjs/server';
import React from 'react'

const Page = async () => {

    const {userId} = await auth()
    
    if (userId) await createUserBasedOnClerkId();

    return (
        <div className="w-full">
            
            {/* <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                <div className="bg-muted/50 aspect-video rounded-xl" />
                <div className="bg-muted/50 aspect-video rounded-xl" />
                <div className="bg-muted/50 aspect-video rounded-xl" />
            </div>
            <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" /> */}
            <SectionCards/>

            <div className='grid grid-cols-1 md:grid-cols-2 mt-5 gap-4'>
                <ChartBarForNoteActivity/>
                <ChartBarForComparision/>
            </div>

            <BasicEditorExample/>
        </div>
    )
}

export default Page
