"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { CalendarDays, StopCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { getOngoingContestStats } from "@/app/action/dashboard"
import axios from "axios"
import { toast } from "sonner"
import { useSession } from "next-auth/react"

interface ActiveContestStats {
    id: string,
    name: string,
    participants: number,
    endDate: Date

}

export function ActiveContest(){

    const [activeContestStats, setActiveContestStats] = useState<ActiveContestStats[]>()
    const [contestId, setContestId] = useState("")

    const session = useSession()

    useEffect(() => {

        try{

            async function main() {
                const data = await getOngoingContestStats()
                if (data) {
                    const newStats: ActiveContestStats[] = data.map((d) => {
                        const newData: ActiveContestStats = {
                            id: d.id,
                            name: d.name,
                            participants: d._count.participant,
                            endDate: d.endDate
                        }
                        return newData
                    })

                    setActiveContestStats(newStats)
                    return
                }
            }
            main()

        }catch(e) {
            console.log(e)
            return
        }

    },[])

    const handleEndButton = async (contestId: string) => {
        const toastId = toast.loading("Ending...")
        try {
            setContestId(contestId)
            const data = await axios.post(`${process.env.NEXT_PUBILC_BACKEND_URL}/admin/endcontest`, {
                contestId
            }, {
                headers: {
                    Authorization: session.data?.user.jwtToken
                }
            })

            if (data.data.message) {
                setActiveContestStats((prev) => prev?.filter((value) => value.id === data.data.message))
                toast.dismiss(toastId)
                toast.success("Ended")
                return
            }
            toast.dismiss(toastId)
            toast.error("something is up the server")
            setContestId('')


        } catch (e) {
            console.log(e)
            toast.dismiss(toastId)
            toast.error("something went wrong")
            setContestId("")
            return
        }
    }


    return(
        <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Active Contests</CardTitle>
          <CardDescription>Manage your currently running contests</CardDescription>
        </CardHeader>
        <CardContent>
          {activeContestStats &&( activeContestStats.length > 0) ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left font-medium p-2">Contest Name</th>
                    <th className="text-center font-medium p-2">Participants</th>
                    <th className="text-center font-medium p-2">End Date</th>
                    <th className="text-right font-medium p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {activeContestStats.map((contest) => (
                    <tr key={contest.id} className="border-b hover:bg-gray-50">
                      <td className="p-2">
                        <span className="font-medium">{contest.name}</span>
                      </td>
                      <td className="p-2 text-center">{contest.participants}</td>
                      <td className="p-2 text-center text-sm">
                        <div className="flex items-center justify-center gap-1">
                          <CalendarDays size={14} />
                          {contest.endDate.toISOString().split("T")[0]}
                        </div>
                      </td>
                      <td className="p-2 text-right">
                        <div className="flex justify-end gap-2">
                          <Button disabled={contestId === contest.id} onClick={() => handleEndButton(contest.id)} variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                            <StopCircle size={16} className="mr-1" /> End
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No active contests at the moment. Create a new contest to get started.
            </div>
          )}
        </CardContent>
      </Card>
    )

}