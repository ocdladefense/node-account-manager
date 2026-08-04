import { FileUpload, uploadFileToServer, deleteFile, FileView } from "../ui/form/FileUpload.jsx";
import { useOutletContext, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useToast } from "../ui/notifications/ToastService.jsx";
import TextInput from "../ui/form/TextInput.jsx";
import DateInput from "../ui/form/DateInput.jsx";
import Button from "../ui/Button.jsx";
import { CautionButton, BackButton } from "../ui/Button.jsx";
import CheckBox from "../ui/form/CheckBox.jsx";
import { response } from "express";

/**
 * Renders the Job Posting Form page for creating new job listings and handling file upploads.
 *
 * @returns {React.JSX.Element} The job posting form UI
 */
export default function JobForm({ job = {}, onCancel = null }) {
    const navigate = useNavigate();
    const { client } = useOutletContext();
    const { CreateToast, UpdateToast } = useToast();
    const [deleteFile, setDeleteFile] = useState(false);
    const JOB_POSTING_APP_ID = 3;

    const handleDelete = async (e) => {
        if (window.confirm("Delete this job listing? This cannot be undone.")) {
            let fileResult;

            if (job.AttachmentPath__c) {
                fileResult = await deleteFile(`JobPostings/${job.Id}`, true, true);
            }

            if (job.AttachmentPath__c && !fileResult.success) {
                alert("Failed to delete file: " + fileResult.error);
            }
            else {
                await client.delete("Job__c", job.Id);
                navigate(`/jobs`);
            }

        }
        return;
    }

    const handleCancel = async (e) => {
        if (window.confirm("Discard all changes? This cannot be undone.")) {
            onCancel();
        }
        return;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        //const form = e.target;
        const formData = new FormData(e.target);
        const jobRecord = {
            Name: formData.get("Name"),
            Organization__c: formData.get("Organization__c"),
            Location__c: formData.get("Location__c"),
            Salary__c: formData.get("Salary__c"),
            PostingDate__c: formData.get("PostingDate__c") || null,
            ClosingDate__c: formData.get("ClosingDate__c") || null,
            OpenUntilFilled__c: formData.get("OpenUntilFilled__c") === "on",
            IsActive__c: true
        };


        let response;


        if (job.Id) {
            jobRecord.Id = job.Id;
            response = updateJobPosting(jobRecord);
        }
        else {
            response = createJobPosting(jobRecord);
        }

        let confirmation = await response.json();
        let jobId = confirmation.id;

        attachFile(jobId)

        navigate(`/job/${jobId}`);
    };

    const createJobPosting = async (jobRecord) => {
        const response = await client.create('Job__c', jobRecord);
        CreateToast(<div className="bg-green-500 text-black px-6 py-4 text-lg font-semibold rounded-lg shadow-lg">
            Job Posted.
        </div>);
        return response;
    }

    const updateJobPosting = async (jobRecord) => {
        const response = await client.update('Job__c', jobRecord);
        CreateToast(<div className="bg-green-500 text-black px-6 py-4 text-lg font-semibold rounded-lg shadow-lg">
            Changes saved.
        </div>);
        return response;
    }

    const attachFile = async (jobId) => {

        const fileInput = document.getElementById("jobAttachment");
        const fileList = fileInput.files;
        const file = fileList[0];

        if (file && jobId) {
            const uploadResult = await uploadFileToServer(file, JOB_POSTING_APP_ID, undefined, { jobId });

            const filePath = `${jobId}/${file.name}`;

            const jobRecord = {
                Id: jobId,
                AttachmentPath__c: filePath
            }

            updateJobPosting(jobRecord);
        }
    }

    return (
        <div className="container mx-auto px-2">
            <h1 className="text-2xl font-bold mb-6 mt-6">{job.Id ? "Edit Job Posting" : "Post a Job"}</h1>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-1 gap-4">
                {!onCancel && <BackButton action={() => navigate(`/jobs`)} label="< Back" buttonType="button" />}
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

                <FileUpload label="Post Attachment" name="jobAttachment" applicationId={JOB_POSTING_APP_ID} accepting=".pdf,.doc,.docx" preview="true" />
                {job?.AttachmentPath__c && (
                    <FileView
                        files={[job.AttachmentPath__c]}
                        deleteFunction={() => {}}
                    />
                )}
                <Button label={job.Id ? "Save Changes" : "Post Job"} buttonType="submit" />
                {job.Id && <CautionButton className="" action={handleDelete} label="Delete Job" buttonType="button" />}
                {onCancel && <Button className="bg-yellow-300!" action={handleCancel} label="Discard Changes" buttonType="button" />}
            </form>
        </div>
    );
}
