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
            <div className="flex flex-row">
                <nav className="flex m-5 mt-25 border-t w-1/4">
                    <ul className="">
                        <li><Link to="/" className="block text-blue-600 underline">Home</Link></li>
                        <li><Link to="/accounts" className="block text-blue-600 underline">Accounts</Link></li>
                    </ul>
                </nav>
                <div className="flex w-3/4">
                    {!appReady ? <h1>Loading...</h1> : <Outlet context={{ client }} />}
                </div>
            </div>
            {/* <Footer /> */}
        </div>
    );
}

