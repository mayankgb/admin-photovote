import { addDays } from "date-fns";
import { create } from "zustand";

export const useContestId = create<{ contestId: string, setContestId: (value: string) => void }>((set) => ({
    contestId: "",
    setContestId: (value: string) => set({ contestId: value })
}))

export const useUserState = create<{ isTrue: boolean, setIsTrue: () => void }>((set) => ({
    isTrue: false,
    setIsTrue: () => set((prev) => ({ isTrue: !prev.isTrue }))
}))


interface ContestData {
    contestName: string
    startDate: Date
    endDate: Date
    category: string
    setContestData: <K extends keyof ContestData>(key: K, value: ContestData[K]) => void;
}


export const useContestData = create<ContestData>((set) => ({
    contestName: "",
    startDate: addDays(new Date(), 2),
    endDate: addDays(new Date(), 4),
    category: "MALE",
    setContestData: (key, value) => set((state) => ({...state , [key]: value}))

}))