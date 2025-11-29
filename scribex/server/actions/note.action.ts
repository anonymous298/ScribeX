"use server"

import prisma from "@/lib/prisma";
import { getCurrentUserDbId } from "./user.action"
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";

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
                    createdAt : "desc"
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

export async function updateNote(noteId: string, formData: FormData) {
    try {
        const {userId} = await auth();
        if (!userId) return;

        if (!noteId) return;

        const title: string = formData.get('title') as string;
        const content: string = formData.get('content') as string;

        const updatedData = {
            title,
            content
        }

        await prisma.note.update(
            {
                where : {
                    id : noteId
                },

                data : updatedData
            }
        )

        return {success : true}

    } catch (error) {
        console.log("Error updating the note");
        return {success : false}
    }
}