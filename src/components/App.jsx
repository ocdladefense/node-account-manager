import { Outlet, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import SalesforceRestApi from '@ocdla/salesforce/SalesforceRestApi.js';
import Menu from './ui/Menu.jsx';
import ToastProvider from "./ui/notifications/ToastProvider";


let client;



// @jbernal - previously in index.js
// Retrieve video data and related thumbnail data.
async function getApiClient() {

    let sessionInstanceUrl, sessionAccessToken;
    let applicationInstanceUrl, applicationAccessToken;



    let applicationTokens = await fetch("/connect").then(resp => resp.json());




    applicationInstanceUrl = applicationTokens.instance_url;
    applicationAccessToken = applicationTokens.access_token;



    // let session = new SalesforceRestApi(sessionInstanceUrl, sessionAccessToken);
    let application = new SalesforceRestApi(applicationInstanceUrl, applicationAccessToken);
    // user.setApi(session);

    return application;
}




export default function App() {

    const [hasApiInstance, setHasApiInstance] = useState(false);

    useEffect(() => {
        async function fn() {

            client = await getApiClient();
            setHasApiInstance(true);

        }
        fn();
    }, []);


    return (
        <ToastProvider>
            <div className="mx-auto">
                <Header loggedIn={false} />
                <div className='flex mt-20'>
                    <Menu />
                    {!hasApiInstance ? <h1>Trying Salesforce Connection...</h1> : <Outlet context={{ client }} />}
                </div>
            </div>
        </ToastProvider>
    );
}

