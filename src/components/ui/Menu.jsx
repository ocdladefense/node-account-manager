
export default function Menu() {
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
                    <li><a href="/">Home</a></li>
                    {/* Hardcoding ids for now. Presumably these will ultimately be gotten from the logged-in user's data (authentication process)*/}
                    <li><a href={`/account/${process.env.SF_ACCOUNT_ID}`}>Account</a></li>
                    <li><a href={`/contact/${process.env.SF_CONTACT_ID}`}>Profile</a></li>
                    <li><a href={`/account/${process.env.SF_ACCOUNT_ID}/contacts`}>Account Directory</a></li>
                    <li><a href={`/account/${process.env.SF_ACCOUNT_ID}/orders`}>Orders</a></li>
                    <li><a href={`/order/${process.env.SF_ORDER_ID}`}>Order Details </a></li>
                    {/* Currently dummy links */}
                    <li><a href={`/account/${process.env.SF_ACCOUNT_ID}/payments`}>Upcoming Payments</a></li>
                    <li><a href={`/account/${process.env.SF_ACCOUNT_ID}/events'`}>Seminars and Events</a></li>
                </ul>
            </div>
        </div>
    )
}

