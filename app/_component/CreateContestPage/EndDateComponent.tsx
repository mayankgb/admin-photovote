"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { CalendarIcon } from "lucide-react"
import { format, addDays } from "date-fns"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useContestData } from "@/store/state"


export function EndDateComponent() {

    const { endDate, startDate, setContestData} = useContestData()

    useEffect(() => {
        // If end date is before the minimum allowed (start date + 2 days)
        const minimumEndDate = addDays(startDate, 2)
        if (endDate < minimumEndDate) {
          setContestData("endDate", minimumEndDate)
        }
      }, [startDate])

    return(
        <div className="space-y-2">
          <Label htmlFor="endDate" className="text-black">End Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="endDate"
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal border-gray-300 hover:bg-yellow-50 hover:text-black",
                  !endDate && "text-gray-500"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={(date) => date && setContestData("endDate", new Date(date.setHours(0,0,0,0)))}
                disabled={(date) => date < addDays(startDate, 2)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
    )
}