"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SubmitButton } from "@/app/_component/CreateContestPage/SubmitButton"
import { Category } from "@/app/_component/CreateContestPage/Category"
import { EndDateComponent } from "@/app/_component/CreateContestPage/EndDateComponent"
import { StartDateComponent } from "@/app/_component/CreateContestPage/StartDateComponent"
import { ContestName } from "@/app/_component/CreateContestPage/ContestName"


export default function ContestForm() {

  return (
    <div className="w-full pt-3"> 
    <Card className="md:w-[50%] w-[80%]  max-w-md mx-auto bg-white shadow-lg">
      <CardHeader className=" text-black">
        <CardTitle className="text-2xl">Create New Contest</CardTitle>
        <CardDescription className="text-black text-opacity-75">Fill in the details to create a new contest</CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {/* Contest Name */}
        <ContestName/>

        {/* Start Date */}
        <StartDateComponent/>

        {/* End Date */}
        <EndDateComponent/>

        {/* Category */}
        <Category/>
      </CardContent>
      <SubmitButton/>
    </Card>
    </div>
  )
}