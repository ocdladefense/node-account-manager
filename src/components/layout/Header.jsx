
import MenuTop from "../navigation/MenuTop";
import MenuMobile from "../navigation/MenuMobile";
import Hamburger from "../navigation/Hamburger";
import Button from "../ui/Button";
import { useState, useEffect } from "react";
import { getCookie } from '@ocdla/salesforce/CookieUtils';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { IoPersonOutline } from "react-icons/io5";
import { getContactQuery } from "../contacts/query";



function Dropdown({ loggedIn, userName, userInitial, onAuth, onLogout }) {

    return (
        <Menu as="div" className="relative inline-block text-left">
            <MenuButton className="group flex cursor-pointer items-center gap-3 rounded-full p-1 transition-colors hover:bg-gray-100 focus:outline-none sm:rounded-lg sm:px-2">
                <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full sm:h-10 sm:w-10 lg:h-12 lg:w-12
                        ${loggedIn
                            ? "bg-[rgba(87,120,230,1)] text-white font-semibold"
                            : "border border-gray-700 bg-white"
                        }`}
                >
                    {loggedIn ? (
                        <span>{userInitial}</span>
                    ) : (
                        <IoPersonOutline className=" text-gray-800 h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7" />
                    )}
                </div>

                {loggedIn && (
                    <span className="hidden text-xl font-medium text-gray-700 sm:inline-block">
                        {userName}
                    </span>
                )}

                <svg
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="size-5 text-gray-500 transition-transform duration-200 ease-out group-data-open:rotate-180 sm:size-6"
                    aria-hidden="true">
                    <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                </svg>
            </MenuButton>

            <MenuItems
                transition
                className="absolute right-0 z-50 mt-2 w-48 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 transition duration-100 ease-out focus:outline-none data-closed:scale-95 data-closed:opacity-0"
            >
                {loggedIn &&
                    <div className="py-1">
                        <MenuItem>
                            <a href="/account" className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100">
                                Profile
                            </a>
                        </MenuItem>

                        <MenuItem>
                            <a href="https://lod.ocdla.org/" className="block cursor-pointer px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100" target="_blank"
                                rel="noopener noreferrer">
                                Library of defense
                            </a>
                        </MenuItem>

                        <MenuItem>
                            <a href="https://bon.ocdla.org" className="block cursor-pointer px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100" target="_blank"
                                rel="noopener noreferrer">
                                Books Online
                            </a>
                        </MenuItem>

                        <MenuItem>
                            <a href="https://media.ocdla.org" className="block cursor-pointer px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100" target="_blank"
                                rel="noopener noreferrer">
                                Videos
                            </a>
                        </MenuItem>

                        <MenuItem>
                            <a href="/" className="block cursor-pointer px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100" target="_blank"
                                rel="noopener noreferrer">
                                Criminal Law Form Book
                            </a>
                        </MenuItem>

                    </div>

                }

                <div className="py-1">
                    <MenuItem>
                        {loggedIn ?
                            (
                                <button
                                    type="button"
                                    onClick={onLogout}
                                    className="block w-full cursor-pointer px-4 py-2 text-left text-sm text-red-600 data-focus:bg-gray-100">
                                    Log Out
                                </button>
                            )
                            :
                            (
                                <button
                                    type="button"
                                    onClick={onAuth}
                                    className="block w-full cursor-pointer px-4 py-2 text-left text-sm font-semibold text-gray-900 transition-colors data-focus:bg-gray-100 data-focus:text-gray-900">
                                    Log In
                                </button>
                            )
                        }

                    </MenuItem>
                </div>
            </MenuItems>
        </Menu>
    )
}


export default function Header({ client }) {

    const userId = getCookie("user_id");
    const loggedIn = Boolean(userId);

    const [user, setUser] = useState(null);

    useEffect(() => {
        if (!userId || !client) return;

        async function fetchUser() {
            try {
                const userQuery = `SELECT Id, Name, FirstName, LastName FROM User WHERE Id = '${userId}' LIMIT 1`;
                const response = await client.query(userQuery);

                if (response?.records?.length > 0) {
                    setUser(response.records[0]);
                }
            } catch (err) {
                console.error("Error fetching user in Header:", err);
            }
        }

        fetchUser();
    }, [userId, client]);

    const handleAuth = () => {
        if (!userId) {
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
                    <Dropdown
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
