import { useOutletContext } from "react-router-dom";
import JobList from "./JobsList";
import Job from "../../models/Job";

export default function Jobs() {
    const { client } = useOutletContext();
    let newJob = new Job("Public Defender 1", "125,000 yr.");
    let newJob2 = new Job("Public Defender 2", "130,000 yr.");
    newJob.description = "Handles public defense cases.";
    newJob2.description = "Handles public defense cases.";

    let jobs = [newJob, newJob2];
    let countJobs = 0;

    return (
        <div className="container mx-auto px-2 mt-7">

            <h1 className="card-title">There are currently {jobs.length} jobs active.</h1>

            <a href="/jobs/upload" className="link">
                Upload a job!
            </a>

            <JobList jobs={jobs} />
        </div>
    )
}
