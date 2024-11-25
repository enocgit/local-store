"use client"

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { DashNavbar } from "./DashNavbar";

function NavWrapper() {
    const pathname = usePathname();
    return (
        <>
            {pathname.startsWith("/bridge") ? <DashNavbar /> : <Navbar />}
        </>
    )
}

export default NavWrapper