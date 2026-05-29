import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { FileUpload, uploadFileToServer } from "../ui/form/FileUpload.jsx";

export default function Upload() {
    const { client } = useOutletContext();
    const [uploading, setUploading] = useState(false);

    const contactId = process.env.SF_CONTACT_ID;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);
        try {
            const uploadedFile = await uploadFileToServer(contactId, "picture");
            console.log("File uploaded:", uploadedFile);

            // Navigate back to contact after upload
            navigate(`/contact/${contactId}`);
        } catch (err) {
            console.error("Upload error:", err);
            setUploading(false);
        }
    };

    return (
        <div className="w-full">
            <div className="container mx-auto px-2 mt-[28px]">
                <h1 className="text-2xl font-bold text-center mb-6">Upload</h1>
                <div className="bg-white rounded-lg p-6 shadow-sm">
                    <form onSubmit={handleSubmit}>
                        <FileUpload
                            name="picture"
                            label="Upload Expert Witness Info"
                            accepting=".pdf,.jpg,.jpeg,.png,.gif"
                            fileCategory="expert-document"
                            preview={true}
                        />
                        <div>
                            <button type="submit" disabled={uploading}>
                                {uploading ? "Uploading..." : "Upload"}
                            </button>
                            <button type="button" onClick={handleCancel}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
