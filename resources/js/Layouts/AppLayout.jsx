// import Navbar from "@/Components/Navbar";
// import BottomNavigation from "@/Components/BottomNavigation";

// export default function AppLayout({
//     children,
//     messages,
//     notifications,
// }) {
//     return (
//         <div className="min-h-screen bg-[#F4F7FB] flex justify-center">

//             <div className="w-full max-w-md min-h-screen bg-[#F4F7FB] shadow-xl relative">

//                 <Navbar
//                     messages={messages}
//                     notifications={notifications}
//                 />

//                 <main className="px-4 pt-6 pb-24">
//                     {children}
//                 </main>

//                 <BottomNavigation />

//             </div>

//         </div>
//     );
// }

import { useEffect, useState } from "react";

import Navbar from "@/Components/Navbar";
import BottomNavigation from "@/Components/BottomNavigation";
import ForumNotificationPopup from "@/Components/ForumNotificationPopup";

export default function AppLayout({
    children,
    messages,
    notifications,
}) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkScreen = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkScreen();

        window.addEventListener("resize", checkScreen);

        return () => window.removeEventListener("resize", checkScreen);
    }, []);

    return (
        <div className="min-h-screen bg-slate-100">

            <Navbar
                messages={messages}
                notifications={notifications}
            />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {children}

            </main>

            {isMobile && <BottomNavigation />}

            <ForumNotificationPopup />

        </div>
    );
}