import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { FileUpload, uploadFileToServer, saveFileData } from "../ui/form/FileUpload.jsx";
import Button from "../ui/Button.jsx";


export default function Upload() {
    const contactId = process.env.SF_CONTACT_ID;
    const { client } = useOutletContext();
    // In handleSubmit:
    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await uploadFileToServer("uploadDocuments", "2", contactId);
        console.log("Server response:", result);

        // Call saveFileData (metadata to salesforce) for each file
        const input = document.getElementById("uploadDocuments");
        for (let file of input.files) {
            console.log("Testing client on Upload page: ", client);
            await saveFileData(file, client, contactId);
        }
    };


    return (
        <div className="w-full">
            <div className="container mx-auto px-2 mt-[28px]">
                <form onSubmit={handleSubmit}>
                    <FileUpload name="uploadDocuments" multiple={false} />
                    <div className="flex mt-5">
                        <Button
                            label="Submit"
                            buttonType="submit"
                        />
                        <Button label="Cancel" buttonType="button" />
                    </div>
                </form>
            </div>
        </div>
    )
};
