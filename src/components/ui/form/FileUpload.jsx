import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";

const uploadFileToServer = async (id, applicationId) => {
    const formData = new FormData();
    let input = document.getElementById(id);
    const files = input.files;
    for (let file of files) {
        formData.append('files', file);
    }

    const res = await fetch(
        `http://localhost/upload`,
        {
            headers: { "x-applicationid": applicationId },
            method: "POST",
            body: formData
        }
    );
    return await res.json();
};

async function saveFileData(file, client, contactId) {
    const fileData = {
        Filename__c: file.name,
        FileSize__c: file.size,
        FileType__c: file.type,
        ContactId__c: contactId
    };
    console.log("Metadata to send: ", fileData);
    const response = await client.create("FileData__c", fileData);
    console.log(response);
    if (!response.ok) {
        let message = await response.json();
        console.log("An error occurred: ", message);
    }
}

const handleFileChange = (file, options) => {
    setUploadFile({
        file,
        category: options.category
    });
};


function FileUpload({ label, accepting, name, fileCategory, preview = false, multiple = false }) {
    const [filePreview, setFilePreview] = useState(null);

    const defaultPreview = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const imgUrl = URL.createObjectURL(file);
        setFilePreview(imgUrl);
    };

    return (
        <div >
            <label className="text-lg font-semibold">{label}</label>
            <div className="grid grid-cols-1 md:grid-cols-2">
                <input
                    name={name}
                    id={name}
                    type="file"
                    accept={accepting}
                    onChange={defaultPreview}
                    className="file-input file-input-bordered w-full"
                    multiple={multiple}
                />
                {filePreview && preview === true &&
                    <img src={filePreview} className="w-50 h-75 rounded-sm" />}

            </div>
        </div>

    );
}

export { FileUpload, uploadFileToServer, handleFileChange, saveFileData };


