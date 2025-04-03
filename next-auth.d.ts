import NextAuth from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            email: string;
            image?: string;
            jwtToken: string;
            role: string;
            instituteId: string | null;
            name: string | null,
            gender: string | null
        };
    }
    interface User {   
        id: string;
        email: string;
        image?: string;
        jwtToken: string;
        role: string;
        instituteId: string | null;
        gender: string | null
    }

}