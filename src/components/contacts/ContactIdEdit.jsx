import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useOutletContext } from "react-router-dom";

export default function ContactIdEdit() {
    const { client } = useOutletContext();
    const navigate = useNavigate();
    const location = useLocation();
    const { contactId } = useParams();

    const contact = location.state?.contact;

    console.log(contact);

    return (
        <div className="container mx-auto p-6 mt-20">
            <p>Hello World Edit My Contact!</p>
        </div>
    );
}

