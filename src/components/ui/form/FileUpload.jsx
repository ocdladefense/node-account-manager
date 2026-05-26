import { useState, useEffect } from "react";
export default function FileUpload({ label, accepting, fileCategory, onChange }) {
    const [preview, setPreview] = useState(null);

    const handleChange = (e) => {
        const file = e.target.files[0];

        if (!file) return;
        const imgUrl = URL.createObjectURL(file);

        setPreview(imgUrl);

        onChange(file, {
            category: fileCategory
        });
    };

    return (
        <div>
            <label className="text-lg font-semibold">{label}</label>

            <input
                type="file"
                accept={accepting}
                onChange={handleChange}
                className="file-input file-input-bordered w-full"
            />
            {preview &&
                <img src={preview} />}


        </div>

    );
}



