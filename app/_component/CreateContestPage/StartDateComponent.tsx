
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { CalendarIcon } from "lucide-react"
import { format, addDays } from "date-fns"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useContestData } from "@/store/state"


export function StartDateComponent() {

    const { startDate, setContestData} = useContestData()

    return(
        <div className="space-y-2">
          <Label htmlFor="startDate" className="text-black">Start Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="startDate"
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal border-gray-300 hover:bg-yellow-50 hover:text-black",
                  !startDate && "text-gray-500"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={(date) => date && setContestData("startDate", date)}
                disabled={(date) => date < addDays(new Date(), 2)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
    )
}