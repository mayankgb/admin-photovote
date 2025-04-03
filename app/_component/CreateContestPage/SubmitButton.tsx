import { createContest } from "@/app/action/contest";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { useContestData } from "@/store/state";
import { useState } from "react";
import { toast } from "sonner";

export function SubmitButton() {

    const {contestName, endDate, startDate, category} = useContestData()

    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async() => {
        const toastId = toast.loading("creating")
        try{
            if (!contestName || !endDate || !startDate || !category) {
                toast.dismiss(toastId)
                return
            }
            setIsSubmitting(true)
    
            const response = await createContest(contestName, startDate, endDate, category)

            if (response?.id) {
                toast.dismiss(toastId)
                toast.success("contest created")
            }

            setIsSubmitting(false)
            return
        }catch(e){
            console.log(e)
            toast.error("something went wrong")
            toast.dismiss(toastId)
            setIsSubmitting(false)
            return
        }

    }

    return(
        <CardFooter className="bg-gray-50">
        <Button 
          onClick={handleSubmit}
          disabled={isSubmitting || (!contestName || !endDate || !startDate || !category)}
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-medium"
        >
          {isSubmitting ? "Creating Contest..." : "Create Contest"}
        </Button>
      </CardFooter>
    )
}