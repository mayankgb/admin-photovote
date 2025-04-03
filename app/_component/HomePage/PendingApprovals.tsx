"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { getPendingApprovals } from "@/app/action/dashboard";
import { toast } from "sonner";
import { approveCandidate, rejectCandidate } from "@/app/action/contest";

interface PendingApprovals {
    id: string,
    userName: string | null, 
    contestName: string,
    contestId: string
}

export default function PendingApprovals() {

    const [pendingApprovals , setPendingApprovals] = useState<PendingApprovals[]>()

    useEffect(() => {
        try{

            async function main() {
                const resposne = await getPendingApprovals()

                console.log(resposne)

                if (resposne) {
                    const newApprovals: PendingApprovals[] = resposne.map((user) => {
                        const newParticipant: PendingApprovals = {
                            id: user.id,
                            contestName: user.contest.name,
                            userName: user.user.name,
                            contestId: user.contest.id
                        }
                        return newParticipant
                    })
                    setPendingApprovals(newApprovals)
                }                
            }
            main()

        }catch(e) {
            console.log(e)
            return
        }
    },[])

    const handleClick = async (action: "APPROVE" | "REJECT", candidateId: string, contestId: string) => {
        const toastId  = toast.loading(action === "APPROVE" ? "Approving..." : "Rejecting...")
        try{

            if(action === "APPROVE") {
                const response = await approveCandidate(candidateId, contestId)

                if (response) {
                    toast.dismiss(toastId)
                    toast.success("approved")
                    return
                }

                toast.dismiss(toastId)
                toast.error("something went wrong")
                return
            
            }else {
                const response = await rejectCandidate(candidateId, contestId)

                if (response) {
                    toast.dismiss(toastId)
                    toast.success("Rejected")
                    return
                }
                toast.dismiss(toastId)
                toast.error("something went wrong")
                return
            }

        }catch(e){
            console.log(e)
            toast.dismiss(toastId)
            toast.error("Something went wrong")
            return
        }
    } 


    return (
        <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Pending Approvals</CardTitle>
          <CardDescription>Users waiting for approval to participate</CardDescription>
        </CardHeader>
        <CardContent>
          {pendingApprovals && pendingApprovals.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left font-medium p-2">Username</th>
                    <th className="text-center font-medium p-2">Contest</th>
                    <th className="text-right font-medium p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingApprovals.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td className="p-2">
                        <span className="font-medium">{user.userName}</span>
                      </td>
                      <td className="p-2 text-center">{user.contestName}</td>
                      <td className="p-2 text-right">
                        <div className="flex justify-end gap-2">
                          <Button onClick={() => handleClick("APPROVE", user.id, user.contestId)} size="sm" className="bg-green-600 hover:bg-green-700">
                            <CheckCircle size={16} className="mr-1" /> Approve
                          </Button>
                          <Button onClick={() => handleClick("REJECT", user.id, user.contestId)} variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                            Reject
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
              No pending approvals at this time.
            </div>
          )}
        </CardContent>
      </Card>
    )
}