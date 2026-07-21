import { FileUpload, uploadFileToServer } from "../ui/form/FileUpload.jsx";
import { useOutletContext } from "react-router-dom";
import TextInput from "../ui/form/TextInput.jsx";
import DateInput from "../ui/form/DateInput.jsx";
import Button from "../ui/Button.jsx";
import Job from "../../models/Job.js";

/**
 * Renders the Job Posting Form page for creating new job listings and handling file upploads.
 *
 * @returns {React.JSX.Element} The job posting form UI
 */
export default function JobForm() {
    const JOB_POSTING_APP_ID = 3;
    const { client, metadata } = useOutletContext();

    const handleSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        let title = 'Test Title';
        let record = {
            Name: title,
            Salary__c: "DOE"
        };

        let resp = await client.create('Job__c', record);

        let data = await resp.json();

        let jobId = data.id;

        const input = document.getElementById("jobAttachment");

        const files = [...input.files];

        const file = files[0];

        uploadFileToServer(file, JOB_POSTING_APP_ID, undefined, { jobId });





        // let jobPosting = new Job("Capital Defense Lawyer", "DOE");

        // console.log("JobUploadHandleSubmit:", e);

        // // Some kind of fetch() call to our Express server.

        // fetch("/jobs/upload", {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json"
        //     },
        //     body: JSON.stringify(jobPosting)
        // })
        //     .then((response) => response.json())
        //     .then(doTheUploadThing)
        //     .catch((error) => {
        //         console.error("JobUploadHandleSubmit: Error:", error);
        //     });

        // Upload Job Title and Salary to the server.

        // Then returned a result, which will include the Job Posting ID.

        // Then process the file upload, which will be associated with the Job Posting ID.
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

                <FileUpload label="Post Attachment" name="jobAttachment" applicationId={JOB_POSTING_APP_ID} standalone={false} />

                <Button label="Post Job" buttonType="submit" />
            </form>
        </div>
    );
}
