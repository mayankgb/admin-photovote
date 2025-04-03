"use client"

import { approveCandidate, getParticipant, rejectCandidate } from "@/app/action/contest";
import { useContestId } from "@/store/state"
import { useEffect, useState } from "react"
import { toast } from "sonner";
import Image from "next/image";

interface Data {
    id: string,
    upvote: number;
    user: {
        name: string | null;
        image: string | null;
        email: string | null;
        branch: {
            name: string;
        } | null;
    };
}

export default function ParticipantList() {
    const { contestId } = useContestId()
    const [participant, setParticipant] = useState<Data[]>([])
    const [error, setIsError] = useState("")
    const [isPageLoading, setIsPageLoading] = useState(false)
    const [isApproveAllLoading, setIsApproveAllLoading] = useState(false)

    useEffect(() => {
        try {
            async function main() {
                setIsPageLoading(true)
                if (!contestId) {
                    return
                }
                const response = await getParticipant(contestId)

                if (response) {
                    setParticipant(response)
                    setIsPageLoading(false)
                    setIsError("")
                    return
                }
            }
            main()
        } catch (e) {
            console.log(e)
            setIsPageLoading(true)
            setIsError("Error while fetching the data")
            return
        }
    }, [contestId])

    async function handleClick(value: "APPROVE" | "REJECT", participantId: string) {
        const toastId = toast.loading(value === "APPROVE" ? "Approving candidate..." : "Rejecting candidate...")
        try {
            if (!contestId) {
                toast.dismiss(toastId)
                toast.error("No contest ID was provided")
                return
            }

            if (value === "APPROVE") {
                await approveCandidate(participantId, contestId)
                toast.dismiss(toastId)
                toast.success("Candidate approved successfully")
                
                // Update the local state to reflect changes
                setParticipant(prev => 
                    prev.filter(p => p.id !== participantId)
                )
                return
            }
            
            await rejectCandidate(participantId, contestId)
            toast.dismiss(toastId)
            toast.success("Candidate rejected successfully")
            
            // Update the local state to reflect changes
            setParticipant(prev => 
                prev.filter(p => p.id !== participantId)
            )
            return
        } catch (e) {
            console.log(e)
            toast.dismiss(toastId)
            toast.error("Something went wrong. Please try again.")
            return
        }
    }

    async function handleApproveAll() {
        if (!contestId || participant.length === 0) {
            toast.error("No participants to approve")
            return
        }

        setIsApproveAllLoading(true)
        const toastId = toast.loading(`Approving all ${participant.length} participants...`)
        
        try {
            // Process all approvals in sequence
            for (const user of participant) {
                await approveCandidate(user.id, contestId)
            }
            
            toast.dismiss(toastId)
            toast.success(`Successfully approved all ${participant.length} participants`)
            
            // Clear the list after approving all
            setParticipant([])
        } catch (e) {
            console.log(e)
            toast.dismiss(toastId)
            toast.error("Failed to approve all participants")
        } finally {
            setIsApproveAllLoading(false)
        }
    }

    if (error) {
        return (
            <div className="flex items-center justify-center p-8 bg-white border border-gray-200 rounded-lg shadow">
                <div className="text-black font-medium">{error}</div>
            </div>
        )
    }

    if (isPageLoading) {
        return (
            <div className="flex items-center justify-center p-8 bg-white border border-gray-200 rounded-lg shadow">
                <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
                    <div className="text-black font-medium">Loading participants...</div>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-4 grow h-full flex flex-col ">
            {/* Header with Approve All button */}
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-black">Contest Participants</h2>
                {participant && participant.length > 0 && (
                    <button 
                        onClick={handleApproveAll}
                        disabled={isApproveAllLoading}
                        className={`px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-300 transition-colors ${isApproveAllLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                    >
                        {isApproveAllLoading ? 'Processing...' : `Approve All (${participant.length})`}
                    </button>
                )}
            </div>

            {/* Participant cards */}
            <div className="grow h-full">
                {!participant || participant.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-8 text-black">
                        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="text-lg font-medium">No participants yet</div>
                        <p className="text-gray-500 mt-1 text-sm">No users have participated in this contest</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                        {participant.map((user) => (
                            <div key={user.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow transition-shadow">
                                {/* User image at the top */}
                                <div className="w-full h-32 bg-gray-100 relative">
                                    {user.user.image ? (
                                        <Image 
                                            src={"https://d12hk4zd0jmtng.cloudfront.net/path/Mayank%202-12d88b88-85b2-40e5-8fb1-b9d314c58a43"} 
                                            alt={user.user.name || "User"} 
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-yellow-100 flex items-center justify-center">
                                            <span className="text-yellow-800 font-bold text-4xl">
                                                {user.user.name?.charAt(0) || "U"}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                
                                {/* User info and buttons */}
                                <div className="p-4">
                                    <div className="mb-2">
                                        <div className="font-medium text-black text-lg">{user.user.name || "Anonymous User"}</div>
                                        <div className="text-sm text-gray-500">
                                            {user.user.branch?.name ? `${user.user.branch.name}` : "No branch"} 
                                        </div>
                                        <div className="flex items-center mt-1 text-sm">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                            </svg>
                                            <span>{user.upvote} {user.upvote === 1 ? "upvote" : "upvotes"}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-4 flex space-x-2">
                                        <button 
                                            onClick={() => handleClick("APPROVE", user.id)}
                                            className="flex-1 px-3 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-300 transition-colors text-sm"
                                        >
                                            Approve
                                        </button>
                                        <button 
                                            onClick={() => handleClick("REJECT", user.id)}
                                            className="flex-1 px-3 py-2 bg-white hover:bg-gray-100 text-black border border-gray-300 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors text-sm"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}