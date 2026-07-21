import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { getJobsQuery } from "./JobsQuery";
import JobList from "./JobsList";

/**
 * Renders the Jobs list page, handling data fetching, loading, and error states
 * @returns {React.JSX.Element} The active jobs overview layout
 */
export default function Jobs() {
    const { client } = useOutletContext();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        async function fetchJobs() {
            const jobsQuery = getJobsQuery();


            try {
                setLoading(true);
                const response = await client.query(jobsQuery);
                console.log(response);
                setJobs(response.records);
            } catch (err) {
                setError(err);
                console.error("Error fetching jobs:", err);
            } finally {
                setLoading(false);
            }
        }

        if(client) fetchJobs();
    }, [client]);

    if(loading) return <div>Loading...</div>;
    if(error) return <div>Error: {error.message}</div>;

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
