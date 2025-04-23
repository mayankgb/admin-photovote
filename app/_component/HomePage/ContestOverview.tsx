"use client"

import { getOverView } from "@/app/action/dashboard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";

interface Data {
    total: number,
    active: number,
    pending: number, 
    completed: number
    
}

export default function ContestOverview() {

    const [contestData, setContestData] = useState<Data>({
      total: 0,
      active: 0,
      completed:0,
      pending: 0
    })

    useEffect(() => {

        try{

            async function main() {
                const data = await getOverView()
                console.log(data)

                if (data) {
                  const newData: Data = {
                    total: data.totalCount,
                    pending: data.pendingCount,
                    completed: data.endCount,
                    active: data.activeCount
                  }

                  setContestData(newData)
                }

                return
            }

            main()
        }catch(e) {
            console.log(e)
            return
        }

    },[])

    return (
        <Card>
          <CardHeader className="pb-2">sds
            <CardTitle className="text-lg font-medium">Contest Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm">Total</span>
                <span className="text-2xl font-bold">{contestData.total}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm">Active</span>
                <span className="text-2xl font-bold text-green-600">{contestData.active}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm">Completed</span>
                <span className="text-2xl font-bold text-blue-600">{contestData.completed}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm">Pending</span>
                <span className="text-2xl font-bold text-gray-600">{contestData.pending}</span>
              </div>
            </div>
          </CardContent>
        </Card>
    )
}