"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "../lib/auth"
import { prisma } from "@/client"


export async function getCreatedContest() {

    try {
        const session = await getServerSession(authOptions)

        if (!session || !session.user.instituteId || !session.user.id) {
            return
        }

        if (session.user.role === "ADMIN") {

            const response = await prisma.contest.findMany({
                where: {
                    instituteId: session.user.instituteId,
                    adminId: session.user.id,
                    status: "CREATED"
                },
                select: {
                    id: true,
                    name: true,
                    category: true,
                    endDate: true,
                    _count: {select: {participant: true}}
                }
            })

            if (response) {
                return response
            }
            return

        } else if (session.user.role === "OWNER") {
            const response = await prisma.contest.findMany({
                where: {
                    instituteId: session.user.instituteId,
                    status: "CREATED"
                },
                select: {
                    id: true,
                    name: true,
                    category: true,
                    endDate: true,
                    _count: {select: {participant: {where:{status: "APPROVE"}}}}
                }
            })

            if (response) {
                return response
            }
            return
        }
        return


    } catch (e) {
        console.log(e)
        return
    }
}


export async function getParticipant(contestId: string) {
    try {

        const session = await getServerSession(authOptions)


        if (!session || !session.user) {
            return
        }

        const response = await prisma.participant.findMany({
            where: {
                contestId: contestId,
                status: "PENDING",
                contest:{
                    adminId: session.user.id
                }
            },
            select: {
                upvote: true,
                id: true,
                user: {
                    select: {
                        name: true, 
                        image: true, 
                        email: true, 
                        branch: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            }
        })

        if (response) {
            return response
        }

        return 
    } catch (e) {
        console.log(e)
        return

    }
}


export async function approveCandidate(candidateId: string, contestId: string) {

    try {

        const response = await prisma.participant.update({
            where: {
                id: candidateId,
                contestId: contestId
            },
            data: {
                status: "APPROVE"
            },
            select: {
                id: true
            }
        })
        
        if (response && response.id) {
            return response    
        }
        return
        

    }catch(e) {
        console.log(e)
        return
    }

}

export async function rejectCandidate(candidateId: string, contestId: string) {

    try {

        const response = await prisma.participant.update({
            where: {
                id: candidateId,
                contestId: contestId
            },
            data: {
                status: "CANCELLED"
            },
            select: {
                id: true
            }
        })
        
        if (response && response.id) {
            return response    
        }
        return
        

    }catch(e) {
        console.log(e)
        return
    }

}

export async function approveAll(contestId: string) {
    try {

        const response = await prisma.participant.updateMany({
            where: {
                contestId: contestId,
                status: "PENDING"
            },
            data:{
                status: "APPROVE"
            },
        })

        return response.count

    }catch(e) {
        console.log(e)
        return
    }
}


export async function createContest(contestName: string, startDate: Date, endDate: Date, category:string) {
    try{

        const session = await getServerSession(authOptions)

        if (!session || !session.user || !session.user.instituteId) {
            return
        }

        const response = await prisma.contest.create({
            data: {
                instituteId: session.user.instituteId,
                name: contestName, 
                endDate: endDate,
                startDate: startDate,
                category: category === "MALE" ? "MALE" : "FEMALE",
                status: "CREATED",
                adminId: session.user.id
            },
            select:{
                id: true
            }
        })

        return response

    }catch(e) {
        console.log(e)
        return
    }
}


export async function getStartedContest() {

    try {
        const session = await getServerSession(authOptions)

        if (!session || !session.user.instituteId || !session.user.id) {
            return
        }

        if (session.user.role === "ADMIN") {

            const response = await prisma.contest.findMany({
                where: {
                    instituteId: session.user.instituteId,
                    adminId: session.user.id,
                    status: "STARTED"
                },
                select: {
                    id: true,
                    name: true,
                    category: true,
                    endDate: true
                }
            })

            if (response) {
                return response
            }
            return

        } else if (session.user.role === "OWNER") {
            const response = await prisma.contest.findMany({
                where: {
                    instituteId: session.user.instituteId,
                    status: "STARTED"
                },
                select: {
                    id: true,
                    name: true,
                    category: true,
                    endDate: true
                }
            })

            if (response) {
                return response
            }
            return
        }
        return


    } catch (e) {
        console.log(e)
        return
    }
}

export async function deleteContest(contestId: string) {
    try{

        const session = await getServerSession(authOptions)

        if (!session || !session.user.instituteId) {
            return {
                message: "unauthorised access",
                status: 401
            }
        }

        const deleteContestId = await prisma.contest.delete({
            where: {
                id: contestId, 
                status: "CREATED",
                adminId: session.user.id,
                instituteId: session.user.instituteId
            },
            select:{
                id: true
            }
        })

        if (deleteContestId) {
            return {
                message: "contest deleted successfully",
                status: 200
            }
        }

        return {
            message: "contest not found with this id",
            status: 400
        }
        
    }catch(e){
        console.log(e)
        return {
            message: "something went wrong",
            status: 500
        }
    }
}