"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Plus, Users, CheckCircle, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"


export default function QuickActions () {


    const router = useRouter()

    const handleClick  = async (value: ("NEW" | "START" | "APPROVE" | "END" )) => {
       switch (value) {
        case "APPROVE":
            router.push("/approvecandidate")
            break;
        case "END":
            router.push("/endcontest")
            break;
        case "NEW":
            router.push("/createcontest")
            break;
        case "START":
            router.push("/startcontest")
            break;
       }
       return

    }

    return (
        <Card className="md:col-span-2 lg:col-span-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-2">
            <Button onClick={() => handleClick("NEW")} variant="outline" className="flex flex-col h-20 items-center justify-center gap-1">
              <Plus size={18} />
              <span className="text-xs">New Contest</span>
            </Button>
            <Button onClick={() => handleClick("START")} variant="outline" className="flex flex-col h-20 items-center justify-center gap-1">
              <Users size={18} />
              <span className="text-xs">Start Contest</span>
            </Button>
            <Button onClick={() => handleClick("APPROVE")} variant="outline" className="flex flex-col h-20 items-center justify-center gap-1">
              <CheckCircle size={18} />
              <span className="text-xs">Approve Entries</span>
            </Button>
            <Button onClick={() => handleClick("END")} variant="outline" className="flex flex-col h-20 items-center justify-center gap-1">
              <BarChart3 size={18} />
              <span className="text-xs">End contest</span>
            </Button>
          </div>
        </CardContent>
      </Card>

    )
}