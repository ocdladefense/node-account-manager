import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";

const uploadFileToServer = async (id, applicationId, setUploaded, client, contactId) => {


    return new Promise((resolve, reject) => {
        const formData = new FormData();

        const input = document.getElementById(id);

        const files = input.files;
        for (let file of files) {
            saveFileData(file, client, contactId);
            formData.append('files', file);
        }

        //This creates a new instance of XMLHttpRequest since I couldn't find a way to make a fetch track progress
        const xhr = new XMLHttpRequest();

        //This opens a POST request
        xhr.open(
            "POST",
            `http://localhost/upload`
        );
        //This sets the headers for the application
        xhr.setRequestHeader(
            "x-applicationid",
            applicationId
        );
        //this tracks the upload of the data from the browser to the uploads, the onprogress meaning when progress is being made it will run this code
        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
                const percent = Math.round(
                    (event.loaded * 100) / event.total
                );
                setUploaded(percent);
            }
        };
        //this checks then the upload is done, whether that is bad or good
        xhr.onload = () => {
            console.log("Response:", xhr.response);
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(JSON.parse(xhr.response));
            }
            else {
                reject(xhr.statusText);
            }
        };
        //Checks for errors unrelated to status
        xhr.onerror = () => {
            reject("Upload failed");
        };
        //this is the part where the data is actually sent
        xhr.send(formData);
    });
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


function FileUpload({ label, accepting, name, fileCategory, preview = false, multiple = false, uploaded,
    setUploaded }) {
    const [filePreview, setFilePreview] = useState(null);
    const { client, contactId } = useOutletContext();

    const defaultPreview = (e) => {
        const file = e.target.files[0];

        if (!file) return;
        const imgUrl = URL.createObjectURL(file);

        setFilePreview(imgUrl);

    };

    const startUpload = async () => {
        const result = await uploadFileToServer(
            name,
            setUploaded,
            applicationId,
            client,
            contactId
        );
        console.log(result);
    }



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


