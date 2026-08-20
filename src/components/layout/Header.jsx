
import MenuTop from "../navigation/MenuTop";
import MenuMobile from "../navigation/MenuMobile";
import Hamburger from "../navigation/Hamburger";
import Button from "../ui/Button";
import { getCookie } from '@ocdla/salesforce/CookieUtils';


export default function Header() {

    const userId = getCookie("user_id");
    const loggedIn = Boolean(!userId);

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
        if (!userId) {
            window.location.href = "/logout";
        }
    };


    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-300 bg-white">
            <div className="mx-auto flex max-w-7xl justify-between px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
                <a href="/" className="flex items-center">
                    <img className="h-8 w-auto sm:h-10 lg:h-12" src="/images/logos/logo.png" alt="Logo for OCDLA" />
                </a>

                <nav className="flex items-center gap-4">
                    {loggedIn ?
                        (<Button label={"Log In"} action={handleAuth} />)
                        :
                        (<>
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(87,120,230,1)] font-semibold text-white sm:h-10 sm:w-10 lg:h-12 lg:w-12">
                                {userInitial}
                            </div>
                            <span className="hidden text-xl font-medium text-gray-700 sm:inline-block">
                                {user.name}
                            </span>
                        </>
                        )}

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
