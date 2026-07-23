import { FileUpload, uploadFileToServer } from "../ui/form/FileUpload.jsx";
import { useOutletContext } from "react-router-dom";
import TextInput from "../ui/form/TextInput.jsx";
import DateInput from "../ui/form/DateInput.jsx";
import Button from "../ui/Button.jsx";
import Job from "../../models/Job.js";
import CheckBox from "../ui/form/CheckBox.jsx";

/**
 * Renders the Job Posting Form page for creating new job listings and handling file upploads.
 *
 * @returns {React.JSX.Element} The job posting form UI
 */
export default function JobForm({ job = {} }) {
    const JOB_POSTING_APP_ID = 3;
    const { client, metadata } = useOutletContext();

    const handleSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const form = e.target; // currentTarget
        const formData = new FormData(form);

        const openUntilFilled =
            formData.get("OpenUntilFilled__c") === "on";

        const record = {
            Name: formData.get("Name"),
            Organization__c: formData.get("Organization__c"),
            Location__c: formData.get("Location__c"),
            Salary__c: formData.get("Salary__c"),
            PostingDate__c: formData.get("PostingDate__c") || null,
            ClosingDate__c: formData.get("ClosingDate__c") || null,
            OpenUntilFilled__c: openUntilFilled,
            IsActive__c: true
        };
        // ^^^ What about MemberId__c ? ^^^

        let resp = await client.create('Job__c', record);
        let data = await resp.json();
        let jobId = data.id;

        const input = document.getElementById("jobAttachment");
        const files = [...input.files];
        const file = files[0];

        uploadFileToServer(file, JOB_POSTING_APP_ID, undefined, { jobId });
    };

    return (
        <div className="container mx-auto px-2">
            <h1 className="text-2xl font-bold mb-6">Post a Job</h1>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <TextInput label="Job Title" apiName="Name" value={job.Name} />
                <TextInput label="Organization" apiName="Organization__c" value={job.Organization__c} />
                <TextInput label="Location" apiName="Location__c" />
                <TextInput label="Salary" apiName="Salary__c" />

                {/* Posted/Closing Dates */}
                <fieldset className="border rounded p-4 mb-6">
                    <legend className="text-lg font-semibold">Active Dates</legend>
                    <div className="mb-4">
                        <DateInput label="Posting Date" name="PostingDate__c" defaultValue={new Date()} fieldType="date" />
                        <CheckBox label="Open Until Filled?" name="OpenUntilFilled__c" />
                        <DateInput label="Closing Date" name="ClosingDate__c" defaultValue={new Date()} fieldType="date" />
                    </div>
                </fieldset>

                <FileUpload label="Post Attachment" name="jobAttachment" applicationId={JOB_POSTING_APP_ID} standalone={false} />
                <Button label="Post Job" buttonType="submit" />
            </form>
        </div>
    );
}
