import { Outlet, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import SalesforceRestApi from '@ocdla/salesforce/SalesforceRestApi.js';
import { getCookie } from '@ocdla/salesforce/CookieUtils.js';


let client;


function isLoggedIn() {

    let sessionInstanceUrl = getCookie("instanceUrl");
    let sessionAccessToken = getCookie("accessToken");

    return !!sessionAccessToken;
}

// @jbernal - previously in index.js
// Retrieve video data and related thumbnail data.
async function getApiClient() {

    let sessionInstanceUrl, sessionAccessToken;
    let applicationInstanceUrl, applicationAccessToken;



    let applicationTokens = await fetch("/connect").then(resp => resp.json());
    applicationInstanceUrl = applicationTokens.instance_url;
    applicationAccessToken = applicationTokens.access_token;


    // sessionInstanceUrl = getCookie("instanceUrl");
    // sessionAccessToken = getCookie("accessToken");

    // let session = new SalesforceRestApi(sessionInstanceUrl, sessionAccessToken);
    let application = new SalesforceRestApi(applicationInstanceUrl, applicationAccessToken);
    // user.setApi(session);

    return application;
}




export default function App() {

    const [appReady, setAppReady] = useState(false);

    useEffect(() => {
        async function fn() {
            client = await getApiClient();
            setAppReady(true);
        }
        fn();
    }, []);


    return (
        <div className="mx-auto">
            <Header loggedIn={isLoggedIn()} />
            <div className="drawer md:drawer-open">
                <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content flex flex-col">
                    {/* Page content here */}
                    <label htmlFor="my-drawer-3" className="btn drawer-button md:hidden text-sm w-20">
                        Menu
                    </label>
                    {!appReady ? <h1>Loading...</h1> : <Outlet context={{ client }} />}

                </div>
                <div className="drawer-side">
                    <label htmlFor="my-drawer-3" aria-label="close sidebar" className="drawer-overlay"></label>
                    <ul className="menu bg-base-200 min-h-full w-80 p-4">
                        {/* Sidebar content here */}
                        <li><a href="/">Home</a></li>
                        {/* Hardcoding ids for now. Presumably these will ultimately be gotten from the logged-in user's data (authentication orocess)*/}
                        <li><a href='/account/001j000000oPGAmAAO'>Account</a></li>
                        <li><a href='/contact/0030a00002HpppSAAR'>Profile</a></li>
                        <li><a href='/account/001j000000oPGAmAAO/contacts'>Account Directory</a></li>
                        <li><a href='/account/001j000000oPGAmAAO/orders'>Orders</a></li>
                        {/* Currently a dummy link */}
                        <li><a href='/account/001j000000oPGAmAAO/payments'>Upcoming Payments</a></li>
                        <li><a href='/account/001j000000oPGAmAAO/events'>Seminars and Events</a></li>

                    </ul>
                </div>
            </div>
            {/* <div className="flex flex-row">
                <nav className="hidden md:flex m-5 mt-25 border-t w-1/4">
                    <ul className="">
                        <li><Link to="/" className="block text-blue-600 underline"></Link></li>
                        <li><Link to="/accounts" className="block text-blue-600 underline"></Link></li>
                    </ul>
                </nav>
                <div className="flex w-3/4">
                    
                </div>
            </div> */}
            {/* <Footer /> */}
        </div>
    );
}

