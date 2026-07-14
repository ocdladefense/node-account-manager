import JobList from "./JobsList";
import Job from "../../models/Job";

export default function Jobs(){

    let newJob = new Job("Dev", "does cool stuff");
    let newJob2 = new Job("Dev2", "does cool stuff");

    let jobs = [newJob, newJob2];

    return (
        <div className="container mx-auto px-2 mt-[28px]">

            <a href="/jobs/upload">
                Upload a job!
            </a>

            <h1>Jobs Page Foobar</h1>
            <JobList jobs={jobs} />
        </div>
    )
}