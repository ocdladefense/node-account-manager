import {FileUpload, uploadFileToServer} from "../ui/form/FileUpload";
import {TextInput} from "../ui/form/TextInput";
import {DateInput} from "../ui/form/DateInput";
import Button from "../ui/Button.jsx";
import {Job} from "../../models/Job.js";

export default function JobsUpload(){
    const JOB_POSTING_APP_ID = 3;
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        let jobPosting = new Job();

        console.log("JobUploadHandleSubmit:", e);
    };

    return (
        <div className="container mx-auto px-2">
            <h1 className="text-2xl font-bold mb-6">Post a Job</h1>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <TextInput label="Job Title" apiName="jobTitle" />

                <TextInput label="Job Description" apiName="jobDescription" />

                <TextInput label="Organization" apiName="jobOrganization" />

                <TextInput label="Salary" apiName="jobSalary" />

                <DateInput label="Application closing date" name="jobCloseDate" type="Date" defaultValue={Date.now()} />

                <Button label="Post Job" buttonType="submit" />

            </form>

            <FileUpload label="Post Attachment" name="jobAttachment" applicationId={JOB_POSTING_APP_ID}/>
        </div>
    );
}