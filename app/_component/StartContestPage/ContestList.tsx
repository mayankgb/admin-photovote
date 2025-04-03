'use client'

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { deleteContest, getCreatedContest } from "@/app/action/contest"
import { $Enums } from "@prisma/client"
import { Loader2, Calendar, Trash2 } from "lucide-react"
import { toast } from "sonner"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

interface Data {
    id: string,
    name: string,
    category: $Enums.Category,
    endDate: Date,
    participant:number
}

export function ContestList() {
    const session = useSession()
    const [response, setResponse] = useState<Data[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [processingIds, setProcessingIds] = useState<Set<string>>(new Set())

    useEffect(() => {
        try {
            if (!session.data) {
                setIsLoading(false)
                return
            }

            const fetchContests = async () => {
                setIsLoading(true)
                const data = await getCreatedContest()
                console.log("Contest data fetched:", data)

                if (data) {
                    const newData: Data[] = []

                    data.map((d) => {
                        const newContest:Data = {
                            name: d.name,
                            participant: d._count.participant,
                            category: d.category,
                            endDate: d.endDate,
                            id: d.id
                        }
                        newData.push(newContest)
                    })

                    setResponse(newData)

                }
                setIsLoading(false)
            }

            fetchContests()
        } catch (e) {
            console.error("Error fetching contests:", e)
            toast.error("Failed to load contests")
            setIsLoading(false)
        }
    }, [session.data])

    async function handleStart(contestId: string) {
        const toastId = toast.loading("Starting contest...")
        try {
            setProcessingIds(prev => new Set(prev).add(contestId))
            
            const { data } = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/startcontest`, {
                contestId
            }, {
                headers: {
                    Authorization: session.data?.user.jwtToken
                }
            })

            console.log("Start contest response:", data.message)

            if (data.message) {
                setResponse(prev => prev.filter(contest => contest.id !== contestId))
                toast.dismiss(toastId)
                toast.success("Contest started successfully")
            } else {
                toast.dismiss(toastId)
                toast.error("Failed to start contest")
            }
        } catch (e) {
            console.error("Error starting contest:", e)
            toast.dismiss(toastId)
            toast.error("Something went wrong while starting the contest")
        } finally {
            setProcessingIds(prev => {
                const updated = new Set(prev)
                updated.delete(contestId)
                return updated
            })
        }
    }

    async function handleDelete(contestId: string) {
        const toastId = toast.loading("Deleting contest...")
        try {
            setProcessingIds(prev => new Set(prev).add(contestId))
            const data = await deleteContest(contestId)

            if (data.status === 200) {
                setResponse(prev => prev.filter(contest => contest.id !== contestId))
                toast.dismiss(toastId)
                toast.success("Contest deleted successfully")
            } else {
                toast.dismiss(toastId)
                toast.error(data.message)
            }
        } catch (e) {
            console.error("Error deleting contest:", e)
            toast.dismiss(toastId)
            toast.error("Something went wrong while deleting the contest")
        } finally {
            setProcessingIds(prev => {
                const updated = new Set(prev)
                updated.delete(contestId)
                return updated
            })
        }
    }

    const getCategoryColor = (category: $Enums.Category) => {
        const colors: Record<string, string> = {
            PROGRAMMING: "bg-blue-100 text-blue-800",
            DESIGN: "bg-purple-100 text-purple-800",
            WRITING: "bg-green-100 text-green-800",
            QUIZ: "bg-amber-100 text-amber-800",
            OTHER: "bg-gray-100 text-gray-800"
        }
        return colors[category] || "bg-gray-100 text-gray-800"
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-16">
                <Loader2 className="w-10 h-10 text-yellow-400 animate-spin" />
                <span className="ml-3 text-gray-600 font-medium">Loading contests...</span>
            </div>
        )
    }

    if (!response || response.length === 0) {
        return (
            <Card className="w-full bg-gray-50 border-dashed border-2 border-gray-200">
                <CardContent className="pt-10 pb-10 flex flex-col items-center justify-center space-y-4">
                    <h3 className="text-xl font-medium mb-2">No contests found</h3>
                    <p className="text-gray-600">There are no active contests for your institute.</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="grid gap-6 md:grid-cols-2 mt-4 lg:grid-cols-3">
            {response.map((contest) => (
                <Card key={contest.id} className="overflow-hidden gap-0 hover:shadow-lg transition-all duration-300 border-gray-200">
                    <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                            <Badge className={`${getCategoryColor(contest.category)} font-medium`}>
                                {contest.category}
                            </Badge>
                        </div>
                        <h3 className="text-xl font-bold mt-2 line-clamp-1">{contest.name}</h3>
                    </CardHeader>
                    <CardContent className="pb-3">
                        <div>
                        <div className="flex items-center text-gray-600 mb-2">
                            <Calendar className="h-4 w-4 mr-2" />
                            <p className="text-sm">
                                Ends on {new Date(contest.endDate).toLocaleDateString("en-GB", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric"
                                })}
                            </p>
                        </div>
                        <div className="text-sm ">
                            Total Participant {contest.participant}
                        </div>
                        </div>
                    </CardContent>
                    <CardFooter className="grid grid-cols-2 gap-3 pt-0">
                        <Button
                            disabled={processingIds.has(contest.id)}
                            onClick={() => handleStart(contest.id)}
                            className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium transition-colors"
                        >
                            {processingIds.has(contest.id) ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : null}
                            Start
                        </Button>
                        <Button
                            disabled={processingIds.has(contest.id)}
                            onClick={() => handleDelete(contest.id)}
                            variant="destructive"
                            className="font-medium"
                        >
                            {processingIds.has(contest.id) ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                                <Trash2 className="h-4 w-4 mr-2" />
                            )}
                            Delete
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    )
}