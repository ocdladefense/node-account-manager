import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { getJobQuery } from "./JobsQuery";
import JobList from "./JobsList";
import Job from "../../models/Job";

export default function Jobs() {
    const { client } = useOutletContext();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // let newJob = new Job("Public Defender 1", "125,000 yr.");
    // let newJob2 = new Job("Public Defender 2", "130,000 yr.");
    // newJob.description = "Handles public defense cases.";
    // newJob2.description = "Handles public defense cases.";

    // let jobs = [newJob, newJob2];
    // let countJobs = 0;

    useEffect(() => {
        async function fetchJobs() {
            const jobQuery = getJob(jobId);


            try {
                setLoading(true);
                const response = await client.query(jobQuery);
                setContact(response.records[0]);
            } catch (err) {
                setError(err);
                console.error("Error fetching job:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchJobs();
    }, []);

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
