"use client"

import { useUserState } from "@/store/state"
import ParticipantList from "./ParticipantList"
import { ContestList } from "./ContestList"


export function ApprovePage() {

    const { isTrue } = useUserState()

    return (
        <div className="pt-4 h-full w-full flex flex-col grow pl-3 pr-3">
            {isTrue ? <ParticipantList/> : <ContestList/>}
        </div>
    )
}