"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "../lib/auth"
import { prisma } from "@/client"


export async function getOverView() {

    try{
        const session = await getServerSession(authOptions)
        if (!session || !session.user.instituteId) {
            return
        }

        const totalCount = await prisma.contest.count({
            where: {
                adminId: session.user.id,
                instituteId: session.user.instituteId
            }
        })
        
        const activeCount = await prisma.contest.count({
            where: {
                adminId: session.user.id,
                instituteId: session.user.instituteId,
                status: "STARTED"
            }
        })

        const endCount = await prisma.contest.count({
            where: {
                adminId: session.user.id,
                instituteId: session.user.instituteId,
                status: "ENDED"
            }
        })

        const pendingCount = await prisma.contest.count({
            where: {
                adminId: session.user.id,
                instituteId: session.user.instituteId,
                status: "CREATED"
            }
        })
        console.log(totalCount, activeCount, endCount, pendingCount)

        
            return {
                totalCount,
                activeCount,
                endCount,
                pendingCount
            }

    }catch(e){
        console.log(e)
        return

    }


}


export async function getParticipantStats() {
    try{

        const session = await getServerSession(authOptions)

        if (!session || !session.user.instituteId) {
            return
        }

        const allParticipant = await prisma.participant.count({
            where: {
                contest: {
                    instituteId: session.user.instituteId,
                    adminId: session.user.id
                }
            }
        })

        const pendingParticipant = await prisma.participant.count({
            where: {
                status: "PENDING",
                contest: {
                    instituteId: session.user.instituteId,
                    adminId: session.user.id
                }
            }
        })

        if (allParticipant || pendingParticipant) {
            return {
                totalParticipant: allParticipant,
                pendingParticipant: pendingParticipant
            }
        }

        return

    }catch(e) {
        console.log(e)
        return
    }
}

export async function getOngoingContestStats(){

    try{

        const session = await getServerSession(authOptions)

        if (!session || !session.user.instituteId) {
            return
        }

        const ongoingContest = await prisma.contest.findMany({
            where:{
                status:"STARTED",
                instituteId: session.user.instituteId,
                adminId: session.user.id
            },
            take: 3,
            select:{
                name: true, 
                _count : { select: { participant : { where: { status: "APPROVE" }}}},
                endDate: true,
                id: true
        }})

        if (ongoingContest) {
            return ongoingContest
        }
        
    }catch(e) {
        console.log(e)
        return
    }
}

export async function getPendingApprovals() {
    try{
        console.log("asdasdas")

        const session = await getServerSession(authOptions)

        console.log("hi theer")

        if (!session || !session.user.instituteId) {
            return
        }

        const data = await prisma.participant.findMany({
            where: {
                contest: {
                    status: "CREATED",
                    adminId: session.user.id,
                    instituteId: session.user.instituteId
                },
                status : "PENDING"
            },
            take: 3,
            select: {
                id: true, 
                contest: { select : { name :true , id: true}}, 
                user: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        })

        console.log("this is the data", data)

        if (data && data.length > 0) {
            return data
        }
        return

    }catch(e) {
        console.log(e)
        return
    }
}