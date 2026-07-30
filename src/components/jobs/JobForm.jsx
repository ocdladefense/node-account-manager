import { FileUpload, uploadFileToServer } from "../ui/form/FileUpload.jsx";
import { useOutletContext, useNavigate } from "react-router-dom";
import { useToast } from "../ui/notifications/ToastService.jsx";
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
export default function JobForm({ job = {}, onCancel = null }) {
    const navigate = useNavigate();
    const JOB_POSTING_APP_ID = 3;
    const { client } = useOutletContext();
    const { CreateToast, UpdateToast } = useToast();

    const handleDelete = async (e) => {
        if (window.confirm("Are you sure you want to delete this job listing?")) {
            await client.delete("Job__c", job.Id);
            navigate(`/jobs`);
        }
        return;
    }

    const handleCancel = async (e) => {
        if (window.confirm("Are you sure you want to discard changes?")) {
            onCancel();
        }
        return;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const form = e.target;
        const formData = new FormData(form);
        let resp;

        const record = {
            Name: formData.get("Name"),
            Organization__c: formData.get("Organization__c"),
            Location__c: formData.get("Location__c"),
            Salary__c: formData.get("Salary__c"),
            PostingDate__c: formData.get("PostingDate__c") || null,
            ClosingDate__c: formData.get("ClosingDate__c") || null,
            OpenUntilFilled__c: formData.get("OpenUntilFilled__c") === "on",
            IsActive__c: true
        };

        if (job.Id) {
            record.Id = job.Id;
            resp = await client.update('Job__c', record);
            CreateToast(<div className="bg-green-500 text-black px-6 py-4 text-lg font-semibold rounded-lg shadow-lg">
                Changes saved.
            </div>);

            navigate(`/job/${job.Id}`);
        }
        else {
            resp = await client.create('Job__c', record);
        }

        let data = await resp.json();
        let jobId = data.id;

        const input = document.getElementById("jobAttachment");

        const files = [...input.files];

        const file = files[0];

        if (file && jobId) {
            const uploadResult = await uploadFileToServer(file, JOB_POSTING_APP_ID, undefined, { jobId });

            const filePath = `${jobId}/${file.name}`;

            const updateResp = await client.update('Job__c', {
                Id: jobId,
                AttachmentPath__c: filePath
            });

            console.log("Salesforce update result:", updateResp);

            navigate(`/job/${jobId}`);
        }
    };

    return (
        <div className="container mx-auto px-2">
            <h1 className="text-2xl font-bold mb-6">Post a Job</h1>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-1 gap-4">
                {!onCancel && <Button className="!w-fit !bg-white !text-gray-800 !border border-black-300 !hover:bg-gray-100 !px-3 !py-1 !text-sm !font-medium !rounded-lg !transition-colors" action={() => navigate(`/jobs`)} label="< Back" buttonType="button"></Button>}
                <TextInput label="Job Title" apiName="Name" value={job.Name} />
                <TextInput label="Organization" apiName="Organization__c" value={job.Organization__c} />
                <TextInput label="Location" apiName="Location__c" value={job.Location__c} />
                <TextInput label="Salary" apiName="Salary__c" value={job.Salary__c} />

                {/* Posted/Closing Dates */}
                <fieldset className="border rounded p-4 mb-6">
                    <legend className="text-lg font-semibold">Active Dates</legend>
                    <div className="mb-4">
                        <DateInput label="Posting Date" name="PostingDate__c" fieldType="date" defaultValue={job.PostingDate__c || new Date()} />
                        <CheckBox label="Open Until Filled?" name="OpenUntilFilled__c" defaultValue={job.OpenUntilFilled__c} />
                        <DateInput label="Closing Date" name="ClosingDate__c" fieldType="date" defaultValue={job.ClosingDate__c || new Date()} />
                    </div>
                </fieldset>

                <FileUpload label="Post Attachment" name="jobAttachment" applicationId={JOB_POSTING_APP_ID} standalone={false} />
                <Button label={job.Id ? "Save Changes" : "Post Job"} buttonType="submit" />
                {job.Id && <Button className="!bg-red-800" action={handleDelete} label="Delete Job" buttonType="button" />}
                {onCancel && <Button className="!bg-yellow-300" action={handleCancel} label="Discard Changes" buttonType="button" />}
            </form>
        </div>
    );
}
