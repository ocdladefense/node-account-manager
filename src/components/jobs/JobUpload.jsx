import {FileUpload, uploadFileToServer} from "../ui/form/FileUpload";
import {Job} from "../../models/Job.js";

export default function JobsUpload(){
    const JOB_POSTING_APP_ID = 3;
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        let jobPosting = new Job();
    };

    return (
        <div className="container mx-auto px-2">
            <h1 className="text-2xl font-bold mb-6">Post a Job</h1>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <label for="title">Job Name</label>
                <input type="text" id="title" name="title" placeholder="Enter job name" />
                
                <label for="description">Job description</label>
                <input type="text" id="description" name="description" placeholder="Enter job description" />

                <label for="organization">Organization</label>
                <input type="text" id="organization" name="organization" placeholder="Enter organization name" />
                
                <label for="salary">Salary</label>
                <input type="number" step="0.01" id="salary" name="salary" placeholder="Enter salary here" />

                <label for="closeDate">Application closing date</label>
                <input type="date" id="closeDate" name="closeDate" />

                <input type="submit" value="submit" />
            </form>

            <FileUpload label="Job Posting" name="job-posting" applicationId={JOB_POSTING_APP_ID}/>
        </div>
    );
}