import { authOptions } from "@/app/lib/auth"
import { getServerSession } from "next-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { HomePage } from "@/app/_component/HomePage/HomePage"

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You must be logged in to access the admin panel.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" asChild>
              <Link href="/login">Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <HomePage/>
    </div>

  )
}