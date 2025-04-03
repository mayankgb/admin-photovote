"use client"

import { getParticipantStats } from "@/app/action/dashboard"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useEffect, useState } from "react"


interface ParticipantStats {
    totalParticipants: number,
    pendingApprovals: number
}


export default function Participant() {

    const [participantStats, setParticipantStats] = useState<ParticipantStats>({
        totalParticipants: 0,
        pendingApprovals: 0
    })


    useEffect(() => {

        try{

            const main = async () => {
                const data = await getParticipantStats()

                if (data) {
                    const newStats: ParticipantStats = {
                        totalParticipants: data.totalParticipant,
                        pendingApprovals: data.pendingParticipant
                    }

                    setParticipantStats(newStats)
                }
                return
            }
            main()

        }catch(e) {
            console.log(e)
            return
        }

    },[])

    return(
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Participant Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm">Total Participants</span>
                <span className="text-2xl font-bold">{participantStats.totalParticipants}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm">Pending Approvals</span>
                <span className="text-2xl font-bold text-amber-600">{participantStats.pendingApprovals}</span>
              </div>
            </div>
          </CardContent>
        </Card>
    )
}