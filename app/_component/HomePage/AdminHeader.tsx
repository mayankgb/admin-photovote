import { authOptions } from "@/app/lib/auth"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { getServerSession } from "next-auth"

export default async function AdminHeader() {

    const session = await  getServerSession(authOptions)

    if (!session) {
        return
    }

    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-500">Welcome back, {session.user.name}</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700">
          <Plus className="mr-2 h-4 w-4" /> Create New Contest
        </Button>
      </div>
    )

}