import { Network } from "lucide-react";
import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { useToast } from "../notifications/ToastService.jsx";

const SERVER_ENDPOINT = "http://localhost/upload";

const uploadFileToServer = async (id, applicationId, setUploaded) => {


    return new Promise((resolve, reject) => {
        const formData = new FormData();

        const input = document.getElementById(id);

        const files = input.files;
        for (let file of files) {
            formData.append('files', file);
        }

        //This creates a new instance of XMLHttpRequest since I couldn't find a way to make a fetch track progress
        const xhr = new XMLHttpRequest();

        xhr.timeout = 120000;

        //This opens a POST request
        xhr.open(
            "POST",
            SERVER_ENDPOINT
        );
        //This sets the headers for the application
        if (applicationId) {
            xhr.setRequestHeader(
                "x-applicationid",
                applicationId
            );
        }

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

                reject({
                    status: xhr.status,
                    statusText: xhr.statusText,
                    message: response?.message || response || "Unknown server error"
                });
            }
        };



        //Checks for errors unrelated to status
        xhr.onerror = () => {
            reject({
                type: "Network",
                message: "Network Error on connection or server."
            });
        };

        xhr.ontimeout = () => {
            reject({
                type: "Timeout",
                message: "Upload timed out. Try again."
            });
        }
        //this is the part where the data is actually sent
        xhr.send(formData);
    });
};



function FileUpload({ label = "File Upload", name = "file-upload", accepting = "", preview = false, multiple = false, applicationId = null, afterUpload }) {
    const [filePreview, setFilePreview] = useState(null);
    const [uploaded, setUploaded] = useState(0);
    const { CreateToast } = useToast();

    const defaultPreview = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const imgUrl = URL.createObjectURL(file);
        setFilePreview(imgUrl);
    };

    const startUpload = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        uploadFileToServer(
            name,
            applicationId,
            setUploaded
        )
            .then(() => {
                CreateToast(
                    <div className="bg-green-500 text-black px-6 py-4 text-lg font-semibold rounded-lg shadow-lg">
                        File uploaded successfully.
                    </div>
                );
                afterUpload?.(name)
            })
            .catch((e) => {
                console.log("Error Message:", e);

                const message =
                    e?.message ||
                    e?.statusText ||
                    "Something went wrong."

                CreateToast(
                    <div className="bg-red-500 text-white px-6 py-4 text-lg font-semibold rounded-lg shadow-lg">

                        {message}
                    </div>
                );

            }

            );




    }



    return (
        <div >
            <form onSubmit={startUpload}>
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
                    <button
                        type="submit"
                        className="buttonStyle"

                    >
                        Save {label}
                    </button>

                    {filePreview && preview === true &&
                        <img src={filePreview} className="w-50 h-75 rounded-sm" />}
                    {multiple === false &&
                        <>
                            <div className="mt-4">
                                <progress
                                    className="progress progress-primary w-full"
                                    value={uploaded}
                                    max="100"
                                />

                                <p>{uploaded}%</p>
                            </div>
                        </>
                    }
                </div>
            </form>
        </div>

    );
}

export { FileUpload, uploadFileToServer };


