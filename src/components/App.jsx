import { Outlet, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import SalesforceRestApi from '@ocdla/salesforce/SalesforceRestApi.js';
import { getCookie } from '@ocdla/salesforce/CookieUtils.js';
import Menu from './ui/Menu.jsx';
import ToastProvider from "./ui/notifications/ToastProvider";
import LoginPrompt from './ui/LoginPrompt.jsx';


let client;


function hasAccessToken() {

    let url = getCookie("instance_url");
    let token = getCookie("access_token");

    return !!token;
}

// @jbernal - previously in index.js
// Retrieve video data and related thumbnail data.
/**
 * Gets the API client for making requests to the Salesforce API.
 * @returns {Promise<SalesforceRestApi>} A promise that resolves with the API client.
 */
async function getApiClient() {

    let sessionInstanceUrl, sessionAccessToken;
    let url, token, userId;


    if (hasAccessToken())
    {
        url = getCookie("instance_url");
        token = getCookie("access_token");
        userId = getCookie("user_id");
        if (url == "undefined" || token == "undefined" || userId == "undefined")
        {
            console.error("App.jsx: Url, token, or userId error in app.jsx", url, token, userId);
        }
    }
    else
    {
        throw new Error("YOU HAVE NOT LOGGED IN!");
        // If no access token is found, fetch a new one from the server.
        let applicationTokens = await fetch("/connect").then(resp => resp.json());
        if (applicationTokens.error)
        {
            throw new Error("App.jsx: ", applicationTokens.error, applicationTokens.error_description);
        }
        url = applicationTokens.instance_url;
        token = applicationTokens.access_token;
        userId = applicationTokens.user_id;
    }


    let application = new SalesforceRestApi(url, token, userId);

    return application;
}



/**
 * Renders the main application layout, including the header, menu, and content area. It also manages the API client state and handles loading.
 * @returns {React.JSX.Element} The main application layout.
 */
export default function App() {

    const [appReady, setAppReady] = useState(false);

    useEffect(() => {
        async function fn() {
            try
            {
                client = await getApiClient();
                setAppReady(true);
            } catch (err)
            {
                // User is not logged in: log softly and let LoginPrompt render
                console.log("Auth notice:", err.message);
                setAppReady(false);
            }
        }
        fn();
    }, []);


    return (
        <ToastProvider>
            <div className="mx-auto">
                <Header loggedIn={false} />
                <div className='flex w-full lg:mt-[60px]' style={{ minHeight: "calc(100vh - 60px)" }}>
                    <Menu className="flex-1" />
                    {appReady ? <Outlet context={{ client }} /> : <LoginPrompt />}
                </div>
                <Footer />
            </div>
        </ToastProvider>
    );
}

