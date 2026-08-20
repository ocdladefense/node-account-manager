import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { FileUpload, uploadFileToServer } from "../ui/form/FileUpload.jsx";
import { useToast } from "../ui/notifications/ToastService.jsx";
import { Toast } from "../ui/notifications/Toast.jsx";

import Button from "../ui/Button.jsx";

const contactId = process.env.SF_CONTACT_ID;
/**
 *  Renders the Upload page, allowing users to upload documents with optional preview and progress tracking.
 *  @returns {React.JSX.Element} The Upload page UI
 */
export default function Upload() {
    const { client } = useOutletContext();
    const { CreateToast, UpdateToast } = useToast();
    const [canUpload, setCanUpload] = useState(false);

    const DOCUMENT_UPLOAD_APP_ID = 2;

    const handleFileUpload = async (file) => {
        const uploadResult = await uploadFileToServer(file, DOCUMENT_UPLOAD_APP_ID, undefined, { contactId });
        console.log(uploadResult);

        let message = "no response from server";

        if(uploadResult) message = (uploadResult.error ? "Error uploading " : "Uploaded ") + file.originalname;

        let toast = Toast(message);
        CreateToast(toast);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        const fileInput = document.getElementById("uploadDocuments");
        const files = [...fileInput.files];

        files.forEach(file => {
            handleFileUpload(file);
        });
    };
    
    

    return (
        <form onSubmit={handleSubmit} className="foobar">
            <div className="w-full">
                <div className="container mx-auto px-2 mt-7">
                    <FileUpload label="Upload Documents" name="uploadDocuments" multiple={true} applicationId={DOCUMENT_UPLOAD_APP_ID} onChange={() => setCanUpload(true)}/>
                </div>

                {canUpload &&<Button label="Upload" buttonType="submit" />}
            </div>
        </form>
    )
};
