
import { useState, useEffect } from "react";
import { getCookie } from '@ocdla/salesforce/CookieUtils';
import DropDown from "./DropDown.jsx";





export default function Header({ client }) {

    const userId = getCookie("user_id");
    const loggedIn = Boolean(userId);

    const [user, setUser] = useState(null);

    useEffect(() => {
        if (!userId || !client) return;

        async function fetchUser() {
            try
            {
                const userQuery = `SELECT Id, Name, FirstName, LastName FROM User WHERE Id = '${userId}' LIMIT 1`;
                const response = await client.query(userQuery);

                if (response?.records?.length > 0)
                {
                    setUser(response.records[0]);
                }
            } catch (err)
            {
                console.error("Error fetching user in Header:", err);
            }
        }

        fetchUser();
    }, [userId, client]);

    const handleAuth = () => {
        if (!userId)
        {
            window.location.href = "/login";
        }
    };

    const handleLogout = () => {
        window.location.href = "/logout";
    };

    const userInitial = user?.Name?.charAt(0) || user?.Name?.charAt(0)?.toUpperCase() || "?";
    const userName = user?.Name || "";

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-300 bg-white">
            <div className="flex justify-between px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
                <label htmlFor="my-drawer-3" className="btn drawer-button md:hidden text-sm w-20">
                    Menu
                </label>
                <a href="/" className="flex items-center">
                    <img className="h-8 w-auto sm:h-10 lg:h-12" src="/images/logos/logo.png" alt="Logo for OCDLA" />
                </a>

                <nav className="flex items-center gap-4">
                    <DropDown
                        loggedIn={loggedIn}
                        userName={userName}
                        userInitial={userInitial}
                        onAuth={handleAuth}
                        onLogout={handleLogout}
                    />
                </nav>
            </div>
        </header>
    );
}
