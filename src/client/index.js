import "../css/input.css";
import "../css/drawer.css";
import { createRoot } from 'react-dom/client';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from '../components/App.jsx';
import Sites from '../components/ui/Sites.jsx';
import Accounts from '../components/accounts/Accounts.jsx';
import Contacts from '../components/contacts/Contacts.jsx';
import ContactId from '../components/contacts/ContactId.jsx';
import ContactIdEdit from '../components/contacts/ContactIdEdit.jsx';
import LegislativeAction from '../components/legislative/LegislativeAction.jsx';
import LegislativeActionHome from '../components/legislative/LegislativeActionHome.jsx';
import HomePage from "../components/HomePage.jsx";
import Map from '../components/Map.jsx';




if (process.env.NODE_ENV === 'debug') {
    setDebugLevel(1);
}




const $root = document.getElementById("app");
const root = createRoot($root);



const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null; // This component doesn't render anything
};



root.render(
    <BrowserRouter>
        <ScrollToTop />
        <Routes>
            <Route path="/" element={<App />}>
                <Route index element={<HomePage />} />
                <Route path="sites">
                    <Route index element={<Sites />} />
                </Route>
                <Route path="action">
                    <Route index element={<LegislativeActionHome />} />
                    <Route path=":type" element={<LegislativeAction />} />
                </Route>
                <Route path="account">
                    <Route path=":accountId" element={<Accounts />} />
                </Route>
                {/* Assignment Friday 04-11 Contact Get/Post}*/}
                <Route path="contacts">
                    <Route index element={<Contacts />} />
                    <Route path=":contactId" element={<ContactId />} />
                    <Route path=":contactId/edit" element={<ContactIdEdit />} />
                </Route>
            </Route>
            <Route path="/map">
                <Route index element={<Map />} />
            </Route>
        </Routes>
    </BrowserRouter>
);
