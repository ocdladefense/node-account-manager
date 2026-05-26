import { useState, useEffect } from "react";

const uploadFileToServer = async (contactId, id) => {
    // if (!uploadFile) return null;

    const formData = new FormData();

    let input = document.getElementById(id);

    formData.append("file", input.files[0]);

    const res = await fetch(
        `http://localhost/uploads/${contactId}`,
        {
            headers: { "x-applicationid": "abcd123" },
            method: "POST",
            body: formData
        }
    );

    return await res.json();
};

const handleFileChange = (file, options) => {
    setUploadFile({
        file,
        category: options.category
    });
};

function FileUpload({ label, accepting, name, fileCategory, preview = false }) {
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
                />
                {filePreview && preview === true &&
                    <img src={filePreview} className="w-50 h-75 rounded-sm" />}

            </div>
        </div>

    );
}

export { FileUpload, uploadFileToServer, handleFileChange };


