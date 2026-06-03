import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { FileUpload, uploadFileToServer } from "../ui/form/FileUpload.jsx";
import Button from "../ui/Button.jsx";


export default function Upload() {
    const contactId = process.env.SF_CONTACT_ID;
    const { client } = useOutletContext();
    // In handleSubmit:
    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await uploadFileToServer("uploadDocuments", "2");
        console.log("Server response:", result);

        // Call saveFileData (metadata to salesforce) for each file
        const input = document.getElementById("uploadDocuments");
        for (let file of input.files) {
            await saveFileData(file, client, contactId);
        }
    };


    return (
        <div className="w-full">
            <div className="container mx-auto px-2 mt-[28px]">
                <form onSubmit={handleSubmit}>
                    <FileUpload name="uploadDocuments" multiple={false} uploaded={uploaded}
                        setUploaded={setUploaded} />
                    <div className="mt-4">
                        <progress
                            className="progress progress-primary w-full"
                            value={uploaded}
                            max="100"
                        />

                        <p>{uploaded}%</p>
                    </div>
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
