import { AppBar } from "../_component/Appbar";
import { Sidebar } from "../_component/Sidebar";

export default function RootLayout({children}: {children: React.ReactNode}){
    return(

        <div className="flex min-h-screen w-full">
            <Sidebar/>
            <div className=" w-full min-h-screen ">
                <AppBar></AppBar>
            {children}
            </div>
        </div>

    )
}