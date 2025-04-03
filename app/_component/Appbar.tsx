
import { Instrument_Serif } from "next/font/google"
import { Logout } from "./LogoutButton"

const instrument = Instrument_Serif({
    subsets: ["latin"],
    weight: ["400"]
})

export function AppBar() {

    return (
        <div className="flex justify-between items-center bg-gray-100 h-16 md:flex-row-reverse  pl-17 pr-10">
            <div className={`md:hidden font-bold text-xl ${instrument.className}`}>
                PhotoVote
            </div>
            <Logout/>
        </div>
    )
}