import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { FileUpload, uploadFileToServer } from "../ui/form/FileUpload.jsx";
import Button from "../ui/Button.jsx";

const contactId = process.env.SF_CONTACT_ID;

const handleSubmit = async (e) => {
    e.preventDefault();
    uploadFileToServer("uploadDocuments", "2");
}

export default function Upload() {
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
