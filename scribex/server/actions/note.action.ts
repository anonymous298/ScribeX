"use server"

import prisma from "@/lib/prisma";
import { getCurrentUserDbId } from "./user.action"
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { endOfMonth, startOfMonth } from "date-fns";

export async function createNote(title: string, content?: string) {
    try {
        const currentUserDbId = await getCurrentUserDbId();
        if (!currentUserDbId) return;
        console.log("Current user ID:", currentUserDbId);

        const data = await prisma.note.create(
            {
                data: {
                    title: title,
                    content: content ?? "",
                    author_id: currentUserDbId,
                }
            }
        )

        revalidatePath('/dashboard/notes')

        return { success: true, data }

    } catch (error) {
        console.log('Error creating post', error);
        // throw new Error("Error creating new posts")
        return { success: false }
    }
}

export async function getAllNotes() {
    try {
        const currentUserDbId = await getCurrentUserDbId();
        if (!currentUserDbId) return;

        const notes = await prisma.note.findMany(
            {
                where: {
                    author_id: currentUserDbId,
                },

                orderBy: {
                    createdAt: "desc"
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
                where: {
                    id: noteId
                }
            }
        )

        revalidatePath('/dashboard/notes')
        return { success: true };

    } catch (error) {
        console.log("Error deleting the note");
        return { success: false }
    }
}

export async function updateNote(noteId: string, formData: FormData) {
    try {
        const { userId } = await auth();
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
                where: {
                    id: noteId
                },

                data: updatedData
            }
        )

        return { success: true }

    } catch (error) {
        console.log("Error updating the note");
        return { success: false }
    }
}

export async function getTotalNotes() {
    try {
        const { userId: clerkId } = await auth()

        if (!clerkId) return;

        const noteCounts = await prisma.user.findUnique(
            {
                where: {
                    clerkId,
                },

                include: {
                    _count: {
                        select: {
                            notes: true
                        }
                    }
                }
            }
        )

        const totalNoteCounts = noteCounts?._count.notes

        if (!totalNoteCounts) return;

        return totalNoteCounts;

    } catch (error) {
        console.log('Error Collecting All Notes Count');
        throw new Error('Error Collecting All Notes Count')
    }
}

export async function getRecentlyUpdatedNotesCount() {
    try {
        const userId = await getCurrentUserDbId();
        if (!userId) return 0;

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const count = await prisma.note.count({
            where: {
                author_id: userId,
                AND: [
                    { updatedAt: { gte: sevenDaysAgo } }, // updated in last 7 days
                    { updatedAt: { gt: prisma.note.fields.createdAt } } // actually updated, not just created
                ]
            }
        });

        return count;

    } catch (error) {
        console.log("Error Getting Total Updated Notes Count");
        throw new Error("Error Getting Total Updated Notes Count");
    }
}

export async function getNotesPerMonth() {
    const userId = await getCurrentUserDbId();
    if (!userId) return [];

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const notes = await prisma.note.groupBy({
        by: ["createdAt"],
        where: {
            author_id: userId,
            createdAt: { gte: sixMonthsAgo },
        },
        _count: { createdAt: true },
    });

    return notes.map((n) => ({
        month: n.createdAt.toLocaleString("default", { month: "long" }),
        count: n._count.createdAt,
    }));
}


export async function getCreatedVsUpdatedNotesPerMonth() {
  try {
    const userId = await getCurrentUserDbId();
    if (!userId) return [];

    // Track last 6 months
    const months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      return {
        month: date.toLocaleString("default", { month: "long" }),
        date,
      };
    }).reverse();

    const results = [];

    for (const m of months) {
      const start = startOfMonth(m.date);
      const end = endOfMonth(m.date);

      // Count created notes in this month
      const createdCount = await prisma.note.count({
        where: {
          author_id: userId,
          createdAt: { gte: start, lte: end },
        },
      });

      // Fetch all notes updated in this month
      const notesUpdatedInMonth = await prisma.note.findMany({
        where: {
          author_id: userId,
          updatedAt: { gte: start, lte: end },
        },
        select: { createdAt: true, updatedAt: true },
      });

      // Count only notes updated after creation
      const updatedCount = notesUpdatedInMonth.filter(
        (note) => note.updatedAt > note.createdAt
      ).length;

      results.push({
        month: m.month,
        created: createdCount,
        updated: updatedCount,
      });
    }

    return results;
  } catch (error) {
    console.error(
      "Error fetching created vs updated notes per month:",
      error
    );
    throw new Error("Failed to fetch notes comparison data");
  }
}