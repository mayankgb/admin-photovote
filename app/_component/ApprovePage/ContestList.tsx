'use client'

import { useContestId , useUserState} from "@/store/state"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { getCreatedContest } from "@/app/action/contest"
import { $Enums } from "@prisma/client"
import { Loader2 } from "lucide-react"

interface Data {
    id: string,
    name: string,
    category: $Enums.Category,
    endDate: Date
}

export function ContestList() {
    const session = useSession()
    const [response, setResponse] = useState<Data[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const { isTrue, setIsTrue} = useUserState()
    const {setContestId} = useContestId()


    useEffect(() => {
        try {
            if (!session.data) {
                setIsLoading(false)
                return
            }
            
            const main = async () => {
                setIsLoading(true)
                const data = await getCreatedContest()
                console.log("this is the contest data", data)

                if (data) {
                    setResponse(data)
                }
                setIsLoading(false)
            }

            main()
        } catch(e) {
            console.log(e)
            setIsLoading(false)
            return
        }
    }, [])

    function handleClick(contestIds: string) {
        console.log("done")
        setContestId(contestIds)
        setIsTrue()
        console.log(isTrue)
    }

    return (
        <div className="">
            {isLoading ? (
                <div className="flex items-center justify-center py-16">
                    <Loader2 className="w-10 h-10 text-yellow-400 animate-spin" />
                    <span className="ml-3 text-gray-600 font-medium">Loading contests...</span>
                </div>
            ) : (response && (response.length > 0)) ? (
                <div className="grid gap-6 md:grid-cols-2 mt-4 lg:grid-cols-3">
                    {response.map((contest) => (
                        <div key={contest.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow">
                            <div className="p-5">
                                <div className="inline-block px-3 py-1 mb-3 text-xs font-medium rounded-full bg-gray-100">
                                    {contest.category}
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{contest.name}</h3>
                                <p className="text-gray-500 text-sm mb-4">
                                    Ends on {new Date(contest.endDate).toLocaleDateString("en-GB", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric"
                                    })}
                                </p>
                                <div
                                    onClick={() => handleClick(contest.id)}
                                    className="block cursor-pointer w-full text-center bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-2 px-4 rounded-md transition-colors"
                                >
                                    see candidates
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-gray-50 rounded-lg py-8 w-full flex flex-col items-center justify-center space-y-4">
                    <h3 className="text-xl font-medium mb-2">No contests found</h3>
                    <p className="text-gray-600 mb-6">There are no active contests for your institute.</p>
                </div>
            )}
        </div>
    )
}