"use server"

import prisma from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server"

export async function createUserBasedOnClerkId() {
    try {
        const {userId: clerkId} = await auth()
        const user = await currentUser()

        if (!clerkId) return;

        const isCurrentUserExists = await prisma.user.findUnique(
            {
                where : {
                    clerkId,
                }
            }
        )

        if (isCurrentUserExists) return isCurrentUserExists;

        else {

            await prisma.user.create(
                {
                    data : {
                        clerkId,
                        email: user?.emailAddresses[0].emailAddress ?? "",
                        username: user?.emailAddresses[0].emailAddress.split('@')[0],
                        name: user?.fullName ?? "",
                        
                    }
                }
            )
        }

    } catch (error) {
        console.log('Error Creating User In Db', error);
        throw new Error("Error Creating New User In Db");
    }
}

export async function getCurrentUserDbId() {
    try {
        const {userId: clerkId} = await auth();

        if (!clerkId) return;

        const currentUser = await prisma.user.findUnique(
            {
                where : {
                    clerkId
                }
            }
        )

        const currentUserDbId = currentUser?.id

        if (!currentUserDbId) return;

        return currentUserDbId;

    } catch (error) {
        console.log('Error Getting Current User Db Id');
        throw new Error('Error Getting Current User Db Id')
    }
}