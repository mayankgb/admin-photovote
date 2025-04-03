"use client"

import { Input } from "@/components/ui/input";
import { useContestData } from "@/store/state";
import { Label } from "@radix-ui/react-label";

export function ContestName() {

    const { contestName, setContestData } = useContestData()

    return (
        <div className="space-y-2">
            <Label htmlFor="contestName" className="text-black">Contest Name</Label>
            <Input
                id="contestName"
                placeholder="Enter contest name"
                value={contestName}
                onChange={(e) => setContestData("contestName", e.target.value)}
                className="border-gray-300 focus:border-yellow-400 focus:ring-yellow-400 text-black"
            />
        </div>
    )
}