import { Network } from "lucide-react";
import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { useToast } from "../notifications/ToastService";
import { CautionButton } from "../Button";
import { MdDescription } from "react-icons/md";

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
export function FileUpload({ label = "File Upload", name = "file-upload", accepting = "", preview = false, multiple = false, applicationId = null, onChange }) {
    const [filePreview, setFilePreview] = useState(null);
    const [uploaded, setUploaded] = useState(0);
    const { CreateToast, UpdateToast } = useToast();

    const onChangeFunction = (e) => {
        if (onChange)onChange(e); // run function from param

        // file preview
        const file = e.target.files[0];
        if (!file) return;
        const imgUrl = URL.createObjectURL(file);
        setFilePreview(imgUrl);
    };

    return (
        <div >
            <label className="text-lg font-semibold">{label}</label>
            <div className="">
                <input
                    name={name}
                    id={name}
                    type="file"
                    accept={accepting}
                    onChange={onChangeFunction}
                    className="file-input file-input-bordered w-full"
                    multiple={multiple}
                />

                {filePreview && preview === true && <img src={filePreview} className="w-50 h-75 rounded-sm" />}

            </div>
        </div>

    );
}

/**
 * Uploads a file to the server with progress tracking and optional application ID.
 * @async
 * @param {File} file
 * @param {string|null} applicationId
 * @param {function} setUploaded
 * @param {Object} reqData
 * @returns {Promise<Object>} A promise that resolves with the server response or rejects with an error.
 */
export async function uploadFileToServer(file, applicationId, setUploaded = function() { }, additionalFields = {}) {


    return new Promise((resolve, reject) => {
        const formData = new FormData();



        for (let key in additionalFields)
        {
            formData.append(key, additionalFields[key]);
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
            //console.log("uploadEvent", event);
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
            //console.log("upload Response:", xhr.response);
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

/**
 * Sends a request to the server to delete an uploaded file.
 * @async
 * @function deleteFile
 * @param {string} filePath - The relative path or identifier of the file to delete.
 * @param {bool} isDirectory - indicates filePath leads to a directory
 * @param {bool} recursive - should delete all directory contents and sub directories
 * @returns {Promise<void>} Resolves when the request completes.
 *
 * @throws {Error} If the request fails or the server returns an unexpected response.
 *
 * @example
 * await deleteFile("uploads/example.pdf");
 *
 * @example
 * await deleteFile("uploads/examples", true);
 */
export async function deleteFile(filePath, isDirectory = false, recursive = false) {

    const endpoint = "/delete";

    const body = {
        path: filePath,
        isDirectory: isDirectory,
        recursive: recursive
    }

    const request = {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    }

    const response = await fetch(endpoint, request);

    const result = await response.json();

    return result;
}


/**
 * returns component to view and remove existing uploads
 * @function FileView
 * @param {Array} filePaths - paths for files to display or delete
 * @param {function(FilePath)} action - the function that is run when the user clicks delete file function must take filePath parameter which is a string
 * @example
 * let files = ["uploads/example.pdf", "uploads/example2.pdf"];

 * @returns {html}
 *
 * @example
 * <FileView files={files}>
 */
export function FileView({ filePaths, action, buttonLabel }) {
    return (
        <div>
            {filePaths.map((path) => {
                const fileName = path.split("/").pop();

                return (
                    <div key={path} >
                        <div className=" font-semibold text-xl p-2 border rounded bg-cyan-100">
                            <MdDescription />
                            {fileName}
                        </div>
                        <CautionButton
                            action={() => action(path)}
                            label={buttonLabel}
                            buttonType="button"
                            className="inline px-6 w-50 py-2 rounded-sm mx-2.5 text-white bg-red-500 hover:bg-red-600"
                        />
                    </div>
                );
            })}
        </div>
    );
}
