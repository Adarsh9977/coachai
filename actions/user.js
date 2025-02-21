"use server"

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server"
import { generateAIInsights } from "./dashboard";

export async function updateUser(data){
    const { userId } = await auth()
    if(!userId)throw new Error("Unauthorized");

    const user = await db.user.findUnique({
        where: {
            clerkUserId: userId,
        },
    })

    if(!user) throw new Error("User not found");

    try {
        const result = await db.$transaction(async (tx) => {
            let industryInsight = await tx.industryInsight.findUnique({
                where: {
                    industry: data.industry
                }
            })

            if(!industryInsight){
                const insights = await generateAIInsights(data.industry);
                
                industryInsight = await db.industryInsight.create({
                    data: {
                        industry: data.industry,
                        ...insights,
                        nextUpdate: new Date(Date.now()+ 7 * 24 * 60 * 60 * 1000)
                    }
                });
            };

            const updatedUser = await tx.user.update({
                where:{
                    id: user.id,
                },
                data:{
                    industry: data.industry,
                    experience: data.experience,
                    bio: data.bio,
                    skils: data.skils,
                },
            });
            return { updatedUser, industryInsight}
        },{
            timeout: 10000,
        });

        return {success:true, ...result};
    } catch (error) {
        console.error("Error while updating user and industry", error.message);
        throw new Error("Failed to update profile")
    }
    
}

export async function getUserOnboardingStatus(){
    const { userId } = await auth()
    if(!userId)throw new Error("Unauthorized");

    const user = await db.user.findUnique({
        where: {
            clerkUserId: userId,
        },
    })

    if(!user) throw new Error("User not found");

    try {
        const newUser = await db.user.findUnique({
            where:{
                clerkUserId: userId
            },
            select:{
                industry: true,
            }
        });

        return{
            isOnboarded: !!newUser?.industry,
        }
    } catch (error) {
        console.error("Error ckecking onboarding status:", error.message);
        throw new Error("Failed to check onboarding status");
    }

}