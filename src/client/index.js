import "../css/input.css";
import "../css/drawer.css";
import { createRoot } from 'react-dom/client';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from '../components/App.jsx';
import Sites from '../components/ui/Sites.jsx';
import Account from '../components/accounts/Account.jsx';
import Accounts from '../components/accounts/Accounts.jsx';
import AccountContacts from '../components/accounts/AccountContacts.jsx';
import Contact from '../components/contacts/Contact.jsx';
import ContactForm from '../components/contacts/ContactForm.jsx';
import HomePage from "../components/HomePage.jsx";

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
                <Route path="accounts">
                    <Route index element={<Accounts />} />
                </Route>
                <Route path="account">
                    <Route path=":accountId" element={<Account />} />
                    <Route path=":accountId/contacts" element={<AccountContacts />} />
                </Route>
                <Route path="contact">
                    <Route path=":contactId" element={<Contact />} />
                    <Route path=":contactId/edit" element={<ContactForm />} />
                </Route>
            </Route>
        </Routes>
    </BrowserRouter>
);
