import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { FileUpload, uploadFileToServer } from "../ui/form/FileUpload.jsx";
import Button from "../ui/Button.jsx";


export default function Upload() {
    const contactId = process.env.SF_CONTACT_ID;
    const { client } = useOutletContext();
    // In handleSubmit:



    return (
        <div className="w-full">
            <div className="container mx-auto px-2 mt-[28px]">
                <FileUpload name="uploadDocuments" multiple={true} applicationId={2} />
            </div>
        </div>
    )
};
