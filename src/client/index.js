import "../css/input.css";
import "../css/drawer.css";
import { createRoot } from 'react-dom/client';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from '../components/App.jsx';
import Sites from '../components/ui/Sites.jsx';
import Account from '../components/accounts/Account.jsx';
import Accounts from '../components/accounts/Accounts.jsx';
import AccountContacts from '../components/accounts/AccountContacts.jsx';
import OrderDetails from '../components/orders/OrderDetails.jsx';
import OrderHistory from '../components/orders/OrderHistory.jsx';
import Contact from '../components/contacts/Contact.jsx';
import ContactForm from '../components/contacts/ContactForm.jsx';
import HomePage from "../components/HomePage.jsx";
import ContactExpertForm from "../components/contacts/ContactExpertForm.jsx";
import Documents from '../components/documents/Documents.jsx';
import Upload from '../components/documents/Upload.jsx';
import Jobs from '../components/jobs/Jobs.jsx';
import Job from '../components/jobs/Job.jsx';
import JobForm from '../components/jobs/JobForm.jsx';
import JobEdit from "../components/jobs/JobEdit.jsx";
import InvoiceHistory from "../components/invoices/InvoiceHistory.jsx";

import SObject from "../components/contacts/SObject.jsx";

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
                    <Route index element={<Account />} />
                    <Route path="contacts" element={<AccountContacts />} />
                    <Route path="orders" element={<OrderHistory />} />
                    <Route path="invoices" element={<InvoiceHistory />} />
                </Route>
                <Route path="order">
                    <Route path=":orderId" element={<OrderDetails />} />
                </Route>
                <Route path="contact" element={<SObject />}>
                    <Route path=":contactId" element={<Contact />} />
                    <Route path=":contactId/edit" element={<ContactForm />} />
                    <Route path=":contactId/expert" element={<ContactExpertForm />} />
                </Route>
                <Route path="documents">
                    <Route index element={<Documents />} />
                </Route>
                <Route path="upload">
                    <Route index element={<Upload />} />
                </Route>
                <Route path="jobs">
                    <Route index element={<Jobs />} />
                </Route>
                <Route path="job">
                    <Route index element={<Navigate to="/jobs" />} />
                    <Route path="undefined" element={<Navigate to="/jobs" />} />
                    <Route path="new" element={<JobForm />} />
                    <Route path=":jobId" element={<Job />} />
                    <Route path=":jobId/edit" element={<JobEdit />} />
                </Route>
            </Route>
        </Routes>
    </BrowserRouter>
);
