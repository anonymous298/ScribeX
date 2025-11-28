"use server"

import prisma from "@/lib/prisma";
import { getCurrentUserDbId } from "./user.action"
import { revalidatePath } from "next/cache";

export async function createNote(title:string, content?: string) {
    try {
        const currentUserDbId = await getCurrentUserDbId();
        if (!currentUserDbId) return;
        console.log("Current user ID:", currentUserDbId);

        const data = await prisma.note.create(
            {
                data : {
                    title: title,
                    content: content ?? "",
                    author_id: currentUserDbId,
                }
            }
        )

        revalidatePath('/dashboard/notes')

        return {success : true, data}

    } catch (error) {
        console.log('Error creating post', error);
        // throw new Error("Error creating new posts")
        return {success : false}
    }
}

export async function getAllNotes() {
    try {
        const currentUserDbId = await getCurrentUserDbId();
        if (!currentUserDbId) return;

        const notes = await prisma.note.findMany(
            {
                where : {
                    author_id: currentUserDbId,
                },

                orderBy : {
                    createdAt : "asc"
                }
            }
        )

        if (notes.length === 0) return [];
        
        return notes

    } catch (error) {
        console.log("Error getting all notes", error);
        throw new Error('Error getting all posts')
    }
}

export async function deleteNote(noteId: string) {
    try {
        if (!noteId) return;

        await prisma.note.delete(
            {
                where : {
                    id: noteId
                }
            }
        )

        revalidatePath('/dashboard/notes')
        return {success : true};

    } catch (error) {
        console.log("Error deleting the note");
        return {success : false}
    }
}