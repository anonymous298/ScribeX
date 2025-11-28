"use client"

import { ExpandableCardDemo } from '@/components/dashboard/NoteCardComponent';
import { NoteCardSkeleton } from '@/components/dashboard/NoteCardSkeleton';
// import SpotlightCard from '@/components/SpotlightCard';
import { getAllNotes } from '@/server/actions/note.action'
import React, { useEffect, useState } from 'react'

type Note = {
  id: string;
  author_id: string;
  title: string;
  content: string | null;
  createdAt: Date;
  updatedAt: Date;
};

const page = () => {

  const [notes, setNotes] = useState<Note[]>([])

   // Fetch notes
    useEffect(() => {
      const fetchNotes = async () => {
        const allNotes = await getAllNotes();
        setNotes(allNotes ?? []);
      };
      fetchNotes();
    }, []);

  return (
    <div>
      {!!notes.length ? (
        <ExpandableCardDemo/>
      )
      :
      (
        <NoteCardSkeleton/>
      )}
    </div>
  )
}

export default page
