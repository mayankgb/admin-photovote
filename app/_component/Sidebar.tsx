"use client"

import { usePathname } from "next/navigation"
import { Home, Camera, BarChart3, Menu, X, Vote, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

export function Sidebar() {
    const pathname = usePathname()
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const navItems = [
        { name: "Home", path: "/home", icon: <Home size={20} /> },
        { name: "End Contest", path: "/endcontest", icon: <BarChart3 size={20} /> },
        { name: "Start Contest", path: "/startcontest", icon: <Camera size={20} /> },
        { name: "Create contest", path: "/createcontest", icon: <Vote size={20} /> },
        { name: "Approve candidate", path: "/approvecandidate", icon: <CheckCircle size={20} /> }
    ]

    // Check screen size and set collapsed state
    useEffect(() => {
        const handleResize = () => {
            setIsCollapsed(window.innerWidth < 768)
        }

        // Set initial state
        handleResize()

        // Add event listener
        window.addEventListener('resize', handleResize)

        // Clean up
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    // Toggle mobile menu
    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen)
    }

    return (
        <>
            {/* Mobile menu button - only visible on small screens */}
            <button
                onClick={toggleMobileMenu}
                className="md:hidden fixed top-4 left-4 z-50 bg-black text-yellow-400 p-2 rounded-lg"
            >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar */}
            <div className={`
                 md:relative fixed top-0 left-0 min-h-screen bg-gray-50 border-r border-gray-200 shadow-md transition-all duration-300 z-40
                ${isCollapsed && !isMobileMenuOpen ? 'w-16' : 'w-74'} 
                ${isMobileMenuOpen ? 'translate-x-0' : isCollapsed ? '-translate-x-full md:translate-x-0' : 'translate-x-0'}
            `}>
                {/* Logo Section */}
                <div className="p-4 border-b border-gray-200 flex justify-center md:justify-start">
                    <div className="flex items-center gap-2">
                        <div className="bg-black p-2 rounded-lg">
                            <Camera className="text-yellow-400 w-6 h-6" />
                        </div>
                        {(!isCollapsed || isMobileMenuOpen) && (
                            <h1 className="text-xl font-bold">PhotoVote</h1>
                        )}
                    </div>
                </div>

                {/* Navigation Section */}
                <div className="flex-1 py-6 px-2">
                    <div className="space-y-1">
                        {navItems.map((item) => (
                            <Link href={item.path} key={item.path} onClick={() => setIsMobileMenuOpen(false)}>
                                <div
                                    className={`flex items-center justify-${isCollapsed && !isMobileMenuOpen ? 'center' : 'between'} 
                                        px-3 py-3 rounded-lg cursor-pointer transition-all
                                        ${pathname === item.path
                                            ? "bg-black text-yellow-400 shadow-sm"
                                            : "hover:bg-gray-100 text-gray-700"
                                        }`}
                                >
                                    <div className={`flex items-center ${!isCollapsed || isMobileMenuOpen ? 'gap-3' : 'justify-center'}`}>
                                        <div className={pathname === item.path ? "text-yellow-400" : "text-gray-500"}>
                                            {item.icon}
                                        </div>
                                        {(!isCollapsed || isMobileMenuOpen) && (
                                            <span className="font-medium">{item.name}</span>
                                        )}
                                    </div>
                                    {pathname === item.path && (!isCollapsed || isMobileMenuOpen) && (
                                        <div className="w-4 h-4 flex items-center justify-center">
                                            <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                                        </div>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Footer Section */}
               
            </div>

            {/* Overlay for mobile menu */}
            {isMobileMenuOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
                    onClick={() => setIsMobileMenuOpen(false)}
                ></div>
            )}

            {/* Main content spacing - add this to your layout */}
            <div className={`md:ml-${isCollapsed ? '16' : '64'}`}>
                {/* Your main content goes here */}
            </div>
        </>
    )
}