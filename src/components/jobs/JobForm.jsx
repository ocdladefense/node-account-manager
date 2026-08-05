import { FileUpload, uploadFileToServer, deleteFile, FileView } from "../ui/form/FileUpload.jsx";
import { useOutletContext, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useToast } from "../ui/notifications/ToastService.jsx";
import TextInput from "../ui/form/TextInput.jsx";
import DateInput from "../ui/form/DateInput.jsx";
import Button from "../ui/Button.jsx";
import { CautionButton, BackButton } from "../ui/Button.jsx";
import CheckBox from "../ui/form/CheckBox.jsx";

/**
 * Renders the Job Posting Form page for creating new job listings and handling file uploads.
 *
 * @returns {React.JSX.Element} The job posting form UI
 */
export default function JobForm({ job = {}, onCancel = null }) {
    const navigate = useNavigate();
    const { client } = useOutletContext();
    const { CreateToast, UpdateToast } = useToast();
    const [postingDate, setPostingDate] = useState(job.PostingDate__c || "today");
    const [isOpenUntilFilled, setIsOpenUntilFilled] = useState(job.OpenUntilFilled__c ?? false );
    const [removeFile, setRemoveFile] = useState(false);
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
        
        if(job.Id) jobRecord.Id = job.Id;
        
        let response = job.Id ? await client.update('Job__c', jobRecord) 
                              : await client.create('Job__c', jobRecord);

        let jobId; 

        if (response.status === 204){ jobId = job.Id; }
        else {
            let json = await response.json();
            jobId = json.id;
        }

        const fileInput = document.getElementById("jobAttachment");
        const fileList = fileInput.files;
        const file = fileList[0];

        if (file){
            if (job.AttachmentPath__c) deleteFile("JobPostings/" + job.AttachmentPath__c);
            
            const uploadResult = await uploadFileToServer(file, JOB_POSTING_APP_ID, undefined, { jobId });

            const filePath = `${jobId}/${file.name}`;

            await client.update('Job__c', {
                Id: jobId,
                AttachmentPath__c: filePath
            });

        } else if(removeFile){
            deleteFile("JobPostings/" + job.AttachmentPath__c);
            await client.update('Job__c', {
                Id: jobId,
                AttachmentPath__c: null
            })
        }

        CreateToast(<div className="bg-green-500 text-black px-6 py-4 text-lg font-semibold rounded-lg shadow-lg">
            {job.Id ? "Changes saved" : "Job Posted"}
        </div>);

        navigate(`/job/${jobId}`);
    };


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
                        <DateInput label="Posting Date" name="PostingDate__c" fieldType="date" defaultValue={postingDate} min={"today"} onChange={(e) => setPostingDate(e.target.value)} />

                        <CheckBox label="Open Until Filled?" name="OpenUntilFilled__c" defaultValue={job.OpenUntilFilled__c} onChange={(e) => setIsOpenUntilFilled(e.target.checked)} />

                        {!isOpenUntilFilled && <DateInput label="Closing Date" name="ClosingDate__c" fieldType="date" defaultValue={job.ClosingDate__c || postingDate} min={postingDate} />}
                    </div>
                </fieldset>

                <FileUpload label="Post Attachment" name="jobAttachment" applicationId={JOB_POSTING_APP_ID} accepting=".pdf,.doc,.docx" preview="true" />
                {job?.AttachmentPath__c && (
                    <FileView
                        filePaths={[job.AttachmentPath__c]}
                        action={(path) => {setRemoveFile(!removeFile)}}
                        buttonLabel={removeFile ? "Restore File" : "Delete File"}
                    />
                )}
                <Button label={job.Id ? "Save Changes" : "Post Job"} buttonType="submit" />
                {job.Id && <CautionButton action={handleDelete} label="Delete Job" buttonType="button" />}
                {onCancel && <CautionButton action={handleCancel} label="Discard Changes" buttonType="button" isCancel={true} />}
            </form>
        </div>
    );
}
