"use client"

import CreateNoteButtonForMainPage from '@/components/dashboard/CreateNoteButtonForMainPage';
import { ExpandableCardDemo } from '@/components/dashboard/NoteCardComponent';
import { getAllNotes } from '@/server/actions/note.action';
import React, { useEffect, useState } from 'react'

type Note = {
  id: string;
  author_id: string;
  title: string;
  content: string | null;
  createdAt: Date;
  updatedAt: Date;
};


const Page = () => {
  
  const [notes, setNotes] = useState<Note[]>([]);

  // Fetch notes
    useEffect(() => {
      const fetchNotes = async () => {
  
        const allNotes = await getAllNotes();
  
        setNotes(allNotes ?? []);
      };
      fetchNotes();
    }, []);

  return (
    <div className='w-full min-h-[80vh]'>

      {/* {notes.length === 0 ? 
        <>
          <CreateNoteButtonForMainPage/>
        </>
        :
        <>
          <ExpandableCardDemo/>
        </>
      } */}
      <ExpandableCardDemo/>
    </div>
  )
}

export default Page
