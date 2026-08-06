import Navbar from "@/Components/Navbar";
import BottomNavigation from "@/Components/BottomNavigation";

export default function AppLayout({
    children,
    messages,
    notifications,
}) {
    return (
        <div className="min-h-screen bg-[#F4F7FB] flex justify-center">

            <div className="w-full max-w-md min-h-screen bg-[#F4F7FB] shadow-xl relative">

                <Navbar
                    messages={messages}
                    notifications={notifications}
                />

                <main className="px-4 pt-6 pb-24">
                    {children}
                </main>

                <BottomNavigation />

            </div>

        </div>
    );
}