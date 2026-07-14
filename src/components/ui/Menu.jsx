import { useLocation } from 'react-router-dom';
import { IoHomeOutline } from "react-icons/io5";
import { MdAccountBalance, MdPayment } from "react-icons/md";
import { VscAccount, VscSymbolEvent } from "react-icons/vsc";
import { RiContactsBook2Line } from "react-icons/ri";
import { LuPackageOpen } from "react-icons/lu";
import { TbPackages } from "react-icons/tb";
import { MdDescription, MdCloudUpload } from "react-icons/md";

export default function Menu() {
    const location = useLocation();
    let currentPath = location.pathname;
    const routePatterns = {
        account: /\/account\/[0-9A-Za-z]+$/,
        contacts: /\/account\/[0-9A-Za-z]+\/contacts/,
        orders: /\/account\/[0-9A-Za-z]+\/orders/,
        contact: /\/contact\/[0-9A-Za-z]+$/,
        order: /\/order\/[0-9A-Za-z]+$/,
        documents: /\/documents$/,
        upload: /\/upload$/,
        jobs: /\/jobs\/[0-9A-Za-z]+$/
    };

    let active = "bg-gray-300 hover:bg-gray-400";

    return (
        <div className="drawer md:drawer-open" style={{ width: "auto" }}>
            <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
            <label htmlFor="my-drawer-3" className="btn drawer-button md:hidden text-sm w-20">
                Menu
            </label>
            <div className="drawer-side">
                <label htmlFor="my-drawer-3" aria-label="close sidebar" className="drawer-overlay"></label>
                <ul className="menu bg-base-200 min-h-full w-80 p-4">
                    {/* Sidebar content here */}
                    <li className="mt-10 md:mt-0">
                        <a href="/" className={`p-3 font-semibold text-xl ${currentPath == '/' ? active : ""}`}>
                            <IoHomeOutline className='text-xl' />
                            Home
                        </a>
                    </li>
                    <li>
                        <a href={`/account/${process.env.SF_ACCOUNT_ID}`} className={`p-3 font-semibold text-xl ${currentPath.match(routePatterns.account) ? active : ""}`}>
                            <MdAccountBalance />
                            Account
                        </a>
                    </li>
                    <li>
                        <a href={`/contact/${process.env.SF_CONTACT_ID}`} className={`p-3 font-semibold text-xl ${currentPath.match(routePatterns.contact) ? active : ''}`}>
                            <VscAccount />
                            Profile
                        </a>
                    </li>
                    <li>
                        <a href={`/account/${process.env.SF_ACCOUNT_ID}/orders`} className={`p-3 font-semibold text-xl ${currentPath.match(routePatterns.orders) ? active : ''}`}>
                            <TbPackages />
                            Orders
                        </a>
                    </li>
                    <li>
                        <a href={`/order/${process.env.SF_ORDER_ID}`} className={`p-3 font-semibold text-xl ${currentPath.match(routePatterns.order) ? active : ''}`}>
                            <LuPackageOpen />
                            Order Details
                        </a>
                    </li>
                    <li>
                        <a href="/documents" className={`p-3 font-semibold text-xl ${currentPath.match(routePatterns.documents) ? active : ''}`}>
                            <MdDescription />
                            Documents
                        </a>
                    </li>
                    <li>
                        <a href="/upload" className={`p-3 font-semibold text-xl ${currentPath.match(routePatterns.upload) ? active : ''}`}>
                            <MdCloudUpload />
                            Upload
                        </a>
                    </li>
                    <li>
                        <a href={/*`/account/${process.env.SF_ACCOUNT_ID}/payments`*/"#"} className={`p-3 font-semibold text-xl ${currentPath.includes('payments') ? active : ''}`}>
                            <MdPayment />
                            Upcoming Payments
                        </a>
                    </li>
                    <li>
                        <a href={/*`/account/${process.env.SF_ACCOUNT_ID}/events'`*/"#"} className={`p-3 font-semibold text-xl ${currentPath.includes('events') ? active : ''}`}>
                            <VscSymbolEvent />
                            Seminars and Events
                        </a>
                    </li>
                    <li>
                        <a href="/jobs" className={`p-3 font-semibold text-xl ${currentPath.match(routePatterns.jobs) ? active : ''}`}>
                            Jobs
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    )
}

