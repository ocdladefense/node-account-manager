
export default function Menu() {
    return (
        <div className="drawer md:drawer-open">
            <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col">
                {/* Page content here */}
                <label htmlFor="my-drawer-3" className="btn drawer-button md:hidden text-sm w-20">
                    Menu
                </label>
            </div>
            <div className="drawer-side">
                <label htmlFor="my-drawer-3" aria-label="close sidebar" className="drawer-overlay"></label>
                <ul className="menu bg-base-200 min-h-full w-80 p-4">
                    {/* Sidebar content here */}
                    <li><a href="/">Home</a></li>
                    {/* Hardcoding ids for now. Presumably these will ultimately be gotten from the logged-in user's data (authentication process)*/}
                    <li><a href={`/account/${process.env.SF_ACCOUNT_ID}`}>Account</a></li>
                    <li><a href='/contact/0030a00002HpppSAAR'>Profile</a></li>
                    <li><a href='/account/001j000000oPGAmAAO/contacts'>Account Directory</a></li>
                    <li><a href='/account/001j000000oPGAmAAO/orders'>Orders</a></li>
                    <li><a href='/order/801VJ00000D38XqYAJ'>Order Details </a></li>
                    {/* Currently dummy links */}
                    <li><a href='/account/001j000000oPGAmAAO/payments'>Upcoming Payments</a></li>
                    <li><a href='/account/001j000000oPGAmAAO/events'>Seminars and Events</a></li>

                </ul>
            </div>
        </div>
    )
}
