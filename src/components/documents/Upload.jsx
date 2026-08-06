import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { FileUpload, uploadFileToServer } from "../ui/form/FileUpload.jsx";
import Button from "../ui/Button.jsx";

const contactId = process.env.SF_CONTACT_ID;
/**
 *  Renders the Upload page, allowing users to upload documents with optional preview and progress tracking.
 *  @returns {React.JSX.Element} The Upload page UI
 */
export default function Upload() {
    const { client } = useOutletContext();

    const DOCUMENT_UPLOAD_APP_ID = 2;
    const handleSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        const fileInput = document.getElementById("uploadDocuments");
        const fileList = fileInput.files;
        const file = fileList[0];
        const uploadResult = await uploadFileToServer(file, DOCUMENT_UPLOAD_APP_ID, undefined, { contactId });
    };

    return (
        <form onSubmit={handleSubmit} className="foobar">
            <div className="w-full">
                <div className="container mx-auto px-2 mt-[28px]">
                    <FileUpload label="Upload Documents" name="uploadDocuments" multiple={true} applicationId={DOCUMENT_UPLOAD_APP_ID} />
                </div>

                <Button label="Upload" buttonType="submit" />
            </div>


        </form>
    )
};
