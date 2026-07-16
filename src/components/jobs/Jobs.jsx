import { useOutletContext } from "react-router-dom";
import JobList from "./JobsList";
import Job from "../../models/Job";

export default function Jobs() {
    const { client } = useOutletContext();
    let newJob = new Job("Dev", "does cool stuff");
    let newJob2 = new Job("Dev2", "does cool stuff");

    let jobs = [newJob, newJob2];

    return (
        <div className="container mx-auto px-2 mt-7">

            <a href="/jobs/upload" className="link">
                Upload a job!
            </a>

            <h1 className="card-title">Jobs Page Foobar</h1>
            <JobList jobs={jobs} />
        </div>
    )
}
