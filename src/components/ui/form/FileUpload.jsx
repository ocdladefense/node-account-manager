import { Network } from "lucide-react";
import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { useToast } from "../notifications/ToastService.jsx";

const SERVER_PORT = process.env.PORT;
const SERVER_ENDPOINT = `http://localhost:${SERVER_PORT}/upload`;


/**
 * A component for uploading files, with optional preview and progress tracking.
 * @param {Object} props - The properties for the FileUpload component.
 * @param {string} [props.label="File Upload"] - The label for the file input.
 * @param {string} [props.name="file-upload"] - The name and id for the file input.
 * @param {string} [props.accepting=""] - The accepted file types (e.g., "image/*").
 * @param {boolean} [props.preview=false] - Whether to show a preview of the selected file.
 * @param {boolean} [props.multiple=false] - Whether to allow multiple file uploads.
 * @param {string|null} [props.applicationId=null] - An optional application ID for server-side processing.
 * @param {function} [props.afterUpload] - A callback function to be called after a successful upload.
 * @returns {React.JSX.Element} The FileUpload component.
 *
 */
export function FileUpload({ label = "File Upload", name = "file-upload", accepting = "", preview = false, multiple = false, applicationId = null, afterUpload }) {
    const [filePreview, setFilePreview] = useState(null);
    const [uploaded, setUploaded] = useState(0);
    const { CreateToast, UpdateToast } = useToast();

    const defaultPreview = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const imgUrl = URL.createObjectURL(file);
        setFilePreview(imgUrl);
    };

    const startUploads = async (e) => {
        e.preventDefault();
        e.stopPropagation();


        // CreateToast(<div className="bg-green-500 text-black px-6 py-4 text-lg font-semibold rounded-lg shadow-lg">
        //     File uploaded successfully.
        // </div>);
        const input = document.getElementById(name);

        const files = [...input.files];

        let toastIds = files.map((file) => CreateToast(
            <div className="bg-yellow-500 text-black px-6 py-4 text-lg font-semibold rounded-lg shadow-lg">
                {file.name} upload started.
            </div>
        ));
        console.log(toastIds);
        let updaterFunctions = toastIds.map((id) => {
            let fn = function(percentage, file) {
                UpdateToast(id,
                    <div className="bg-yellow-500 text-black px-6 py-4 text-lg font-semibold rounded-lg shadow-lg">
                        {file.name} {percentage}% uploaded successfully.
                    </div>
                );
            };
            return fn;
        });
        console.log(updaterFunctions);


        files.map((file, index) => uploadFileToServer(file, applicationId, updaterFunctions[index]).then(() => {
            UpdateToast(toastIds[index],
                <div className="bg-green-500 text-black px-6 py-4 text-lg font-semibold rounded-lg shadow-lg">
                    {file.name} uploaded successfully.
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

                UpdateToast(toastIds[index],
                    <div className="bg-red-500 text-white px-6 py-4 text-lg font-semibold rounded-lg shadow-lg">

                        Error uploading: {file.name}
                        Error: {message}
                    </div>
                );

            }

            )
        );




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

                {/*
                <button
                    type="submit"
                    className="buttonStyle"

                >
                    Save {label}
                </button>
                */}

                {filePreview && preview === true &&
                    <img src={filePreview} className="w-50 h-75 rounded-sm" />}
                {multiple === true &&
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
        </div>

    );
}

/**
 * Uploads a file to the server with progress tracking and optional application ID.
 * @param {File} file
 * @param {string|null} applicationId
 * @param {function} setUploaded
 * @param {Object} reqData
 * @returns {Promise<Object>} A promise that resolves with the server response or rejects with an error.
 */
export async function uploadFileToServer(file, applicationId, setUploaded = function() { }, reqData = {}) {


    return new Promise((resolve, reject) => {
        const formData = new FormData();



        for (let key in reqData)
        {
            formData.append(key, reqData[key]);
        }

        formData.append('files', file);
        //This creates a new instance of XMLHttpRequest since I couldn't find a way to make a fetch track progress
        const xhr = new XMLHttpRequest();

        xhr.timeout = 120000;

        //This opens a POST request
        xhr.open(
            "POST",
            SERVER_ENDPOINT
        );
        //This sets the headers for the application
        if (applicationId)
        {
            xhr.setRequestHeader(
                "x-applicationid",
                applicationId
            );
        }

        //this tracks the upload of the data from the browser to the uploads, the onprogress meaning when progress is being made it will run this code
        xhr.upload.onprogress = (event) => {
            console.log(event);
            if (event.lengthComputable)
            {
                const percent = Math.round(
                    (event.loaded * 100) / event.total
                );
                setUploaded(percent, file);
            }
        };
        //this checks then the upload is done, whether that is bad or good
        xhr.onload = () => {
            console.log("Response:", xhr.response);
            if (xhr.status >= 200 && xhr.status < 300)
            {
                resolve(JSON.parse(xhr.response));
            }
            else
            {

                reject({
                    status: xhr.status,
                    statusText: xhr.statusText
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
