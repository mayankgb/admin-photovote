"use client"
import { signOut } from "next-auth/react"
import { toast } from "sonner"

export function Logout() {

    const handleLogout = async () => {
        toast("signing out...")
        await signOut()
        toast("signedOut")
    }

    return (
        <div className="font-bold cursor-pointer select-none" onClick={handleLogout}>
                Logout
         </div>
    )
}