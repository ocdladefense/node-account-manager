export default function FileUpload({ label, uploadType = "file", accepting = "*/*", onChange }) {
    return (<>
        <label className="text-lg font-semibold">{label}</label>
        <input
            type="file"
            name={uploadType}
            accept={accepting}
            className="file-input file-input-bordered w-full"
            onChange={onChange}
        />
    </>)

}

