import { useNavigate } from "react-router-dom";
import Button from "../ui/Button.jsx";
import Job from "../../models/Job.js";

export default function Job({ job = {} }) {
    const navigate = useNavigate();

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
                <Button label={job.Id ? "Save Changes" : "Post Job"} buttonType="submit" />
                {job.Id && <Button className="bg-red-800" action={handleDelete} label="Delete Job" buttonType="button" />}
            </form>
        </div>
    );
}
