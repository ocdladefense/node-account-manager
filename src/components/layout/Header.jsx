
import MenuTop from "../navigation/MenuTop";
import MenuMobile from "../navigation/MenuMobile";
import Hamburger from "../navigation/Hamburger";
import Button from "../ui/Button";
import { getCookie } from '@ocdla/salesforce/CookieUtils';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'


function Dropdown({ user, userInitial, onLogout }) {
    return (
        <Menu as="div" className="relative inline-block text-left">
            <MenuButton className="group flex items-center gap-3 rounded-full p-1 transition-colors hover:bg-gray-100 focus:outline-none sm:rounded-lg sm:px-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(87,120,230,1)] font-semibold text-white sm:h-10 sm:w-10 lg:h-12 lg:w-12">
                    {userInitial}
                </div>

                <span className="hidden text-xl font-medium text-gray-700 sm:inline-block">
                    {user.name}
                </span>

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
                <div className="py-1">
                    <MenuItem>
                        <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100">
                            Profile
                        </a>
                    </MenuItem>
                </div>
                <div className="py-1">
                    <MenuItem>
                        <button type="button" onClick={onLogout} className="block w-full px-4 py-2 text-left text-sm text-red-600 data-focus:bg-gray-100">
                            Log Out
                        </button>
                    </MenuItem>
                </div>
            </MenuItems>
        </Menu>
    )
}


export default function Header() {

    const userId = getCookie("user_id");
    const loggedIn = Boolean(userId);

    // Hardcoded for now (swap with contact data from API later)
    const user = {
        name: "Jackie Rael",
        initial: "J",
        // avatarUrl: null, // for future photo support
    };

    const userInitial = user.initial || user.name?.charAt(0).toUpperCase() || "?";

    const handleAuth = () => {
        if (!userId) {
            window.location.href = "/login";
        }
    };

    const handleLogout = () => {
        window.location.href = "/logout";
    };


    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-300 bg-white">
            <div className="mx-auto flex max-w-7xl justify-between px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
                <label htmlFor="my-drawer-3" className="btn drawer-button md:hidden text-sm w-20">
                    Menu
                </label>
                <a href="/" className="flex items-center">
                    <img className="h-8 w-auto sm:h-10 lg:h-12" src="/images/logos/logo.png" alt="Logo for OCDLA" />
                </a>

                <nav className="flex items-center gap-4">
                    {!loggedIn ?
                        (<Button label={"Log In"} action={handleAuth} />) : (<Dropdown user={user} userInitial={userInitial} onLogout={handleLogout} />)}
                </nav>
            </div>

        </header>
    );


    // return (
    //     <header className="w-full mb-0 py-1 px-[10px] fixed top-0 right-0 z-50 bg-white border-b border-gray-300">
    //         <nav>
    //             <ul className="inline-block" style={{ float: "right" }}>

    //                 <li style={{ verticalAlign: "middle" }} className="inline-block">
    //                     <a href="/">
    //                         <img className="sm:w-[75px] lg:w-[150px] bg-white" style={{ display: "inline-block", verticalAlign: "middle" }} src="/images/logos/logo.png" />
    //                     </a>
    //                 </li>

    //                 <MenuTop items={items} />

    //                 <li style={{ float: "right" }} className={`hidden phone:hidden tablet:inline-block`}>
    //                     <Hamburger />
    //                 </li>
    //             </ul>

    //             <ul id="mobile-menu" className="text-slate-50 block hidden min-h-[100vh] pt-[15vh]">
    //                 <MenuMobile items={items} />
    //             </ul>
    //         </nav>

    //     </header>
    // );
}
